// 封装---输入框输入关键词，获取搜索建议，的接口函数
import ajax from '@/utils/request'
export const getSuggestion = keyword => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: {
      q: keyword
    }
  })
}

// 封装---搜索关键词和页码，获取搜索结果的接口函数
export const getSearch = (q, page = 1) => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/search',
    params: {
      q,
      page
    }
  })
}
