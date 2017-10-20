import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import GalleryViewer from '../../src/GalleryViewer';

class BasicExample extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  showGallery = (index) => {
    this.setState({
      boolShowGallery: true,
      index
    })
  }
  closeGallery = () => {
    this.setState({
      boolShowGallery: false
    });
  }
  render() {
    const styles = require('../scss/example.css');
    const imageArr = [
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQQaEde-HaYe-7YPwfkqKX_fIoDCv3tq6DYrLPCaiGh9rtZUATq33l2dJ2KPg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtY0KKx3WeMtqsJPvwHrmh_IXQ5Adez1MJSc9TcVJGyP46tpN33gOwjYDb4g',
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQQaEde-HaYe-7YPwfkqKX_fIoDCv3tq6DYrLPCaiGh9rtZUATq33l2dJ2KPg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtY0KKx3WeMtqsJPvwHrmh_IXQ5Adez1MJSc9TcVJGyP46tpN33gOwjYDb4g',
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQQaEde-HaYe-7YPwfkqKX_fIoDCv3tq6DYrLPCaiGh9rtZUATq33l2dJ2KPg'
    ];
    return (
      <div>
        <div className={styles.thumbnailContainer}>
          {
            imageArr.map((image, index) =>
              <div
                key={`thumb-${index}`}
                className={styles.thumbnail}
                onClick={this.showGallery.bind(this, index)}>
                <img src={image} />
              </div>
            )
          }
        </div>
        {
          this.state.boolShowGallery &&
          <div className={styles.containerClass}>
            <GalleryViewer
              closeIcon="http://image.ibb.co/djY7t6/close_icon.png"
              currentSlide={this.state.index}
              closeImageGallery={this.closeGallery}
              onCurrentIndexChange={this.onCurrentIndexChange}>
              {
                imageArr.map((image, index) =>
                  <div
                    className={styles.imageContainer}
                    key={`gallery-${index}`}>
                    <img src={image} />
                    <div className={styles.info}>
                      Image no {index}
                    </div>
                  </div>
                )
              }
            </GalleryViewer>
          </div>
        }
      </div>
    );
  }
}

ReactDOM.render(
  <BasicExample />,
  document.getElementById('exampleContainer')
);
