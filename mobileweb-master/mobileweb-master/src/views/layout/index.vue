<template>
  <div class="container">
    <!-- logo导航栏 -->
    <van-nav-bar fixed v-show="$route.path!=='/user'">
      <!-- 这里面要加上一个插槽 -->
      <div slot="left" class="logo"></div>
      <van-button
        slot="right"
        round
        type="info"
        size="small"
        icon="search"
        @click="$router.push('/search')"
      >搜索</van-button>
    </van-nav-bar>

    <!-- 内容主体区域，二级路由的出口-->
    <router-view></router-view>

    <!-- 下面的是底部的tabbar区域 -->
    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="search">{{$store.getters.isLogin? '我的':'未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="less">
.logo {
  background: url("../../assets/logo.png") no-repeat;
  background-size: cover;
  width: 100px;
  height: 30px;
}
.van-nav-bar .van-icon {
  color: #fff;
}
.logo {
  background: url("../../assets/logo.png") no-repeat;
  background-size: cover;
  width: 100px;
  height: 30px;
}
.van-nav-bar .van-icon {
  color: #fff;
}
</style>
