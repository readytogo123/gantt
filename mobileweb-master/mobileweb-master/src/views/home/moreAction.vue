<template>
  <div class="more-action">
    <!-- 这个弹出框有两种状态，状态一和状态二，
    点击状态一里面的“反馈垃圾内容”-----会出现状态二-->
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <!-- 状态二 反馈-->
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>-->
      <van-cell
        v-for="item in reportTypeList"
        :key="item.value"
        @click="$emit('report',item.value)"
      >{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import reportTypeList from '@/constant/report.js'
export default {
  name: 'MoreAction',
  data () {
    return {
      isReport: false,
      list: reportTypeList
    }
  }
}
</script>

<style lang="less" scoped>
.more-action {
  border-radius: 4px;
}
</style>
