<template>
  <view>
    <view class="my-search-container" :style="{'background-color':bgcolor}">
      <!-- 使用view组件模拟input输入框的样式 -->
      <view class="my-search-box" :style="{'border-radius':radius + 'px'}" @click="searchBoxHandler">
        <uni-icons type="search" size="17"></uni-icons>
        <text class="placeholder">搜索</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props:{
      // 背景颜色
      bgcolor:{
        type: String,
        default:"#c00000"
      },
      // 圆角尺寸
      radius: {
        type:Number,
        default:18
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      // 点击了模拟的input输入框
      searchBoxHandler() {
        // 触发外界通过@click 绑定click事件处理函数
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    // 移除背景颜色，改由props属性控制
    // background-color: #c00000;
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .my-search-box {
      height: 36px;
      background-color: #fff;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      // 移除背圆角尺寸，改由props属性控制
      // border-radius: 15px;
      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>