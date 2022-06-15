<template>
  <view class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="1500" :duration="1000" circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="item.goods_id">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">
        ￥{{goods_info.goods_price}}
      </view>
      <!-- 信息主体区域 -->
      <view class="goods-info-main">
        <!-- 商品名称 -->
        <view class="goods-name" v-if="goods_info.goods_name">
          {{goods_info.goods_name}}
        </view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="freight">
        快递：免运费 -- {{cartArr.length}}
      </view>
      <!-- 商品详情信息 -->
      <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    </view>
    <!-- 商品导航 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from "vuex"
  export default {
    data() {
      return {
        // 商品详情数据
        goods_info: {},
        options: [{
          icon: 'shop',
          text: '店铺',
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      }
    },
    methods: {
      async getGoodsDetail(goods_id) {
        const {
          data
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (data.meta.status !== 200) return uni.$showMsg()
        // 解决图片底部有空隙和 .webp图片无法在ios设备上显示的问题
        data.message.goods_introduce = data.message.goods_introduce.replace(/<img /g, '<img style="display:block;"')
          .replace(/webp/g, 'jpg')
        this.goods_info = data.message
        console.log(this.goods_info)
      },
      preview(i) {
        uni.previewImage({
          current: i,
          urls: this.goods_info.pics.map(item => item.pics_big)
        })
      },
      onClick(e) {
        // console.log('e1',e)
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: "/pages/cart/cart"
          })
        }
      },
      ...mapMutations('cart', ['addToCart']),
      buttonClick(e) {
        // console.log('e2', e)
        if (e.content.text === '加入购物车') {
          const goods = {
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            goods_count: 1,
            goods_small_logo: this.goods_info.goods_small_logo,
            goods_state: true
          }
          this.addToCart(goods)
        }
        // this.options[2].info++
      }
    },
    computed: {
      ...mapState('cart', ['cartArr']),
      ...mapGetters('cart', ['total'])
    },
    onLoad(options) {
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    watch: {
      total: {
        handler(newVal) {
          const findResult = this.options.find((item) => item.text === '购物车')
          if (findResult) {
            findResult.info = newVal
          }
        },
         // 该回调将会在侦听开始之后被立即调用
        immediate:true
      }
    }
  }
</script>

<style lang="scss">
  .goods-detail-container {
    padding-bottom: 50px;

    swiper {
      height: 750rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    // 商品信息区域的样式
    .goods-info-box {
      padding: 10px;
      padding-right: 0;

      .price {
        color: #c00000;
        font-size: 18px;
        margin: 10px 0;
      }

      .goods-info-body {
        display: flex;
        justify-content: space-between;

        .goods-name {
          font-size: 13px;
          padding-right: 10px;
        }

        // 收藏区域
        .favi {
          width: 120px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-left: 1px solid #efefef;
          color: gray;
        }
      }

      // 运费
      .freight {
        margin: 10px 0;
        font-size: 12px;
        color: gray;
      }
    }

    // 商品导航组件样式
    .goods_nav {
      // 为商品导航组件添加固定定位
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
</style>
