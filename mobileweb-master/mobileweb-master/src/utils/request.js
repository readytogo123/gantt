// 下面对axios进行  二次封装
// 1.接口地址；   2.请求/响应拦截器

import axios from 'axios'

import store from '@/store/index.js'

import JSONBig from 'json-bigint'

import router from '@/router/index.js'

// const ins3 = axios.create({
//   baseURL: 'http://ttapi.research.itcast.cn',
//   transformResponse: [function (data) {
//     try {
//       return JSONBig.parse(data)
//     } catch (err) {
//       return data
//     }
//   }]
// })

const ins1 = axios.create({
  // 下面是后端的服务器1
  baseURL: 'http://ttapi.research.itcast.cn',
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

ins1.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 向本次请求中添加headers,设置token值
  // 从vuex中去获取token。
  const token = store.state.tokenInfo.token
  console.log('所有的请求在发出去之前，都会到这里来', store.state.tokenInfo, token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加一个响应拦截器，-----所有的请求发回来之后，都会来到这里
ins1.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, async function (error) {
  console.log('响应拦截器，拦截到了错误')

  if (error.response && error.response.status === 401) {
    // 2.遇到了401错误

    const refreshToken = store.state.tokenInfo.refresh_token
    if (refreshToken) {
      // 3. 用resfreshToken再发请求
      try {
        const result = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
        // 4. 成功获取新token

        console.log('用refresh_token取回来的新的token', result)

        const newToken = result.data.data.token

        // 5. 保存新token到vuex

        store.commit('mSetTokenInfo', {

          token: newToken,
          refresh_token: refreshToken

        })

        // 6. 重新发请求
        // error.表示401错误。error.config表示出这个错误时，所要发出的请求的配置
        return ins1(error.config) // 重新去发一次请求
      } catch {
        console.log('用refresh_token更新token失败, 只能去做一次登陆')

        // 路由跳转
        // currentRoute: 当前路由

        router.push('/login?backto=' + router.currentRoute.fullPath)
      }
    } else {
      // 回到登陆页

      console.log('没有refresh_token, 只能去做一次登陆')

      // 路由跳转
      // currentRoute: 当前路由

      router.push('/login?backto=' + router.currentRoute.fullPath)
    }
  }
  return Promise.reject(error)
})

const ins2 = axios.create({
  // 下面是后端的服务器2
  baseURL: 'http://api-toutiao-web.itheima.net'
})

export { ins1, ins2 }

// 下面默认导出的是服务器2
export default ins1
