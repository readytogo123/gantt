<template>
  <div class="search-result">
    <!-- 这是导航栏 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />

    <!-- 下面是文章列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,idx) in list"
        :key="idx"
        :title="item.title"
        @click="$router.push('/article/' + item.art_id.toString())"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1
    }
  },

  created () {
    var keyword = this.$route.query.keyword
    alert(keyword)
  },

  methods: {
    async onLoad () {
      // 1. 调用api,获取数据
      const result = await getSearch(this.$route.query.keyword, this.page)
      console.log(result)
      const results = result.data.data.results
      // 2. 把数据填充到数据项中
      this.list.push(...results)
      this.page++ // 页码自增

      // 3. 修改loading为false
      this.loading = false

      // 4. 判断是已经加载了全部的数据
      if (results.length === 0) {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.serach-result {
  height: 100%;
  overflow: auto;
  .article-list {
    margin-top: 39px;
  }
}
</style>
