<template>
  <view class="wrap">
    <!-- 自定义搜索组件 -->
    <my-search @click="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item,index) in cateList" :key="item.cat_id">
          <view :class="['left-scroll-view-item',index === active ? 'active':''] " @click="activeChanged(index)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滚动视图区域  -->
      <scroll-view scroll-y="true" class="right-scroll-view" :style="{height:wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="item2.cat_id">
          <!-- 二级列表 -->
          <view class="cate-lv2-title">
            {{item2.cat_name}}
          </view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 item项 -->
            <view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="item3.cat_id" @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度
        wh: 0,
        // 左侧分类数据列表
        cateList: [],
        // 左侧滚动视图区域 选中的下标
        active: 0,
        // 左侧二级分类列表
        cateLevel2: [],
        // 滚动条距离顶部的距离
        scrollTop:0
      }
    },
    methods: {
      async getCateList() {
        // 发起请求
        const {
          data
        } = await uni.$http.get('/api/public/v1/categories')
        // 判断数据是否获取失败
        if (data.meta.status !== 200) return uni.$showMsg()
        // 转存数据

        this.cateList = data.message
        this.cateLevel2 = data.message[0].children
        console.log(data)
      },
      activeChanged(index) {
        this.active = index
        this.cateLevel2 = this.cateList[index].children
        this.scrollTop = this.scrollTop === 0 ? 1 : 0 
      },
      // 点击三级分类项跳转到商品列表页
      gotoGoodsList(item3) {
        uni.navigateTo({
          url:`/subpkg/goods_list/goods_list?cid=${item3.cat_id}`
        })
      },
      gotoSearch() {
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
      this.wh = sysInfo.windowHeight - 50
      // 调用获取分类列表的方法
      this.getCateList()
    }
  }
</script>

<style lang="scss">
  .wrap {
    background-color: #fff;
  }
 // 列表容器
  .scroll-view-container {
    display: flex;
    // 左侧固定宽度，设置px即可
    .left-scroll-view {
      width: 120px;
      // 左侧列表项
      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
        // 左侧高亮激活
        &.active {
          background-color: #FFFFFF;
          position: relative;
          // 左侧高亮线条
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  // 二级分类标题
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  // 三级分类列表
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
    // 三级分类列表项
    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
