export default {
  // 开启命名空间
  namespaced: true,
  // 模块的state数据
  state: () => ({
    // 购物车的数组，用来存储购物车每个商品的信息对象
    cartArr: JSON.parse(uni.getStorageSync('cartArr') || '[]')
  }),
  mutations: {
    // 添加商品到购物车
    addToCart(state, goods) {
      // console.log('goods',goods)
      const findResult = state.cartArr.find((item) => {
        item.goods_id === goods.goods_id
      })
      if (!findResult) {
        state.cartArr.push(goods)
      } else {
        findResult.goods_count++
      }
      this.commit('cart/saveToStorage')
    },
    // 持久化存储
    saveToStorage(state) {
      uni.setStorageSync('cartArr', JSON.stringify(state.cartArr))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cartArr.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('cart/saveToStorage')
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cartArr.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('cart/saveToStorage')
      }
    },
    // 根据id从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      state.cartArr = state.cartArr.filter(item => item.goods_id !== goods_id)
      this.commit('cart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      state.cartArr.forEach(item => item.goods_state = newState)
      this.commit('cart/saveToStorage')
    }
  },
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      let c = 0
      // 循环统计数量，累加到变量c中
      state.cartArr.forEach(goods => c += goods.goods_count)
      return c
    },
    // 勾选的商品总数量
    checkedCount(state) {
      return state.cartArr.filter(item => item.goods_state).reduce((total, x) => total += x.goods_count, 0)
    },
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
      return state.cartArr.filter(item => item.goods_state).reduce((total, x) => total += x.goods_count * x.goods_price,
        0).toFixed(2)
    }
  }
}
