<template>
    <div>
        456
        <van-button type="info" @click="logOut">回退到登录界面</van-button>
    </div>
</template>

<script>
export default {
  methods: {
    logOut () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='less' scoped>

</style>
