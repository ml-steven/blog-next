import request from '@/utils/request'

export function getArtSort(_id) {
  return request({
    url: `/api/artsortdetail/${_id}`,
    method: 'get'
  })
}

export function getArtSortList(query) {
  return request({
    url: '/api/artsort/list',
    method: 'get',
    params: query
  })
}

export function deleteArtSort(_id) {
  return request({
    url: `/api/artsort/${_id}`,
    method: 'delete',
  })
}

export function updateArtSort(data) {
  return request({
    url: `/api/artsort`,
    method: 'put',
    data:data
  })
}

export function createArtSort(data) {
  return request({
    url: `/api/artsort`,
    method: 'post',
    data:data
  })
}

