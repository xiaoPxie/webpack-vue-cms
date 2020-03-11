import Vue from 'vue';
import App from './APP';

// 全局重置样式
import '@/assets/css/reset.css'
import '@/assets/css/common.scss'
// element-ui
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
// vue-cookies
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
// mockjs
import '@/mock/mock.js'
// 引入vuex配置
import store from './store'

new Vue({
  el: '#app',
  store,
  render: h=>h(App)
});

