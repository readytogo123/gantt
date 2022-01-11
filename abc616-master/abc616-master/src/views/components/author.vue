<template>
    <div class="author">
        <van-image round width="15px" height="15px" :src="author.aut_photo"></van-image>
                  <div class="text">
                        <p class="name">{{author.aut_name}}</p>
                        <p class="time">{{author.pubdate}}</p>
                  </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'Author',
  props: {
    author: {
      type: Object,
      reuqired: true
    }
  }
}
</script>

<style lang='less' scoped>
.author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
    //   line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
</style>
