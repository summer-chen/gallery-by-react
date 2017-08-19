require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自调用函数，将图片名信息转化为图片URL路径信息
//通过require("图片url"),加载图片
imageDatas = (function getImageUrl (imageDataArr) {
  for (var i = 0, length = imageDataArr.length; i < length; i++) {
    var singleImageData = imageDataArr[i];

    singleImageData.imageUrl = require("../images/" + singleImageData.fileName);

    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
}(imageDatas));

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="image-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
