import request from '@/utils/request'

export function getArticle(_id) {
  return request({
    url: `/api/articledetail/${_id}`,
    method: 'get'
  })
}

export function getArticleList(query) {
  return request({
    url: '/api/article/list',
    method: 'get',
    params: query
  })
}

export function deleteArticle(_id) {
  return request({
    url: `/api/article/${_id}`,
    method: 'delete',
  })
}

export function updateArticle(data) {
  return request({
    url: `/api/article`,
    method: 'put',
    data:data
  })
}

export function createArticle(data) {
  return request({
    url: `/api/article`,
    method: 'post',
    data:data
  })
}
