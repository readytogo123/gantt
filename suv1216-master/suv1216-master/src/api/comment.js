// 封装---用户自己评论相关的函数
import ajax from '@/utils/request'
export const addComment = (articleId, content) => {
  return ajax({
    method: 'post',
    url: '/app/v1_0/comments',
    data: {
      // 请求体body传参，要用data来写
      target: articleId,
      content
    }
  })
}

// 封装---获取其他用户评论相关的函数
export const getComments = (articleId, offset) => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/comments',
    params: {
      type: 'a',
      source: articleId,
      offset
    }
  })
}

// 封装---获取文章评论回复---相关的函数
export const getCommentReplys = (replyId, offset) => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/comments',
    params: {
      type: 'c',
      source: replyId,
      offset
    }
  })
}

// 封装---对文章评论回复---相关的函数
export const addCommentReply = (commentId, articleId, content) => {
  return ajax({
    method: 'post',
    url: '/app/v1_0/comments',
    data: {
      target: commentId,
      art_id: articleId,
      content
    }
  })
}
