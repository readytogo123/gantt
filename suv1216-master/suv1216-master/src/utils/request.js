// axios二次封裝
// 接口基准地址，
// 请求，响应拦截器
import axios from 'axios'
import store from '@/store'
import JSONBIG from 'json-bigint'
import router from '@/router/index.js'
// 引进路由，做页面的跳转

const ins1 = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  transformResponse: [function (data) {
    // 这里用json-bigint处理大数问题
    try {
      return JSONBIG.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 下面是添加请求拦截器-----所有的请求在发出去之前，都会到这个请求拦截器里面
ins1.interceptors.request.use(config => {
  // 每次发送请求之前做些什么-----下面是给请求头添加token

  // 从vuex中的---state中获取token
  config.headers.Authorization = `Bearer ${store.state.tokenInfo.token}`

  return config
// 这里必须要有一个返回值，请求错误的时候会执行
}, e => Promise.reject(e))

// 下面是添加响应拦截器-----所有的请求在发出去之后，都会到这个请求拦截器里面
ins1.interceptors.response.use(response => {
  return response
}, async function (error) {
  if (error.response && error.response.status === 401) {
    const refreshToken = store.state.tokenInfo.refresh_token
    if (refreshToken) {
      // 1.用refreshToken发送请求
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
        console.log('用refresh_token取回来的新的token', result)
        // 2.发送请求之后，获得了新的token
        const newToken = result.data.data.token

        // 3.保存新的token到vuex里面去
        store.commit('SetTokenInfo', {
          token: newToken,
          refresh_token: refreshToken
        })

        // 4.重新发送请求
        // error.config表示401错误出现时，所要发出的请求的配置，默认携带了新的token
        return ins1(error.config)
      } catch (error) {
        // 路由跳转
        // currentRoute---表示当前路由
        router.push('/login?backto=' + router.currentRoute.fullPath)
      }
    } else {
      // 路由跳转
      // currentRoute---表示当前路由
      router.push('/login?backto=' + router.currentRoute.fullPath)
    }
  }
  return Promise.reject(error)
})

export default ins1
