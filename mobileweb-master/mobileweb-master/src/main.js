import Vue from 'vue'
import App from './App.vue'
import router from './router/auth.js'

// 脚手架自动创建的vuex.store
import store from './store'

// 下面这一步是引入vant所有的组件
import Vant from 'vant'

// 引用它的样式
import 'vant/lib/index.css'

import 'amfe-flexible'

import '@/styles/index.less'

import EventBus from './utils/eventBus'

Vue.prototype.$eventBus = EventBus

Vue.use(Vant)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
