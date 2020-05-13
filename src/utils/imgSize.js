// imgSize.js
//  图片尺寸限制
const imgSize = (file,width,height) => {
  return new Promise((resolve, reject) => {
    let url = window.URL || window.webkitURL;
    let img = new Image();
    img.onload = function () {
      // 图片比例校验
      // let valid = img.width / img.height === 1080/1618
      // let nigger = img.width=== width && img.height === height
      let valid = 1 === 1
      // resolve&reject一定要携带参数，才能将处理结果传递出去
      valid ? resolve(valid) : reject(valid);
    };
    img.src = url.createObjectURL(file);
  })
}

export default imgSize;
