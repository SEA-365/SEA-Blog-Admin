import request from '@/utils/request'

export function getArticleList(query) {
  return request({
    url: '/articles/list', // 获取文章列表
    method: 'post',
    data: query
  })
}

export function getArticleById(id) {
  return request({
    url: `/articles/${id}`, // 获取指定文章
    method: 'get',
    params: { id }
  })
}

export function addArticle(data) {
  return request({
    url: '/articles/',  // 新增文章
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/articles/', // 修改文章
    method: 'put',
    data
  })
}

export function deleteArticleById(id) {

  return request({
    url: '/articles/logic',  // 删除指定文章
    method: 'delete',
    data: [id],
    headers: { 'Content-Type': 'application/json' },  // 设置请求头
  })
}


export function uploadImg(data){
  return request({
    url: 'articles/uploadImg', // 上传文章封面
    method: 'post',
    data
  })
}


