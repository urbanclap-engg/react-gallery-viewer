import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

const LEFT = -1;
const RIGHT = 1;
const NONE = 0;

class GalleryViewer extends Component {
  constructor(props) {
    super(props);
    this.imageList = Array(this.props.slidesInDom || 3).fill(null);
    this.screenWidth = window ? window.innerWidth : 0;
    this.screenHeight = window ? window.innerHeight : 0;
    this.GUTTER_SPACE = 10;
    this.currentSlide = this.props.currentSlide || 0;
    this.nodeStyleObj = [
      {
        transform: `translate3d(-${this.screenWidth + this.GUTTER_SPACE}px, 0, 0)`
      },
      {
        transform: `translate3d(0, 0, 0)`
      },
      {
        transform: `translate3d(${this.screenWidth + this.GUTTER_SPACE}px, 0, 0)`
      }
    ];
    this.state = {
      currentSlide: this.props.currentSlide || 0,
      slideWidth: this.screenWidth,
      currentImages: [],
      containerStyleObj: {},
      trackStyleObj: {},
      boolEnableSlide: true
    };
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        slideWidth: window.innerWidth
      });
    });
    this.imageTrack.addEventListener('transitionend', this.resetSlider);
  }
  componentWillReceiveProps(nextProps) {
    const currentSlide = this.state.currentSlide;
    const newCurrentSlide = nextProps.currentSlide;
    if (nextProps.boolDisableScroll !== this.props.boolDisableScroll) {
      this.setState({
        containerStyleObj: {
          overflow: nextProps.boolDisableScroll ? 'hidden' : 'visible'
        }
      });
    }
    if (currentSlide !== newCurrentSlide) {
      if (currentSlide < newCurrentSlide) {
        this.scrollDirection = RIGHT;
      } else {
        this.scrollDirection = LEFT;
      }
      this.updateSliderPosition();
    }
  }
  resetSlider = (event) => {
    if (event.propertyName === 'transform' && event.srcElement.tagName === 'UL') {
      this.setState({
        currentSlide: this.currentSlide,
        boolEnableSlide: true,
        trackStyleObj: {
          transform: 'translate3d(0, 0, 0)',
          transition: ''
        }
      }, () => {
        if (!!this.props.onCurrentIndexChange) {
          this.props.onCurrentIndexChange(this.state.currentSlide);
        }
      });
    }
  }
  startTouch = (event) => {
    if (this.props.boolDisableScroll || !this.state.boolEnableSlide) return;
    this.setState({
      boolTouchEnd: false,
      trackStyleObj: {
        transition: ''
      }
    });
    this.dragStart = true;
    this.boolDragDirectionCalculated = false;
    this.boolVerticalScroll = true;
    this.scrollDirection = NONE;
    this.startingTouchPosition = event.pageX || event.nativeEvent.touches[0].pageX;
    this.verticalDragPosition = event.pageY || event.nativeEvent.touches[0].pageY;
  }
  updateTouch = (event) => {
    if (!this.dragStart || !this.state.boolEnableSlide) return;
    const xPos = event.pageX || event.nativeEvent.touches[0].pageX;
    const scrollDiff = xPos - this.startingTouchPosition;
    this.scrollDirection = NONE;
    if (
      this.boolDragDirectionCalculated &&
      this.boolVerticalScroll
    ) {
      return;
    }
    const yPos = event.pageY || event.nativeEvent.touches[0].pageY;
    const verticalScrollDiff = yPos - this.verticalDragPosition;
    if (!this.boolDragDirectionCalculated) {
      this.boolDragDirectionCalculated = true;
      if (Math.abs(scrollDiff) > 5) {
        this.setState({
          containerStyleObj: {
            overflow: 'hidden'
          }
        });
        this.boolVerticalScroll = false;
      } else if (Math.abs(verticalScrollDiff) > 5) {
        this.dragStart = false;
        this.boolVerticalScroll = true;
        return;
      }
    }
    if (scrollDiff > 40) {
      this.scrollDirection = LEFT;
    } else if (scrollDiff < -40) {
      this.scrollDirection = RIGHT;
    }
    // if (this.scrollDirection === LEFT && this.state.currentSlide === 0) return;
    // this.imageTrack.style.transform = `translate3d(${scrollDiff}px, 0, 0)`;
    const trackStyleObj = {
      transition: '',
      transform: `translate3d(${scrollDiff}px, 0, 0)`
    };
    this.setState({
      trackStyleObj
    });
  }
  endTouch = () => {
    if (this.props.boolDisableScroll || !this.state.boolEnableSlide) return;
    this.boolVerticalScroll = true;
    this.dragStart = false;
    this.boolDragDirectionCalculated = false;
    this.updateSliderPosition();
  }
  updateSliderPosition = () => {
    let newIndex = -1;
    let translateVal = 0;
    switch (this.scrollDirection) {
      case NONE:
        newIndex = this.state.currentSlide;
        translateVal = 0;
        break;
      case LEFT:
        newIndex = this.state.currentSlide - 1;
        translateVal = this.screenWidth + this.GUTTER_SPACE;
        break;
      case RIGHT:
        newIndex = this.state.currentSlide + 1;
        translateVal = -(this.screenWidth + this.GUTTER_SPACE);
        break;
      default:
        newIndex = this.state.currentSlide;
        translateVal = 0;
        break;
    }
    if (this.scrollDirection === LEFT && this.state.currentSlide === 0) {
      newIndex = 0;
      translateVal = 0;
    } else if (this.scrollDirection === RIGHT && this.state.currentSlide === this.props.children.length - 1) {
      newIndex = this.props.children.length - 1;
      translateVal = 0;
    }
    const trackStyleObj = {
      transition: 'transform 0.33s cubic-bezier(0, 0, 0.3, 1)',
      transform: `translate3d(${translateVal}px, 0, 0)`
    };
    if (this.state.currentSlide !== newIndex) {
      this.currentSlide = newIndex;
      this.setState({
        boolEnableSlide: false
      });
    }
    this.setState({
      boolTouchEnd: true,
      trackStyleObj,
      containerStyleObj: {
        overflow: 'visible'
      }
    });
  }
  closeImageGallery = () => {
    if (typeof this.props.closeImageGallery === 'function') {
      this.props.closeImageGallery();
    }
  }
  render() {
    const styles = require('./GalleryViewer.css');
    const currentSlide = this.state.currentSlide;
    const renderImageArr = this.props.children.filter((ImageComponent, index) => index > currentSlide - 2 && index < currentSlide + 2);
    const containerStyle = {
      ...this.state.containerStyleObj,
      height: this.screenHeight,
      width: this.screenWidth
    };
    return (
      <div
        className={cx(
          styles.imageGalleryContainer,
          !!this.props.containerClass && this.props.containerClass
        )}
        style={containerStyle}>
        {
          this.props.closeIcon &&
          <img
            onClick={this.closeImageGallery}
            className={styles.crossIcon}
            src={this.props.closeIcon} />
        }
        <ul
          className={styles.imageListContainer}
          onTouchStart={this.startTouch}
          onTouchMove={this.updateTouch}
          onTouchEnd={this.endTouch}
          style={this.state.trackStyleObj}
          ref={(r) => this.imageTrack = r}>
        {
          renderImageArr.map((ImageComponent, index) =>
            <li
              key={index}
              className={styles.imageItem}
              style={
                this.state.currentSlide === 0 ?
                this.nodeStyleObj[index + 1] :
                this.nodeStyleObj[index]
              }
              ref={(r) => this.imageList[index] = r}>
              {ImageComponent}
            </li>
          )
        }
        </ul>
      </div>
    );
  }
}

export default GalleryViewer;
