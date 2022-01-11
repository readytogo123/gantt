import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import '@/styles/index.less'
import { formatTime, relativeTime } from '@/utils/day.js'

Vue.filter('formatTime', formatTime)
Vue.filter('relativeTime', relativeTime)

Vue.use(Vant)
Vue.use(Lazyload)
// 注册事件总线
Vue.prototype.$eventBus = new Vue()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
