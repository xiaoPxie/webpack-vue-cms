import ApiPath from '../../apis/api-path'

// mock配置基本步骤
// 1、引入mockjs
import Mock from 'mockjs'
// 2、获取 mock.Random 对象
let Random = Mock.Random

// loadsh-array
const _array = require('lodash/array')
// const fileSaver = require('file-saver')
const dataInfoReturnObj = require('./privilege-list.json')
const privilegeTree = require('./privilege-tree.json')

const addPrivilegeChild = function (array, obj) {
  array.forEach((item) => {
    if (obj.parentId === item.privilegeId) {
      return item.children.push(obj)
    } else if (item.children.length) {
      return addPrivilegeChild(item.children, obj)
    }
  })
}

const deletePrivilegeChild = function (array, Ids) {
  _array.remove(array, (item) => {
    if (Ids.indexOf(item.privilegeId) !== -1) {
      return true
    } else if (item.children.length) {
      return deletePrivilegeChild(item.children, Ids)
    }
  })
}

// 列表mock接口
let returnDataInfo = function (param) {
  console.group("Mock：权限管理列表接口:")
  console.log(param)
  console.groupEnd();

  // 接收参数
  let tableData = [],
    body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0

  let jsonStr = window.localStorage.getItem('privilegeManageList')
  // localStorage中没有存储，则读取json文件
  if (!jsonStr) {
    tableData = dataInfoReturnObj.data.slice((currentPage - 1) * row, currentPage * row)
    total = dataInfoReturnObj.data.length
    // tableData 存在localstorage
    window.localStorage.setItem('privilegeManageList', JSON.stringify(dataInfoReturnObj.data))
    // treeData 存在localstorage
    window.localStorage.setItem('privilegeTree', JSON.stringify(privilegeTree.data))
  } else { // 否则，读取localStorage
    tableData = JSON.parse(jsonStr)
    total = tableData.length
    tableData = tableData.slice((currentPage - 1) * row, currentPage * row)
  }

  return {
    code: '1000',               // 成功与否标识
    message: '操作成功！',   // 返回信息
    total: total,
    tableData: tableData,
    treeData: JSON.parse(window.localStorage.getItem('privilegeTree'))
  }
}

let returnDeleteReq = function (param) {
  console.group("Mock：权限管理信息删除接口:")
  console.log(param)
  console.groupEnd();


  let body = JSON.parse(param.body), //
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('privilegeManageList')),
    treeList = JSON.parse(window.localStorage.getItem('privilegeTree'));

  // 被过滤掉的tableData数组，存在localstorage
  tableData = tableData.filter((item) => {
    if (body.Ids.indexOf(item.id) === -1)
      return true
    return false
  })
  // treeData
  deletePrivilegeChild(treeList, body.Ids)
  // 存在localstorage
  window.localStorage.setItem('privilegeManageList', JSON.stringify(tableData))
  window.localStorage.setItem('privilegeTree', JSON.stringify(treeList))

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

let returnAddReq = function (param) {
  console.group("Mock：权限管理信息添加接口:")
  console.log(param)
  console.groupEnd();

  // 将传来的数据存储到文件中，然后给出下载途径
  // let content = JSON.stringify(param.body)
  // let blob = new Blob([content], {type: 'text/plain;charset=utf-8'})
  // fileSaver.saveAs(blob, 'test.json')
  // let body = JSON.parse(param.body)
  // console.log(param.body)

  let id = 1,
    body = JSON.parse(param.body),
    currentPage = body.page,
    row = body.row,
    total = 0,
    tableData = JSON.parse(window.localStorage.getItem('privilegeManageList')),
    treeList = JSON.parse(window.localStorage.getItem('privilegeTree'));

  if (tableData.length)
    id = Number(tableData[tableData.length - 1].id) + 1
  // tableData
  let obj = { // 页面传来的参数构造出来的obj
    id: id + '',
    path: body.data.path,
    name: body.data.name,
    parentId: body.data.privilegeList[0].privilegeId,
    parentName: body.data.privilegeList[0].privilegeName,
    type: body.data.type,
    icon: ""
  };
  tableData.push(obj)
  // treeData
  let {id: privilegeId, name: privilegeName, path, parentId, type, icon} = obj
  addPrivilegeChild(treeList, {
    privilegeId: privilegeId,
    privilegeName: privilegeName,
    path: path,
    parentId: parentId,
    type: type,
    icon: icon,
    children: []
  })
  // 将tableData和treeData存在localstorage
  window.localStorage.setItem('privilegeManageList', JSON.stringify(tableData))
  window.localStorage.setItem('privilegeTree', JSON.stringify(treeList))

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
Mock.mock(RegExp(ApiPath.sysPrivilege.getDataInfo + '.*'), 'post', returnDataInfo)
// 接收信息删除接口的请求
Mock.mock(RegExp(ApiPath.sysPrivilege.deleteDataInfo + '.*'), 'post', returnDeleteReq)
// 接收信息添加接口的请求
Mock.mock(RegExp(ApiPath.sysPrivilege.addDataInfo + '.*'), 'post', returnAddReq)
