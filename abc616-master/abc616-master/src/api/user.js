// 封装---用户登录相关的函数
import ajax from '@/utils/request'
export const login = (mobile, code) => {
  return ajax({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data: {
      // 请求体body传参，要用data来写
      mobile: mobile,
      code: code
    }
  })
}

// 封装---关注文章按钮的接口函数
export const followUser = userId => {
  return ajax({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 封装---取消关注文章按钮的接口函数
export const unFollowUser = userId => {
  return ajax({
    method: 'DELETE',
    url: '/app/v1_0/user/followings/' + userId
  })
}

// 封装---获取用户自己信息的接口函数
export const getInfo = () => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/user'
  })
}

// 封装---获取用户自己信息的接口函数
export const getProfile = () => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/user/profile'
  })
}

// 封装---获取用户个人信息的接口函数
export const updateUserInfo = obj => {
  return ajax({
    method: 'patch',
    url: '/app/v1_0/user/profile',
    data: obj
  })
}

// 封装---更改用户头像的接口函数
export const updatePhoto = obj => {
  return ajax({
    method: 'patch',
    url: '/app/v1_0/user/photo',
    data: obj
  })
}
