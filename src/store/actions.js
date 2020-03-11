import Vue from 'vue'
import * as types from "./mutation-types"
import api from "@/axios/ajax"
import ApiPath from "@/apis/api-path"

const actions = {
  loginAction(context, form) {
    return new Promise((resolve, reject) => {
      api.post(ApiPath.login.onLogin, {
        data: form
      }).then( res => {
        console.log(res)
        if(res.code && res.code === '1000') {
          // expire time: end of session
          Vue.$cookies.set("token", res.token, 0)
          // 权限列表缓存
          context.commit(types.MERGE_PRIVILEGE_LIST, res.mergePrivilegeList)
          resolve()
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserInfoByToken(context, token) {
    return new Promise((resolve, reject) => {
      api.post(ApiPath.login.getUserInfoByToken, {
        data: token
      }).then( res => {
        console.log(res)
        if(res.code && res.code === '1000') {
          context.commit(types.MERGE_PRIVILEGE_LIST, res.mergePrivilegeList)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  logOutAction(context) {
    return new Promise((resolve, reject) => {
      Vue.$cookies.keys().forEach(cookie => Vue.$cookies.remove(cookie))
      context.commit(types.RESET_ROUTE_OBJ)  // 删除标签页以及路由权限列表，避免退出系统后重新登录会残留标签页
      resolve()
    })
  },
  setLoadingAction(context, isShow) {
    context.commit(types.LOADING, isShow)
  },
  pushRouteObjAction(context, obj) {
    context.commit(types.PUSH_ROUTE_OBJ, obj)
  },
  popRouteObjAction(context, obj) {
    context.commit(types.POP_ROUTE_OBJ, obj)
  },
}

export default actions
