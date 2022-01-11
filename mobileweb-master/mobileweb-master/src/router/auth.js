import router from './index.js'

import store from '@/store/index.js'

router.beforeEach(function (to, from, next) {
  console.log('路由变化了', to, from, next)

  // to:   去到哪里？ /b
  // from: 从哪里来？ /a
  // next: 是一个函数，用来自定义路由的跳转
  //  (1) next() 表示放行，让路由从from进入到to
  //  (2) next(其它路由),表示不去to，而进入指定的路由
  // next()

  // 如果你要去的页面是需要登陆才能访问的，则先去检查一下你是否登陆：
  //  - 没有登陆，转到登陆页
  //  - 正常放行

  // fullPath: 包含了path及查询字符串的内容
  if (to.path === '/user') {
    // 检查是否登陆
    if (store.state.tokenInfo.token) {
      console.log('你有身份证，可以访问')

      next()
    } else {
      console.log('没有身份证，转到login')

      next('/login?backto=' + to.fullPath)
    }
  } else {
    next()
  }
})

export default router
