<template>
  <view>
    <view class="goods_list">
      <view v-for="(item,i) in goodsList" :key="i" @click="gotoDetail(item.goods_id)">
        <my-goods :item="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键字
          query: '',
          // 商品分类id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量，用来实现分页
        total: 0,
        // 上拉节流阀
        // 是否正在请求数据
        isLoading: false
      }
    },
    methods: {
      async getGoodList(cb) {
        // 打开节流阀
        this.isLoading = true
        // 发起请求
        const {
          data
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isLoading = false
        // 只要数据请求完毕，就需要立即调用cb
        cb && cb()
        if (data.meta.status !== 200) return uni.$showMsg()
        // 保存数据
        this.goodsList = [...Array.from(this.goodsList),...Array.from(data.message.goods)]
        this.total = data.message.total
        // console.log(this.goodsList)
      },
      gotoDetail(id) {
        uni.navigateTo({
          url:`/subpkg/goods_detail/goods_detail?goods_id=${id}`
        })
      }
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodList()
  
    },
    // 触底事件
    onReachBottom() {
      // 判断是否还有下一页数据
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 如果正在请求其他数据，则不发起额外请求
      if(this.isLoading) return
      // 让页码+1
      this.queryObj.pagenum += 1
      // 重新获取列表数据
      this.getGoodList()
      
    },
    // 下拉刷新事件
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      // 发请求
      this.getGoodList(()=>uni.stopPullDownRefresh())
      
    }
  }
</script>

<style lang="scss">
  
</style>
