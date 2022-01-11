<template>
    <div class="container">
        <!-- logo区域 -->
        <van-nav-bar v-show="$route.path !== '/user'">
            <van-button slot="right"
            round
            type="info"
            size="small"
            icon="search"
            @click="$router.push('/search')">
                搜索
            </van-button>
        </van-nav-bar>

        <!-- 主题区域 -->
        <router-view></router-view>

        <!-- 底部区域 route---vant组件自带路由功能-->
        <van-tabbar route>
            <van-tabbar-item  to="/" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item  to="/question" icon="search">问答</van-tabbar-item>
            <van-tabbar-item  to="/video" icon="video">视频</van-tabbar-item>
            <van-tabbar-item  to="/user" icon="wap-home-o">{{isLogin ? '我的':'未登录'}}</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isLogin'])
  }
}

</script>

<style lang='less' scoped>
.van-nav-bar .van-icon-search {
    color: white;
}
</style>
