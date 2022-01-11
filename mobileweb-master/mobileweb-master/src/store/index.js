import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem, removeItem } from '@/utils/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 这个token先从本地存储里面找，找到就行，找不到的话，就用{}
    tokenInfo: getItem('tokenInfo') || {},

    // 这行代码是用来保存用户的ID,NAME,PHOTO
    userInfo: getItem('userInfo') || {}
  },

  mutations: {
    settokeninfo (state, tokenobj) {
      // 保存token到vuex里面
      state.tokenInfo = tokenobj

      // 持久化处理，保存到本地存储
      setItem('tokenInfo', tokenobj)
    },

    // 设置mutation来更新userInfo
    mSetUserInfo (state, userObj) {
      // 1.保存到vuex里面
      state.userInfo = userObj

      // 2.做持久化处理，防止刷新一下就不见了，保存到localstorage
      setItem('userInfo', userObj)
    },

    // 设置mutation来设置userInfo里面的头像信息
    mSetUserPhoto (state, photo) {
      // 1.保存到vuex里面
      state.userInfo.photo = photo

      // 2.做持久化处理，防止刷新一下就不见了，保存到localstorage
      setItem('userInfo', state.userInfo)
    }
  },

  actions: {
  },

  modules: {
  },

  mClearTokenInfo (state) {
    // 1.保存到vuex里面，方便多组件之间的数据共享
    state.tokenInfo = {}

    // 2.做持久化处理，并且保存到localstorage
    removeItem('tokenInfo')
  }
})
