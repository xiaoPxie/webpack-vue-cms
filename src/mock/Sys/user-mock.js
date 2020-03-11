import ApiPath from '../../apis/api-path'

// mock配置基本步骤
// 1、引入mockjs
import Mock from 'mockjs'
// 2、获取 mock.Random 对象
let Random = Mock.Random

// loadsh-array
const _array = require('lodash/array')
const userList = require('../Sys/user-list.json')
let roles = require('../Sys/role-list.json')

// 格式化
const formatRole = function (tableData) {
  let jsonStr = window.localStorage.getItem('roleManageList')
  if(!jsonStr)
    roles = JSON.parse(roles).data
  else
    roles = JSON.parse(jsonStr)
  tableData.forEach((item, index) => {
    item.roles.forEach((item1, index1) => {
      let name;
      for(let x of roles) {
        if(item1 === x.id) {
          name = x.name
        }
      }
      item.roles.splice(index1, 1, {
        id: item1,
        name: name
      })
    })
  })
}

// mock一堆用户
const returnData = function (row) {
  let sysUserInfoList = [...userList.data];
  for (let i = 0; i < row; i++) {
    let sysUserInfoObj = {
      id: Random.integer(1000, 1000000) + '',
      userName: Random.word(8, 16),
      nickName: Random.cname(),    // Random.cname() 随机生成一个常见的中文姓名
      password: Random.word(8, 16), // 随机生成密码
      roles: ["3", "4"]
    }
    sysUserInfoList.push(sysUserInfoObj)
  }
  return sysUserInfoList
}

// 列表mock接口
let returnDataInfo = function(param) {
  console.group("Mock：用户管理列表接口:")
  console.log(param)
  console.groupEnd()

  // 接收参数
  let tableData = [],
    body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0

  let jsonStr = window.localStorage.getItem('userManageList')
  if (!jsonStr) {
    // tableData = dataInfoReturnObj.data.slice((currentPage - 1) * row, currentPage * row)
    tableData = returnData(row)
    total = tableData.length
    // tableData 存在localstorage
    window.localStorage.setItem('userManageList', JSON.stringify(tableData))
    tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  } else { // 否则，读取localStorage
    tableData = JSON.parse(jsonStr)
    total = tableData.length
    tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  }

  // 格式化role字段的数据，如： ['1','2'] => [{id: 'xxx', name: 'xxxx'},{id: 'xxx', name: 'xxxx'}]
  formatRole(tableData)

  return {
    code: '1000',               // 成功与否标识
    message: '操作成功！',   // 返回信息
    total: total,
    tableData: tableData
  }
}


let returnAddReq = function (param) {
  console.group("Mock：用户管理信息添加接口:")
  console.log(param)
  console.groupEnd();

  let body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('userManageList'))

  // tableData
  let obj = { // 页面传来的参数构造出来的obj
    id: Random.integer(1000, 1000000) + '',
    userName: body.data.userName,
    nickName: body.data.nickName,
    password: body.data.password,
    roles: body.data.roles
  };
  tableData.push(obj)
  // 将tableData和treeData存在localstorage
  window.localStorage.setItem('userManageList', JSON.stringify(tableData))

  // 格式化role字段的数据，如： ['1','2'] => [{id: 'xxx', name: 'xxxx'},{id: 'xxx', name: 'xxxx'}]
  formatRole(tableData)

  // 按分页参数返回数据
  total = tableData.length
  tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  return {
    code: '1000',               // 成功与否标识
    message: '操作成功！',   // 返回信息
    total: total,
    tableData: tableData
  }
}

let returnDeleteReq = function(param) {
  console.group("Mock：用户管理信息删除接口:")
  console.log(param)
  console.groupEnd();

  let body = JSON.parse(param.body), //
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('userManageList'))

  // 被过滤掉的tableData数组，存在localstorage
  _array.remove(tableData, (item) => {
    if (body.Ids.indexOf(item.id) !== -1)
      return true
  })
  // 存在localstorage
  window.localStorage.setItem('userManageList', JSON.stringify(tableData))

  // 格式化role字段的数据，如： ['1','2'] => [{id: 'xxx', name: 'xxxx'},{id: 'xxx', name: 'xxxx'}]
  formatRole(tableData)

  // 按分页参数返回数据
  total = tableData.length
  tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  return {
    code: '1000',
    message: '操作成功！',
    total: total,
    tableData: tableData
  }
}

let returnUpdateReq = function (param) {
  console.group("Mock：用户管理信息编辑接口:")
  console.log(param)
  console.groupEnd();

  let body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('userManageList'))

  // tableData
  let obj = { // 页面传来的参数构造出来的obj
    id: body.data.id + '',
    userName: body.data.userName,
    nickName: body.data.nickName,
    password: body.data.password,
    roles: body.data.roles
  };
  tableData.forEach((item, index) => {
    if(item.id === obj.id) {
      tableData.splice(index, 1, obj)
    }
  })

  // 将tableData和treeData存在localstorage
  window.localStorage.setItem('userManageList', JSON.stringify(tableData))

  // 格式化role字段的数据，如： ['1','2'] => [{id: 'xxx', name: 'xxxx'},{id: 'xxx', name: 'xxxx'}]
  formatRole(tableData)

  // 按分页参数返回数据
  total = tableData.length
  tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  return {
    code: '1000',               // 成功与否标识
    message: '操作成功！',   // 返回信息
    total: total,
    tableData: tableData
  }
}

// 3、接收ajax请求，并返回模拟数据，这里使用函数的形式制定模拟数据
// 模拟ajax请求的响应时间，默认(10ms-300ms)
Mock.setup({
  timeout: '100-300'
})
// mock插件的问题，带参数get请求有bug，用正则+'.*'能解决大部分问题
// 接收列表接口的请求
Mock.mock(RegExp(ApiPath.sysUser.getDataInfo + '.*'), 'post', returnDataInfo)
// 接收信息删除接口的请求
Mock.mock(RegExp(ApiPath.sysUser.deleteDataInfo + '.*'), 'post', returnDeleteReq)
// 接收信息添加接口的请求
Mock.mock(RegExp(ApiPath.sysUser.addDataInfo + '.*'), 'post', returnAddReq)
// // 接收信息编辑接口的请求
Mock.mock(RegExp(ApiPath.sysUser.updateDataInfo + '.*'), 'post', returnUpdateReq)
