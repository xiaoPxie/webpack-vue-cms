import ApiPath from '../../apis/api-path'

// mock配置基本步骤
// 1、引入mockjs
import Mock from 'mockjs'
// 2、获取 mock.Random 对象
let Random = Mock.Random

let userJsonList = require('../Sys/user-list.json')
let roleJsonList = require('../Sys/role-list.json')

const duplicateRemoval = function(mergePrivilegeList) {
  return mergePrivilegeList.filter((item, index) => {
    for(let i=0; i<mergePrivilegeList.length; i++) {
      if(item.privilegeId === mergePrivilegeList[i].privilegeId && i !== index) {
        break
      } else if(item.privilegeId === mergePrivilegeList[i].privilegeId && i === index) {
        return true
      }
    }
  })
}

// 登录mock接口
let returnDataInfo = function(param) {
  console.group("Mock：登录接口:")
  console.log(param)
  console.groupEnd()

  let roleJsonStr = window.localStorage.getItem('roleManageList'),
    userJsonStr = window.localStorage.getItem('userManageList'),
    mergePrivilegeList = []

  let body = JSON.parse(param.body)
  if(body && body.data) {
    let userList = [], roleList = []
    /* 若用户列表以及角色列表的localstorage都为空，则读取json文件 start */
    if (!userJsonStr)
      userList = userJsonList.data
    else
      userList = JSON.parse(userJsonStr)
    if (!roleJsonStr)
      roleList = roleJsonList.data
    else
      roleList = JSON.parse(roleJsonStr)
    /* 若用户列表以及角色列表的localstorage都为空，则读取json文件 end */

    for(let item of userList) {
      if(item.userName === body.data.userName
        && item.password === body.data.password){
        item.roles.forEach((id) => {
          for(let x of roleList) {
            if(x.id === id) {
              mergePrivilegeList.push(...x.privilegeList)
            }
          }
        })
        // 去重
        mergePrivilegeList = duplicateRemoval(mergePrivilegeList)
        // console.log(mergePrivilegeList)
        return {
          code: '1000',
          message: '登录成功，即将为您跳转到首页！',
          token: item.userName + '-' + Date.now(),
          mergePrivilegeList: mergePrivilegeList
        }
      }
    }
  }

  return {
    code: '1001',                 // 成功与否标识
    message: '用户或密码不正确！',   // 返回信息
  }
}

let getUserInfoByToken = function(param) {
  console.group("Mock：token获取用户权限接口:")
  console.log(param)
  console.groupEnd()

  let roleJsonStr = window.localStorage.getItem('roleManageList'),
    userJsonStr = window.localStorage.getItem('userManageList'),
    mergePrivilegeList = []

  let body = JSON.parse(param.body)
  if(body && body.data) {
    let userList = [], roleList = []
    /* 若用户列表以及角色列表的localstorage都为空，则读取json文件 start */
    if (!userJsonStr)
      userList = userJsonList.data
    else
      userList = JSON.parse(userJsonStr)
    if (!roleJsonStr)
      roleList = roleJsonList.data
    else
      roleList = JSON.parse(roleJsonStr)
    /* 若用户列表以及角色列表的localstorage都为空，则读取json文件 end */

    for(let item of userList) {
      if(item.userName === body.data.split('-')[0]){
        item.roles.forEach((id) => {
          for(let x of roleList) {
            if(x.id === id) {
              mergePrivilegeList.push(...x.privilegeList)
            }
          }
        })
        // 去重
        mergePrivilegeList = duplicateRemoval(mergePrivilegeList)

        return {
          code: '1000',
          message: '登录成功，即将为您跳转到首页！',
          token: item.userName + '-' + Date.now(),
          mergePrivilegeList: mergePrivilegeList
        }
      }
    }
  }
}


// 3、接收ajax请求，并返回模拟数据，这里使用函数的形式制定模拟数据
// 模拟ajax请求的响应时间，默认(10ms-300ms)
Mock.setup({
  timeout: '100-300'
})
// mock插件的问题，带参数get请求有bug，用正则+'.*'能解决大部分问题
// 登录请求
Mock.mock(RegExp(ApiPath.login.onLogin + '.*'), 'post', returnDataInfo)
// token获取用户权限请求
Mock.mock(RegExp(ApiPath.login.getUserInfoByToken + '.*'), 'post', getUserInfoByToken)
