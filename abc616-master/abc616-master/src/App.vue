<template>
  <div id="app">
<<<<<<< HEAD
    <keep-alive>
      <router-view v-if="$route.meta.isKeepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.isKeepAlive"/>
=======
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
>>>>>>> c0f429d... init
  </div>
</template>

<script>
<<<<<<< HEAD

export default {}

</script>

<style lang="less" scoped>

=======
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
>>>>>>> c0f429d... init
</style>
