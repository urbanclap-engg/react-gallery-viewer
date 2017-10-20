# React Gallery Viewer for mobile device

## Introduction
A google like image viewer, which is highly performant. With fullscreen images and data and lots of images the DOM gets heavy and results in janks across low end devices, this package aims to solve that issue for mobile currently[Desktop maybe in future releases].


## Demo Link

<img src="https://cdn.pbrd.co/images/NdP8aaHom.png" width="550"/>


## Install

```bash
npm install --save react-gallery-viewer
npm run demo:watch
Open http://localhost:5000/
```


## Usage

````js
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
    const styles = require('../css/example.css');
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
`````

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| slidesInDOM | Number | `3` | Number of slides to be kept in DOM |
| onCurrentIndexChange | Function | `` | Callback to be called after currentSlide changes |
| currentSlide | Number | `0` | Current Slide |
| boolDisableScroll | Boolean | `false` | To Disable scroll of the gallery |
| closeImageGallery | Function | `` | Callback to be called after the gallery closes |
| containerClass | String | `` | Class name to be applied on the container of gallery |
| closeIcon | Boolean | `` | Close icon image source to be used in gallery |
```

## Example

`npm run demo:watch` and then go to `http://localhost:5000/`


