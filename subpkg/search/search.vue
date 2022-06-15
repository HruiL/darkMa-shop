<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar @input="input" cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="suggest-list" v-if="searchResults.length !== 0">
      <view class="suggest-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods_name">
          {{item.goods_name}}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的 timerId
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: ['a', 'app', 'apple']
      }
    },
    methods: {
      input(e) {
        // 重新启动一个延时器，并把timerId赋值给this.timer
        this.timer = setTimeout(() => {
          // 如果500毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          this.kw = e
          // 根据关键词，查询搜索建议列表
          this.getSearchList()
        }, 500)
      },
      // 根据搜索关键词，搜索商品建议列表
      async getSearchList() {
        // 判断关键词是否为空
        if (!this.kw) {
          this.searchResults = []
          return
        }
        const {
          data
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (data.meta.status != 200) return uni.$showMsg()
        this.searchResults = data.message
        this.saveSearchHistory()
      },
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?goods_id=${goods_id}`
        })
      },
      // 保存关键词的方法
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      cleanHistory() {
        this.historyList = []
        uni.setStorageSync('kw',[])
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url:`/subpkg/goods_detail/goods_detail?query=${kw}`
        })
      }
    },
    computed:{
      historys() {
        return [...this.historyList].reverse()
      }
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .suggest-list {
    padding: 0 5px;

    .suggest-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .goods_name {
      // 文字不换行，单行文本
      white-space: nowrap;
      // 溢出隐藏
      overflow: hidden;
      // 溢出使用...代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
  
  .history-box {
    padding: 0 5px;
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efef;
    }
    .history-list {
      display: flex;
      flex-wrap: wrap;
      uni-tag {
        margin: 5px 5px 0 0;
      }
    }
  }
</style>
