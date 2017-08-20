require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');


//利用自调用函数，将图片名信息转化为图片URL路径信息
//通过require("图片url"),加载图片
imageDatas = (function getImageUrl (imageDataArr) {
  for (var i = 0, length = imageDataArr.length; i < length; i++) {
    var singleImageData = imageDataArr[i];

    singleImageData.imageUrl = require('../images/' + singleImageData.fileName);

    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
}(imageDatas));



//获取区间内的随机值
function getRangeRandom(low, high) {
  return (Math.floor(Math.random() * (high - low) + low));
}


//随机取0~30度的函数
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.random() * 30);
}






//image component
class ImageComponent extends React.Component {
  render() {

    var styleObj = {};

    //如果props中有pos值指定图片的位置
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }


    //如果图片的旋转角度有值且不为零，添加旋转角度
    if(this.props.arrange.rotate) {
      ['-ms-', '-webkit-', '-moz-', ''].forEach(function (val) {
        styleObj[val + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)' ;
      }.bind(this))
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img className="yeoman-img" src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}










//最外层的component
class AppComponent extends React.Component {


  constructor(props) {
    super(props);
    this.Constant = {
      //舞台中心图片的取值
      centerPos: {
        left:0,
        right:0
      },
      //舞台左右两部分的取值
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      //舞台上部分的取值
      vPosRange:{
        x:[0,0],
        topY:[0,0]
      }
    };

    //初始化state,图片的left，top位置
    this.state = {
      imgsArrangeArr:[]
    };
  }




  /*
   *重新排布所有的图片
   * @param cneterIndex 指定居中哪个图片
   */
  rearrange(centerIndex) {

    //获取上左右三个部分的向x,y取值范围
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,

      vPosRange = Constant.vPosRange,
      vPosRangeX = vPosRange.x,
      vPosRangeTopY = vPosRange.topY;


    //放在上面的图片
    let imgsArrangeTopArr = [];
    //在上区域图片的数量，取一或者不取
    let topImgNum = Math.ceil(Math.random() * 2);
    //记录放在上区域的图片是从图片数组哪个地方拿出来的
    let topImgSpliceIndex = 0;

    //放在中间的图片,把中心图片从图片组中提出来
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);


    //居中centerIndex的图片
    //居中的图片不旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos
    };


    //取出要布局上测的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    //从图片数组中提取出放在上部分的图片，topImgNum决定是否取值
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局位于上面的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]), // 调用上面的在区间内取随机数的函数
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
        },
        rotate:get30DegRandom()
      }
    });

      //布局位于两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      //前半部分在左边，右半部分在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i]= {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate:get30DegRandom()
      }
    }

    //把中间和上边的图片塞回图片数组
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }

    //设置state状态改变，重新渲染组件
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }





  //组件初始化之后加载的函数
  componentDidMount() {
    //拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDOM.scrollWidth;
    let stageH = stageDOM.scrollHeight;
    let halfStageW = Math.ceil(stageW / 2);
    let halfStageH = Math.ceil(stageH / 2);

    //拿到图片的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.ceil(imgW / 2);
    let halfImgH = Math.ceil(imgH / 2);

    //计算舞台中心图片的点
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };

    //计算左右区域的位置点范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] =  stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.rearrange(0);

  }





  render() {
    let controllerUnits = [];
    let imgFigures = [];

    //第一次渲染的时候，state中的值是空的，需要初始化一个值
    imageDatas.forEach(function (image,index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0
        }
      }

      imgFigures.push(<ImageComponent
        data={image}
        ref={'imgFigure'+ index}
        key={index}
        arrange={this.state.imgsArrangeArr[index]}
      />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
