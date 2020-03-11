import * as types from "./mutation-types"
import {defaultRoute} from "./state"
// 引入路由列表配置
import router from "../router"
import routes from "../router/routes";
import {resetRouter} from "../router"
// 需要根据权限获取的路由列表
import {asyncRouteList} from "@/router/routes"
// loadsh
const _array = require('lodash/array')
const _lang = require('lodash/lang')

const addAsyncRuotes = (asyncRouteList, pList) => {
  _array.remove(asyncRouteList, (item) => {
    if(item.children.length)
      addAsyncRuotes(item.children, pList)
    if(
      item.meta.needAuth &&
      ! pList.find((x) => {                       // 移除用户所没有的privilege
        return x.path !== '' && x.path.indexOf(item.path) !== -1
      }) ) {
      return true
    }
  })
}

const mutations = {
  [types.MERGE_PRIVILEGE_LIST](state, mergePrivilegeList) { // 该用户所拥有的权限列表
    state.mergePrivilegeList = mergePrivilegeList
    console.log(state.mergePrivilegeList)
    let addRouteList = _lang.cloneDeep(asyncRouteList)
    addAsyncRuotes(addRouteList, mergePrivilegeList)
    // state.addRouteList = results
    router.addRoutes(addRouteList) // 动态添加可访问路由表
  },
  [types.LOADING](state, isShow) { // ajax操作loading动画
    state.loading = isShow
  },
  [types.PUSH_ROUTE_OBJ](state, obj) {  // 标签页push
    state.routeNameList.push(obj.name)
    state.routeObjList.push(obj)
  },
  [types.POP_ROUTE_OBJ](state, obj) {  // 标签页pop
    state.routeNameList.forEach((item, index) => {
      if(item === obj.name){
        state.routeNameList.splice(index, 1)
      }
    })
    state.routeObjList.forEach((item, index) => {
      if(item.name === obj.name) {
        state.routeObjList.splice(index, 1)
      }
    })
  },
  [types.RESET_ROUTE_OBJ](state) { // 标签页reset
    resetRouter(routes)
    state.routeNameList = [
      defaultRoute.name
    ]
    state.routeObjList = [
      defaultRoute
    ]
    state.mergePrivilegeList = []
    // state.addRouteList = [] //  清空路由权限列表
  },
}
export default mutations
