import ajax from '@/utils/request'

export const getSuggestion = keyword => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q: keyword
    }
  })
}

export const getSearch = (q, page) => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      q,
      page
    }
  })
}
