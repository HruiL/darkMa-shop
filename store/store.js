import Vue from 'vue'
import Vuex from 'vuex'
// 导入购物车的vuex模块
import cart from './cart.js'
// 导入用户的vuex模块
import user from './user.js'
Vue.use(Vuex)
const store = new Vuex.Store({
  // 挂载 cart的store模块
  modules:{
    cart,
    user
  }
})
export default store