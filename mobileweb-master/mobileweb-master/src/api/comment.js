import ajax from '@/utils/request'
/**
 * 对文章进行评论
 * @param {*} articleId 文章编号
 * @param {*} content 评论内容
 */

//  下面是发布文章评论的接口
export const addComment = (articleId, content) => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/comments',
    data: {
      target: articleId,
      content
    }
  })
}

// 下面是获取文章评论的接口
// offset是翻页的意思
export const getComments = (articleId, offset) => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type: 'a',
      source: articleId,
      offset
    }
  })
}

//   下面是对文章进行点赞的接口
export const addCommentLike = commentId => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

//   下面是对文章取消点赞的接口
export const deleteCommentLike = commentId => {
  return ajax({
    method: 'DELETE',
    url: '/app/v1_0/comment/likings/' + commentId
  })
}

/**
 * 获取文章评论的回复
 * @param {*} replyId 文章评论Id
 * @param {*} offset 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
 */
export const getCommentReplys = (replyId, offset) => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type: 'c', // a表示对文章的评论 ,c表示对评论的回复
      source: replyId,
      offset
    }
  })
}

/**
 * 对文章评论进行回复
 * @param {*} commentId 评论id
 * @param {*} content 内容
 * @param {*} articleId 文章id
 */
export const addCommentReply = (commentId, content, articleId) => {
  return ajax({
    method: 'POST',
    url: '/app/v1_0/comments',
    data: {
      target: commentId,
      content,
      art_id: articleId
    }
  })
}
