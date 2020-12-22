function transformSrc(src) {
  if (src == null)
    return ''

  //把域名换成远程云服务器
  let temp = src.split("//");
  return 'https://www.freetour.top//' + temp[2]
}

function transform(addForm) {
  //要处理的是属性的属性，在此之前要对属性判空
  //另：浏览器的控制台能定位错误好吧！
  if (addForm.postcard!=null) {
    addForm.postcard.src = transformSrc(addForm.postcard.src)
  }
  if (addForm.richText!=null) {
    addForm.richText.src = transformSrc(addForm.richText.src)
  }
  if (addForm.slider!=null) {
    addForm.slider.src = transformSrc(addForm.slider.src)
  }

  if (addForm.introImgs!=null) {
    for (let i = 0; i < addForm.introImgs.length; i++) {
      addForm.introImgs[i].src = transformSrc(addForm.introImgs[i].src)
    }
  }
  return addForm
}

export {transform,transformSrc}
