// 引入vue
import Vue from 'vue'
// 引入vuex
import Vuex from 'vuex'
//
import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex)

// 创建vuex实例
const store = new Vuex.Store({
  // 数据源：类似vue组件data
  state: state,
  // 类似vue组件computed属性，能缓存结果，依赖改变时才会更新结果值
  getters: getters,
  // 只能够通过这里更改state对象，无法执行异步的操作
  mutations: mutations,
  // 类似vue组件里的methods，可以还行异步的操作
  actions: actions,
  // 严格模式：状态变更不是由 mutation 函数引起的，将会抛出错误
  strict: process.env.NODE_ENV !== 'production'
})

// 导出vuex实例
export default store
