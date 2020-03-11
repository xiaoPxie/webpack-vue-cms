import ApiPath from '../../apis/api-path'

// mock配置基本步骤
// 1、引入mockjs
import Mock from 'mockjs'
// 2、获取 mock.Random 对象
let Random = Mock.Random

// loadsh-array
const _array = require('lodash/array')
const privilegeTree = require('./privilege-tree.json')
const dataInfoReturnObj = require('./role-list.json')

// 列表mock接口
let returnDataInfo = function(param) {
  console.group("Mock：角色管理列表接口:")
  console.log(param)
  console.groupEnd()

  // 接收参数
  let tableData = [],
    body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0

  let jsonStr = window.localStorage.getItem('roleManageList')
  // localStorage中没有存储，则读取json文件
  if (!jsonStr) {
    tableData = dataInfoReturnObj.data.slice((currentPage - 1) * row, currentPage * row)
    total = dataInfoReturnObj.data.length
    // tableData 存在localstorage
    window.localStorage.setItem('roleManageList', JSON.stringify(dataInfoReturnObj.data))
  } else { // 否则，读取localStorage
    tableData = JSON.parse(jsonStr)
    if(!currentPage || !row) {  // 用户管理中使用到
      // tableData = tableData.slice()
      return {
        code: '1000',               // 成功与否标识
        message: '操作成功！',   // 返回信息
        tableData: tableData,
      }
    }
    total = tableData.length
    tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  }

  return {
    code: '1000',               // 成功与否标识
    message: '操作成功！',   // 返回信息
    total: total,
    tableData: tableData,
    treeData: JSON.parse(window.localStorage.getItem('privilegeTree')),
  }
}


let returnAddReq = function (param) {
  console.group("Mock：角色管理信息添加接口:")
  console.log(param)
  console.groupEnd();

  let id = 1,
    body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('roleManageList')),
    treeList = JSON.parse(window.localStorage.getItem('privilegeTree'));

  if (tableData.length)
    id = Number(tableData[tableData.length - 1].id) + 1
  // tableData
  let obj = { // 页面传来的参数构造出来的obj
    id: id + '',
    name: body.data.name,
    privilegeList: body.data.privilegeList
  };
  tableData.push(obj)
  // // 将tableData和treeData存在localstorage
  window.localStorage.setItem('roleManageList', JSON.stringify(tableData))

  // 按分页参数返回数据
  total = tableData.length
  tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  return {
    code: '1000',               // 成功与否标识
    message: '操作成功！',   // 返回信息
    total: total,
    tableData: tableData,
    treeData: treeList
  }
}

let returnDeleteReq = function(param) {
  console.group("Mock：角色管理信息删除接口:")
  console.log(param)
  console.groupEnd();

  let body = JSON.parse(param.body), //
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('roleManageList')),
    treeList = JSON.parse(window.localStorage.getItem('privilegeTree'));

  // 被过滤掉的tableData数组，存在localstorage
  _array.remove(tableData, (item) => {
    if (body.Ids.indexOf(item.id) !== -1)
      return true
  })
  // 存在localstorage
  window.localStorage.setItem('roleManageList', JSON.stringify(tableData))

  // 按分页参数返回数据
  total = tableData.length
  tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  return {
    code: '1000',
    message: '操作成功！',
    total: total,
    tableData: tableData,
    treeData: treeList
  }
}

let returnUpdateReq = function (param) {
  console.group("Mock：角色管理信息编辑接口:")
  console.log(param)
  console.groupEnd();

  let body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('roleManageList')),
    treeList = JSON.parse(window.localStorage.getItem('privilegeTree'));

  // tableData
  let obj = { // 页面传来的参数构造出来的obj
    id: body.data.id,
    name: body.data.name,
    privilegeList: body.data.privilegeList
  };
  tableData.forEach((item, index) => {
    if(item.id === obj.id) {
      tableData.splice(index, 1, obj)
    }
  })
  console.log(tableData)
  // tableData.push(obj)
  // 将tableData和treeData存在localstorage
  window.localStorage.setItem('roleManageList', JSON.stringify(tableData))

  // 按分页参数返回数据
  total = tableData.length
  tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  return {
    code: '1000',               // 成功与否标识
    message: '操作成功！',   // 返回信息
    total: total,
    tableData: tableData,
    treeData: treeList
  }
}

// 3、接收ajax请求，并返回模拟数据，这里使用函数的形式制定模拟数据
// 模拟ajax请求的响应时间，默认(10ms-300ms)
Mock.setup({
  timeout: '100-300'
})
// mock插件的问题，带参数get请求有bug，用正则+'.*'能解决大部分问题
// 接收列表接口的请求
Mock.mock(RegExp(ApiPath.sysRole.getDataInfo + '.*'), 'post', returnDataInfo)
// 接收信息删除接口的请求
Mock.mock(RegExp(ApiPath.sysRole.deleteDataInfo + '.*'), 'post', returnDeleteReq)
// 接收信息添加接口的请求
Mock.mock(RegExp(ApiPath.sysRole.addDataInfo + '.*'), 'post', returnAddReq)
// 接收信息编辑接口的请求
Mock.mock(RegExp(ApiPath.sysRole.updateDataInfo + '.*'), 'post', returnUpdateReq)
