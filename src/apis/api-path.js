/**
 * 后端接口url地址配置
 */
export default {
  // login
  login: {
    onLogin: "/login",
    getUserInfoByToken: "/user/token"
  },

  // home
  home: {
    onHome: "/home"
  },

  // 导航栏列表信息接口url
  nav: {
    getDataInfo: "/nav/list"
  },

  // System
  sysPrivilege: {
    getDataInfo: "/sys/privilege/list",
    deleteDataInfo: "/sys/privilege/delete",
    addDataInfo: "/sys/privilege/add",
    updateDataInfo: "/sys/privilege/update",
  },
  sysRole: {
    getDataInfo: "/sys/role/list",
    addDataInfo: "/sys/role/add",
    deleteDataInfo: "/sys/role/delete",
    updateDataInfo: "/sys/role/update",
  },
  sysUser: {
    getDataInfo: "/sys/user/list",
    addDataInfo: "/sys/user/add",
    deleteDataInfo: "/sys/user/delete",
    updateDataInfo: "/sys/user/update"
  }
}
