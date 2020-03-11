import ApiPath from '../../apis/api-path'

// mock配置基本步骤
// 1、引入mockjs
import Mock from 'mockjs'
// 2、获取 mock.Random 对象
let Random = Mock.Random

const privilegeTree = require('../Sys/privilege-tree.json')
const _array = require('lodash/array')

const mergePrivilege = (navList, pList) => {
  _array.remove(navList, (item, index) => {
    if(item.children.length)
      mergePrivilege(item.children, pList)
    if(
      item.type !== '1' ||    // 不是菜单权限的去掉
      ! pList.find((x) => {                       // 移除用户所没有的privilege
        return x.privilegeId === item.privilegeId
      }) ) {
      return true
    }
  })
}

// 左侧导航栏列表mock接口
let returnDataInfo = function(param) {
  console.group("Mock：侧导航栏列表接口:")
  console.log(param)
  console.groupEnd()

  let navList = [],
    body = JSON.parse(param.body),
    treeList = JSON.parse(window.localStorage.getItem('privilegeTree'))
  // body: "{"mergePrivilegeList":[{"privilegeId":"1","path":"","privilegeName":"系统管理"},{"privilegeId":"3","path":"/sys/role/list","privilegeName":"角色管理"},

  if(body.mergePrivilegeList.length) {
    if(!treeList)
      navList = JSON.parse(JSON.stringify(privilegeTree.data[0].children ))// 取根节点的children作为导航tree列表
    else
      navList = JSON.parse(JSON.stringify(treeList[0].children))
    // 根据vuex存储的权限列表进行匹配，没有权限的菜单将会被隐藏 -- 模拟后端根据用户拥有的角色，在库表中进行查询权限列表
    mergePrivilege(navList, body.mergePrivilegeList)

    return {
      code: '1000',                 // 成功与否标识
      message: '操作成功！',   // 返回信息
      data: navList
    }
  }

  return {
    code: '1001',                 // 成功与否标识
    message: '初始化导航栏失败，请重新登录系统！',   // 返回信息
    data: navList
  }
}


// 3、接收ajax请求，并返回模拟数据，这里使用函数的形式制定模拟数据
// 模拟ajax请求的响应时间，默认(10ms-300ms)
Mock.setup({
  timeout: '100-300'
})
// mock插件的问题，带参数get请求有bug，用正则+'.*'能解决大部分问题
// 接收导航信息列表接口的请求
Mock.mock(RegExp(ApiPath.nav.getDataInfo + '.*'), 'post', returnDataInfo)
