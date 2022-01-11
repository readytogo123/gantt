// 下面是封装登录页面的ajax请求
import ajax from '@/utils/request'

export const login = (mobile, code) => {
  return ajax({
    method: 'POST', // 接口请求的方式
    url: '/app/v1_0/authorizations', // 接口的地址
    data: { // 如果接口约定是 Body传参-- 请求体， 要通过data去写数据
      mobile: mobile,
      code: code
    }
  })
}

// 下面是获取用户资料
// 包括：姓名，性别，生日......
export const getProfile = () => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 点击关注用户，userId
export const followUser = userId => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 下面是-----点击取消关注用户的-----接口
export const unFollowUser = userId => {
  return ajax({
    method: 'DELETE',
    url: '/app/v1_0/user/followings/' + userId
  })
}

// 下面是-----获取用户自己的信息的-----接口
export const getInfo = () => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

// 下面是弹层的接口-----修改个人信息：姓名，性别，年龄的接口
export const updateUserInfo = obj => {
  return ajax({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: obj
  })
}

// 下面是修改用户头像的接口
export const updatePhoto = obj => {
  return ajax({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data: obj
  })
}
