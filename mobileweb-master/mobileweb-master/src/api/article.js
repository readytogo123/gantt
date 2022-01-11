import ajax from '@/utils/request'

export const getArticles = (channelId, timestamp) => {
  return ajax({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp: timestamp,
      with_top: 1
    }
  })
}

// 下面添加一个方法，便于调用接口
export const dislikeArticle = articleId => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

export const reportArticle = (articleId, type) => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type
    }
  })
}

// 根据文章编号来获取文章详情
export const getArticle = id => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/articles/' + id
  })
}

// 取消点赞，那么attitude=-1
export const deleteLike = id => {
  return ajax({
    method: 'DELETE',
    url: '/app/v1_0/article/likings/' + id
  })
}

// 添加点赞，那么attitude=1
export const addLike = id => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: id
    }
  })
}

// 取消不喜欢
export const deleteDisLike = id => {
  return ajax({
    method: 'DELETE',
    url: '/app/v1_0/article/dislikes/' + id
  })
}

// 添加不喜欢
export const addDisLike = id => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: id
    }
  })
}
