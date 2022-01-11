// 封装---获取频道相关的函数
import ajax from '@/utils/request'
export const getChannels = () => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

// 封装---获取所有频道的接口
export const getAllChannels = () => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

// 封装---新增频道功能的接口
// 把当前选中的所有频道全部传入，包括新增和选中的，但是不包括下方的推荐频道
export const addChannels = channels => {
  return ajax({
    method: 'put',
    url: '/app/v1_0/user/channels',
    data: {
      channels: channels
    }
  })
}

// 封装---删除频道的接口，是在本地删除，而不是在服务器删除
export const deleteChannels = channelId => {
  return ajax({
    method: 'delete',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [channelId]
    }
  })
}
