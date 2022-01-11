module.exports = {
  configureWebpack: (config) => {
  // configureWebpack配置是VUE脚手架提供的一个配置项
    console.log(config)
  },

  // 设置打包后访问资源的方式，以相对路径来访问
  // dist目录下的---index.html就可以直接访问了
  publicPath: './'
}
