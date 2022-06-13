<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-dots="true"
      indicator-color="#c1c1c1" indicator-active-color="#f1f1f1" interval="1000" autoplay circular>
      <swiper-item v-for="(item,index) in swiperList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandle(item)">
        <image :src="item.image_src" class="nav_image"></image>
      </view>
    </view>

    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层item项 -->
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" mode="widthFix"
              :style="{width:item.product_list[0].image_width + 'rpx'}"></image>
          </navigator>
          <!-- 右侧4个小图片的盒子 排除已经在左侧显示的第一个数据-->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item1,index1) in item.product_list" :key="index" v-if="index1 !== 0" :url="item1.url">
              <image :src="item1.image_src" mode="widthFix" :style="{width:item1.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 轮播图数据列表
        swiperList: [],
        // 分类导航
        navList: [],
        // 楼层的数据列表
        floorList: []
      }
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 获取轮播图数据
      async getSwiperList() {
        const {
          data
        } = await uni.$http.get("/api/public/v1/home/swiperdata")
        if (data.meta.status != 200) return uni.$showMsg()
        this.swiperList = data.message
      },
      // 获取分类导航
      async getNavList() {
        const {
          data
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (data.meta.status != 200) return uni.$showMsg()
        this.navList = data.message
      },
      // 点击nav-item时触发的函数
      navClickHandle(item) {
        if (item.name == '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层数据
      async getFloorList() {
        const {
          data
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (data.meta.status != 200) return uni.$showMsg()
        data.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = data.message
        console.log(this.floorList)
      },
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-between;
    margin: 15rpx 0;

    .nav_image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-list .floor-title {
    width: 100%;
    height: 60rpx;
    display: flex;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }

  .floor-img-box .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
