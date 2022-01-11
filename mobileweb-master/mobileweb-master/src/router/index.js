import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout/index.vue'

import Home from '@/views/home'
import Question from '@/views/question'
import User from '@/views/user'
import Video from '@/views/video'
import Search from '@/views/search'
import Article from '@/views/article'
import Result from '@/views/search/result.vue'
import store from '@/store/index.js'
import Chat from '@/views/user/chat.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: '/video', component: Video },
      { path: '/question', component: Question },
      { path: '/user', component: User }
    ]
  },

  { path: '/search', name: 'search', component: Search },
  { path: '/search/result', name: 'searchResult', component: Result },
  {
    path: '/article/:id',
    name: 'article',
    component: Article
  },
  {
    path: '/user/profile',
    name: 'userProfile',
    component: () => import('@/views/user/profile.vue')
    // component: Profile
  },
  { path: '/user/chat', name: 'chat', component: Chat }
]

const router = new VueRouter({
  routes
})

router.beforeEach(function (to, from, next) {
  console.log('路由变化了', to, from, next)

  // 注意：next()-----表示从from跳转到to
  // 注意：next(其他路由)-----表示跳转到指定路由

  // 如果访问的user页面需要登录才能进入，那么首先判断有没有登录再说

  if (to.path === '/user') {
    // 1.判断是否登录
    if (store.state.tokenInfo.token) {
      console.log('有token，可以访问该页面')

      next()
    } else {
      console.log('没有token，禁止访问该页面')

      next('/login?backto=' + to.fullPath)

      // 注意：fullPath包含了路径以及查询字符串的内容
      // 注意：next()是对当前动作结束的一种处置方法
      // 和express框架里面的res.end()作用一样
      // 跳转到login页面的时候，通过路由的query携带要跳回的信息即可
    }
  } else {
    next()
  }
})

export default router
