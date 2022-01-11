import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout/index.vue'
import Home from '@/views/home'
import User from '@/views/user'
import Video from '@/views/video'
import Question from '@/views/question'
import Search from '@/views/search'
import Result from '@/views/search/result.vue'
import Article from '@/views/article'
import store from '@/store'
import Profile from '@/views/user/profile'
import Chat from '@/views/user/chat'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      // meta---$route路由对象里面的一个属性，本身是个对象，自己可以补充一些键值对
      { path: '/', name: 'home', component: Home, meta: { isKeepAlive: true } },
      { path: '/user', name: 'user', component: User },
      { path: '/video', name: 'video', component: Video },
      { path: '/question', name: 'question', component: Question }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/search/result',
    name: 'searchResult',
    component: Result
  },
  {
    path: '/article/:id',
    name: 'article',
    component: Article,
    meta: { isKeepAlive: true }
  },
  {
    path: '/user/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/user/chat',
    name: 'chat',
    component: Chat
  }

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

router.beforeEach(function (to, from, next) {
  const token = store.state.tokenInfo.token
  if (to.path !== '/login' && !token) return next('/login?backto=' + to.fullPath)

  next()
})

export default router
