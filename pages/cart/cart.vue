<template>
  <!-- 有数据的购物车 -->
  <view class="cart-container" v-if="cartArr.length !== 0">
    <!-- 收货地址 -->
    <my-address></my-address>
    <!--商品列表标题 -->
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 描述文本 -->
      <text class="cart-title-text">购物车</text>
    </view>
    <!-- 商品列表 -->
    <uni-swipe-action>
      <view v-for="(goods,i) in cartArr" :key="i">
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods.goods_id)">
          <my-goods :item="goods" :showRadio="true" @radio-change="radioChangeHandler" :showNum="true"
            @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </view>
    </uni-swipe-action>
    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>
  <!-- 空白购物车 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    // 将badgeMix混入到当前的页面中使用
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }]
      };
    },
    methods: {
      ...mapMutations('cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 商品的勾选状态发生了变化
      radioChangeHandler(e) {
        this.updateGoodsState(e)
      },
      // 商品的数量发生了变化
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      // 删除商品
      swipeActionClickHandler(goods_id) {
        this.removeGoodsById(goods_id)
      }
    },
    computed: {
      ...mapState('cart', ['cartArr'])
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;

    .cart-title {
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 5px;
      border-bottom: 1px solid #efefef;

      .cart-title-text {
        margin-left: 10px;
      }
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
