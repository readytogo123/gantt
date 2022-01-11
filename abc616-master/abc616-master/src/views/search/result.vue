<template>
    <div class="search-result">
        <!-- 导航栏 -->
        <van-nav-bar
        title="---搜索结果"
        fixed
        left-arrow
        @click-left="$router.back()">

        </van-nav-bar>

        <!-- 文章列表 -->
        <van-list
        class="article-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad">
            <van-cell
            v-for="item in list"
            :key="item.art_id"
            :title="item.title"
            @click="$router.push('/article/'+item.art_id.toString())"></van-cell>
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

  methods: {
    async onLoad () {
      // 1.调用接口，获取数据
      const res0 = await getSearch(this.$route.query.keyword, this.page)
      const arr = res0.data.data.results

      // 2.把数据填充到list数组中去
      this.list.push(...arr)
      this.page++

      // 3.修改loading为false
      this.loading = false

      // 4.判断是否加载完毕所有的数据
      if (arr.length === 0) {
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.search-result {
    height: 100%;
    overflow: auto;
    .article-list {
        margin-top: 40px;
    }
}
</style>
