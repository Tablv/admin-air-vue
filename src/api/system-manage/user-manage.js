import request from '@/utils/request'

// 列表
export function userList(query) {
    return request({
        url: '/admin/system/user/list',
        method: 'get',
        params: {
            current: 1,
            limit: 10,
            offset: 1
        }
    })
}
// 新增用户接口
export function userListAdd() {
    return request({
        url: '/admin/system/user/add',
        method: 'post',
    })
}
