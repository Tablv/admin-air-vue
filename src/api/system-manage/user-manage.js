import request from '@/utils/request'

// 列表
export function userList() {
    return request({
        url: '/admin/system/user/list',
        method: 'get'
    })
}

// 新增
export function userListAdd() {
    return request({
        url: '/admin/system/user/add',
        method: 'post',
    })
}
