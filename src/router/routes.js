const Index = () => import("../views/Index/Index")
const Home = () => import("../views/Home/Home")
const NotFound = () => import("../views/Common/404/404")
const PrivilegeManagement = () => import("../views/System/PrivilegeMangement/PrivilegeManagement")
const RoleManagement = () => import("../views/System/RoleManagement/RoleManagement")
const UserManagement = () => import("../views/System/UserManagement/UserManagement")
const Login = () => import("../views/Common/Login/Login")

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { index: 1, alias: '登录', closeable: false, },
    children: [],
  },
]

export const asyncRouteList = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: { index: 1, alias: '主页', closeable: false, needAuth: false},
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { index: 2, alias: '首页', closeable: false, needAuth: false},
        children: [],
      },
      {
        path: '/sys/privilege/list',
        name: 'PrivilegeManagement',
        component: PrivilegeManagement,
        meta: { index: 2, alias: '权限管理', closeable: true, needAuth: true},
        children: [],
      },
      {
        path: '/sys/role/list',
        name: 'RoleManagement',
        component: RoleManagement,
        meta: { index: 2, alias: '角色管理', closeable: true, needAuth: true},
        children: [],
      },
      {
        path: '/sys/user/list',
        name: 'UserManagement',
        component: UserManagement,
        meta: { index: 2, alias: '用户管理', closeable: true, needAuth: true},
        children: [],
      },
    ]
  },
  {
    path: '*',
    component: NotFound,
    meta: { index: 1, alias: 'NotFound', closeable: false, needAuth: false},
    children: [],
  },
]

export default routes
