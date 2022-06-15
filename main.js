import Vue from 'vue'
import App from './App'
import store from './store/store'

// 按需导入 $http 对象
import {
  $http
} from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 配置请求根路径
$http.baseUrl = "https://api-hmugo-web.itheima.net"

// 请求之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: "数据加载中..."
  })
}

// 请求之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading()
}

// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败!', duration = 1500) {
  uni.showToast({
    title,
    duration
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // 挂载vuex
  store
})
app.$mount()