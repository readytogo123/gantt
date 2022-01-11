module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 可以把所有元素的px单位转换成rem单位
      // rootvalue:转换成px的基准值

      rootValue: 37.5,

      propList: ['*']

    }
  }
}
