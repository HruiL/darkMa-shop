<template>
  <view>
    <view class="goods-item">
      <!-- 商品左侧图片 -->
      <view class="goods-item-left">
        <radio :checked="item.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler" />
        <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 商品右侧信息区域-->
      <view class="goods-item-right">
        <!-- 商品标题 -->
        <view class="goods-name">
          {{item.goods_name}}
        </view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">
            ￥{{item.goods_price | tofixed}}
          </view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" :value="item.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      // 商品信息对象
      item: {
        type: Object,
        default: {},
      },
      // 是否展示图片左侧的radio
      showRadio: {
        type: Boolean,
        // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
        default: false
      },
      // 是否显示价格右侧的Numberbox组件
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 默认图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    methods: {
      // radio 组件的点击事件
      radioClickHandler() {
        this.$emit('radio-change', {
          goods_id: this.item.goods_id,
          goods_state: !this.item.goods_state
        })
      },
      numChangeHandler(val) {
        this.$emit('num-change', {
          goods_id: this.item.goods_id,
          goods_count: +val
        })
      }
    },
    filters: {
      // 把商品价格处理为带俩位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>
