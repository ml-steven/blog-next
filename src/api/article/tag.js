import request from '@/utils/request'

export function getArtTag(_id) {
  return request({
    url: `/api/artTagdetail/${_id}`,
    method: 'get'
  })
}

export function getArtTagList(query) {
  return request({
    url: '/api/artTag/list',
    method: 'get',
    params: query
  })
}

export function deleteArtTag(_id) {
  return request({
    url: `/api/artTag/${_id}`,
    method: 'delete',
  })
}

export function updateArtTag(data) {
  return request({
    url: `/api/artTag`,
    method: 'put',
    data:data
  })
}

export function createArtTag(data) {
  return request({
    url: `/api/artTag`,
    method: 'post',
    data:data
  })
}

