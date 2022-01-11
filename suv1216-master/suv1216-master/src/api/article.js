// 封装---获取文章相关的函数-这是query传参
// timestamp-----获取当前文章数据就传递当前的时间戳
// body传参-----就是data---post
// query传参-----params----get
import ajax from '@/utils/request'
export const getArticles = (channelId, timestamp) => {
  return ajax({
    method: 'get',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp: timestamp,
      with_top: 1
    }
  })
}

// 封装---不感兴趣文章的接口
export const dislikeArticles = articleId => {
  return ajax({
    method: 'post',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 封装---举报文章的接口
export const reportArticles = (articleId, type) => {
  return ajax({
    method: 'post',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type: type
    }
  })
}

// 封装---根据文章编号(id)来获取文章详情---的接口
export const getArticle = id => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/articles/' + id
  })
}
