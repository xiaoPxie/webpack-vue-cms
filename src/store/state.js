export const defaultRoute = {
  path: '/home',
  name: 'Home',
  component: () => import("../views/Home/Home"),
  meta: {
    index: 2,
    alias: '首页',
    closeable: false  //在标签页中是否可关闭
  }
}

const state = {
  token: '',
  // addRouteList: [], // 有权限操作的路由列表
  mergePrivilegeList: [], // 权限列表
  loading: true,  //  loading动画
  navIndent: false, // 导航栏是否缩进
  // 路由名数组，Index组件中keep-alive使用
  routeNameList: [
    defaultRoute.name
  ],
  // 路由数组，tag-bar组件使用
  routeObjList: [
    defaultRoute
  ]
}

export default state
