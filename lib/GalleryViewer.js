'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LEFT = -1;
var RIGHT = 1;
var NONE = 0;

var GalleryViewer = function (_Component) {
  _inherits(GalleryViewer, _Component);

  function GalleryViewer(props) {
    _classCallCheck(this, GalleryViewer);

    var _this = _possibleConstructorReturn(this, (GalleryViewer.__proto__ || Object.getPrototypeOf(GalleryViewer)).call(this, props));

    _this.resetSlider = function (event) {
      if (event.propertyName === 'transform' && event.srcElement.tagName === 'UL') {
        _this.setState({
          currentSlide: _this.currentSlide,
          boolEnableSlide: true,
          trackStyleObj: {
            transform: 'translate3d(0, 0, 0)',
            transition: ''
          }
        }, function () {
          if (!!_this.props.onCurrentIndexChange) {
            _this.props.onCurrentIndexChange(_this.state.currentSlide);
          }
        });
      }
    };

    _this.startTouch = function (event) {
      if (_this.props.boolDisableScroll || !_this.state.boolEnableSlide) return;
      _this.setState({
        boolTouchEnd: false,
        trackStyleObj: {
          transition: ''
        }
      });
      _this.dragStart = true;
      _this.boolDragDirectionCalculated = false;
      _this.boolVerticalScroll = true;
      _this.scrollDirection = NONE;
      _this.startingTouchPosition = event.pageX || event.nativeEvent.touches[0].pageX;
      _this.verticalDragPosition = event.pageY || event.nativeEvent.touches[0].pageY;
    };

    _this.updateTouch = function (event) {
      if (!_this.dragStart || !_this.state.boolEnableSlide) return;
      var xPos = event.pageX || event.nativeEvent.touches[0].pageX;
      var scrollDiff = xPos - _this.startingTouchPosition;
      _this.scrollDirection = NONE;
      if (_this.boolDragDirectionCalculated && _this.boolVerticalScroll) {
        return;
      }
      var yPos = event.pageY || event.nativeEvent.touches[0].pageY;
      var verticalScrollDiff = yPos - _this.verticalDragPosition;
      if (!_this.boolDragDirectionCalculated) {
        _this.boolDragDirectionCalculated = true;
        if (Math.abs(scrollDiff) > 5) {
          _this.setState({
            containerStyleObj: {
              overflow: 'hidden'
            }
          });
          _this.boolVerticalScroll = false;
        } else if (Math.abs(verticalScrollDiff) > 5) {
          _this.dragStart = false;
          _this.boolVerticalScroll = true;
          return;
        }
      }
      if (scrollDiff > 40) {
        _this.scrollDirection = LEFT;
      } else if (scrollDiff < -40) {
        _this.scrollDirection = RIGHT;
      }
      // if (this.scrollDirection === LEFT && this.state.currentSlide === 0) return;
      // this.imageTrack.style.transform = `translate3d(${scrollDiff}px, 0, 0)`;
      var trackStyleObj = {
        transition: '',
        transform: 'translate3d(' + scrollDiff + 'px, 0, 0)'
      };
      _this.setState({
        trackStyleObj: trackStyleObj
      });
    };

    _this.endTouch = function () {
      if (_this.props.boolDisableScroll || !_this.state.boolEnableSlide) return;
      _this.boolVerticalScroll = true;
      _this.dragStart = false;
      _this.boolDragDirectionCalculated = false;
      _this.updateSliderPosition();
    };

    _this.updateSliderPosition = function () {
      var newIndex = -1;
      var translateVal = 0;
      switch (_this.scrollDirection) {
        case NONE:
          newIndex = _this.state.currentSlide;
          translateVal = 0;
          break;
        case LEFT:
          newIndex = _this.state.currentSlide - 1;
          translateVal = _this.screenWidth + _this.GUTTER_SPACE;
          break;
        case RIGHT:
          newIndex = _this.state.currentSlide + 1;
          translateVal = -(_this.screenWidth + _this.GUTTER_SPACE);
          break;
        default:
          newIndex = _this.state.currentSlide;
          translateVal = 0;
          break;
      }
      if (_this.scrollDirection === LEFT && _this.state.currentSlide === 0) {
        newIndex = 0;
        translateVal = 0;
      } else if (_this.scrollDirection === RIGHT && _this.state.currentSlide === _this.props.children.length - 1) {
        newIndex = _this.props.children.length - 1;
        translateVal = 0;
      }
      var trackStyleObj = {
        transition: 'transform 0.33s cubic-bezier(0, 0, 0.3, 1)',
        transform: 'translate3d(' + translateVal + 'px, 0, 0)'
      };
      if (_this.state.currentSlide !== newIndex) {
        _this.currentSlide = newIndex;
        _this.setState({
          boolEnableSlide: false
        });
      }
      _this.setState({
        boolTouchEnd: true,
        trackStyleObj: trackStyleObj,
        containerStyleObj: {
          overflow: 'visible'
        }
      });
    };

    _this.closeImageGallery = function () {
      if (typeof _this.props.closeImageGallery === 'function') {
        _this.props.closeImageGallery();
      }
    };

    _this.imageList = Array(_this.props.slidesInDom || 3).fill(null);
    _this.screenWidth = window ? window.innerWidth : 0;
    _this.screenHeight = window ? window.innerHeight : 0;
    _this.GUTTER_SPACE = 10;
    _this.currentSlide = _this.props.currentSlide || 0;
    _this.nodeStyleObj = [{
      transform: 'translate3d(-' + (_this.screenWidth + _this.GUTTER_SPACE) + 'px, 0, 0)'
    }, {
      transform: 'translate3d(0, 0, 0)'
    }, {
      transform: 'translate3d(' + (_this.screenWidth + _this.GUTTER_SPACE) + 'px, 0, 0)'
    }];
    _this.state = {
      currentSlide: _this.props.currentSlide || 0,
      slideWidth: _this.screenWidth,
      currentImages: [],
      containerStyleObj: {},
      trackStyleObj: {},
      boolEnableSlide: true
    };
    return _this;
  }

  _createClass(GalleryViewer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      window.addEventListener('resize', function () {
        _this2.setState({
          slideWidth: window.innerWidth
        });
      });
      this.imageTrack.addEventListener('transitionend', this.resetSlider);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currentSlide = this.state.currentSlide;
      var newCurrentSlide = nextProps.currentSlide;
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
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var styles = require('./GalleryViewer.css');
      var currentSlide = this.state.currentSlide;
      var renderImageArr = this.props.children.filter(function (ImageComponent, index) {
        return index > currentSlide - 2 && index < currentSlide + 2;
      });
      var containerStyle = _extends({}, this.state.containerStyleObj, {
        height: this.screenHeight,
        width: this.screenWidth
      });
      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)(styles.imageGalleryContainer, !!this.props.containerClass && this.props.containerClass),
          style: containerStyle },
        this.props.closeIcon && _react2.default.createElement('img', {
          onClick: this.closeImageGallery,
          className: styles.crossIcon,
          src: this.props.closeIcon }),
        _react2.default.createElement(
          'ul',
          {
            className: styles.imageListContainer,
            onTouchStart: this.startTouch,
            onTouchMove: this.updateTouch,
            onTouchEnd: this.endTouch,
            style: this.state.trackStyleObj,
            ref: function ref(r) {
              return _this3.imageTrack = r;
            } },
          renderImageArr.map(function (ImageComponent, index) {
            return _react2.default.createElement(
              'li',
              {
                key: index,
                className: styles.imageItem,
                style: _this3.state.currentSlide === 0 ? _this3.nodeStyleObj[index + 1] : _this3.nodeStyleObj[index],
                ref: function ref(r) {
                  return _this3.imageList[index] = r;
                } },
              ImageComponent
            );
          })
        )
      );
    }
  }]);

  return GalleryViewer;
}(_react.Component);

exports.default = GalleryViewer;