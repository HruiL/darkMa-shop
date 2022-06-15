import {
  mapGetters
} from 'vuex'
export default {
  data() {
    return {
      name: 'zs'
    }
  },
  computed: {
    ...mapGetters('cart', ['total'])
  },
  watch: {
    total() {
      this.setBadge()
    }
  },
  onShow() {
    // 进入页面，就显示徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用uni.setTabBarBadge()方法 为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2,
        // text 必须是字符串
        text: this.total + ''
      })
    }
  }
}
