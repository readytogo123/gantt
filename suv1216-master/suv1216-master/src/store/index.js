import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem, removeItem } from '@/utils/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // 保存token在vuex里面，方便组件传值，公用token
  state: {

    // 设置VUEX初始值时候，先从本地存储中存取，如果取不到，则初始值为空
    tokenInfo: getItem('tokenInfo') || {},

    // 保存用户个人信息，id,name,photo
    userInfo: getItem('userInfo') || {}
  },
  mutations: {
    // 设置mutations来更新userInfo里面的头像信息
    SetUserPhoto (state, photo) {
      // 1.保存token到vuex中去
      state.userInfo.photo = photo

      // 2.数据持久化处理，保存token到localstorage中去
      setItem('userInfo', photo)
    },
    // 设置mutations来更新userInfo
    SetUserInfo (state, userObj) {
      // 1.保存token到vuex中去
      state.userInfo = userObj

      // 2.数据持久化处理，保存token到localstorage中去
      setItem('userInfo', userObj)
    },

    // 调用token，更新token
    SetTokenInfo (state, tokenObj) {
      // 1.保存token到vuex中去
      state.tokenInfo = tokenObj
      // 2.数据持久化处理，保存token到localstorage中去
      setItem('tokenInfo', tokenObj)
    },

    ClearTokenInfo (state) {
      state.tokenInfo = {}
      removeItem('tokenInfo')
    }
  },
  // 相当于计算属性，基于state里面的数据，从而产生新的数据
  getters: {
    isLogin (state) {
      if (state.tokenInfo.token) {
        return true
      } else {
        return false
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
