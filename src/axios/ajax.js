import Vue from 'vue';
import axios from 'axios'
import store from "../store"
import ApiPath from "@/apis/api-path"
import {Message} from "element-ui"

// 配置axios请求全局默认值
// axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  if(config.url.indexOf(ApiPath.login.onLogin) === -1) {
    let token = Vue.$cookies.get("token")
    if(!token) {
      Message.error({
        message: "登录身份已过期，3秒后返回登录页！",
        duration: 2000,
      })
      setTimeout(_ => {
        // next({path: '/login'})
        Vue.$router.replace(ApiPath.login.onLogin)
      },3000)
      return Promise.reject();
    }
    // 添加认证header
    config.headers.Authorization = token
  }
  // 显示loading动画
  store.dispatch("setLoadingAction", true)
  return config;
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 响应拦截器
axios.interceptors.response.use(function(response) {
  // 对响应数据做点什么

  // 关闭loading动画
  store.dispatch("setLoadingAction", false)
  return response;
}, function(error) {
  // 对响应错误做点什么
  return Promise.reject(error);
})

// 封装axios的get请求
let get = function(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch((error) => {
        console.group("请求失败：" + url);
        console.log("error：" + error);
        console.groupEnd();
        reject(error);
      })
  })
}

// 封装axios的post请求
let post = function(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch((error) => {
        console.group("请求失败：" + url);
        console.log("error：" + error);
        console.groupEnd();
        reject(error);
      })
  })
}

export default {
  get: get,
  post: post,
}
