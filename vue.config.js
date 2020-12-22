const path = require('path')

function resolve(dir) {
  return path.join(__dirname,dir)
}

module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    port: 2008
  },
  //vue cli3，引用绝对路径的方法，这里通过webpack将@作为根目录src的别名
  chainWebpack: (config)=>{
    config.resolve.alias
      .set('@',resolve('./src'))
  }
  // ,
  // rules: [
  //   {
  //     test: /\.less$/,
  //     loader: "style-loader!css-loader!less-loader"
  //   }
  // ]
}


