import request from '@/utils/request'

// 上传图片
export function uploadImg(data) {
  return request({
    url: '/api/upload/single',
    method: 'post',
    data: data
  })
}
// 清理缓存
export function clearCache() {
  return request({
    url: '/api/clearCache',
    method: 'post',
  })
}