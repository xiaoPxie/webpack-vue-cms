// 核心库
import Vue from 'vue'
// 引入vue-router
import Router from 'vue-router'
// Vue.use(Router)
// 引入路由列表配置
import routes from "./routes";
// vuex
import store from "../store";
// 接口path路径
import ApiPath from "@/apis/api-path"
// element-message
import {Message} from "element-ui";
//
import {asyncRouteList} from "./routes";

// 解决多次点击路由时，控制台会有警告的提示bug
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const createRouter = () => new Router({
  routes
})

const router = createRouter()
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// const router = new Router({
//   routes
// })
export default router

// 全局路由拦截-进入页面前执行
router.beforeEach((to, from, next) => {
  console.group("路由前进后退情况")
  console.log(to)
  console.log(from)
  console.groupEnd()

  // 登录时，存在cookies中的token
  let token = Vue.$cookies.get("token")
  if(token) {
    if (to.path.indexOf(ApiPath.login.onLogin) !== -1) {  // token存在，to.path为login页，则统一跳转到home页路由
      next({ path: ApiPath.home.onHome })
    } else {
      if(! store.state.mergePrivilegeList.length) { // 刷新页面，导致用户的权限列表清空，则根据cookies中的token重新获取
        store.dispatch("getUserInfoByToken", token).then(() => {
          // router.addRoutes(store.state.addRouteList) // 动态添加可访问路由表
        }).catch((err)=> {
          Message.error(err)
        })
      }
      if(  // 存储左侧导航菜单中的路由，便于tag-bar组件的使用
        to.meta.index === 2 &&
        ! store.state.routeObjList.find((item) => {
          return item.name === to.name
        })
      ){
        store.dispatch("pushRouteObjAction", to)
      }
      next()
    }

  } else {
    if(to.path.indexOf(ApiPath.login.onLogin) !== -1)
      next()
    else
      next({ path: ApiPath.login.onLogin }) // 否则全部重定向到登录页
  }

});

// 全局后置钩子
router.afterEach((to, from) => {

  //不接受next
});
