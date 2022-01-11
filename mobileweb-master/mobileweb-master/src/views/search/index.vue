<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- 1.搜索区域，输入框，当里面的内容发生变化时，就会触发 -->
    <van-search
      v-model.trim="keyword"
      clearable
      shape="round"
      show-action
      placeholder="请输入搜索关键词"
      @input="hGetSuggestion_with_debounce"
    >
      <!-- <template slot="action">
        <div>搜索</div>
      </template>-->
      <div slot="action" @click="hSearch">搜索</div>
    </van-search>

    <!-- 2.搜索建议 -->
    <!-- 2.1点击联想建议，输入一个字，后面接着显示所有的字 -->
    <van-cell-group v-if="keyword">
      <van-cell
        v-for="(item,idx) in cSuggestion"
        :key="idx"
        icon="search"
        @click="hSearchSuggestion(idx)"
      >
        <div v-html="item"></div>
      </van-cell>
    </van-cell-group>

    <!-- 3.历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录"></van-cell>
      <van-cell
        v-for="(item,idx) in history"
        :key="idx"
        :title="item"
        @click="$router.push('/search/result?keyword='+item)"
      >
        <van-icon name="close" @click="hDeleteHistory(idx)" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search.js'
import { setItem, getItem } from '@/utils/storage'
import _ from 'lodash'

export default {
  // const SEARCH_HISTORY_KEY = 'searchHistory',
  name: 'Search',
  data () {
    return {
      keyword: '',
      // 搜索关键字

      suggestion: [],
      // 当前的搜索建议，也就是下方出现的关键字

      history: getItem('searchHistory') || []
      // 保存搜索的历史记录
    }
  },

  computed: {
    // 利用计算属性在suggestion里面保存内容
    cSuggestion () {
      const reg = new RegExp(this.keyword, 'gi')

      // 下面对suggestion里面的每一项进行正则替换
      const arr = this.suggestion.map((str) => {
        return str.replace(reg, function (s) {
          return `<span style="color:blue;">${s}</span>`
        })
      })
      return arr
    }
  },

  methods: {
    async hGetSuggestion () {
      console.log(this.keyword)
      if (this.keyword === '') {
        this.suggestion = []
        return
      }

      // 1.调用接口
      const result = await getSuggestion(this.keyword)

      // 2.将获取的数据显示在下面的建议区域里面
      console.log(result)
      this.suggestion = result.data.data.options
    },

    // hGetSuggestion_with_fang_dou() {
    //   console.log("当前用户的输入", this.keyword);

    //   if (this.timer) {
    //     clearTimeout(this.timer);
    //   }

    //   this.timer = setTimeout(() => {
    //     this.hGetSuggestion();
    //   }, 3000);
    // },

    // hGetSuggestion_with_jie_liu () {
    //   console.log('当前用户的输入', this.keyword, (new Date()).toLocaleTimeString())
    //   // 以节流3s为例： (值越大，越不灵敏)
    //   // 对于本次调用，检查本次执行距离上一次执行中间是否相隔5秒
    //   // 是：执行，否：不执行

    //   if (this.timer) {
    //     return
    //   }
    //   this.timer = setTimeout(() => {
    //     this.timer = null
    //     this.hGetSuggestion()
    //   }, 100) //  3 * 1000
    // },

    hGetSuggestion_with_debounce: _.debounce(function () {
      console.log(this.keyword)
      this.hGetSuggestion()
    }, 500),
    hGetSuggestion_with_throttle: _.throttle(function () {
      console.log(this.keyword)
      this.hGetSuggestion()
    }, 500),

    // 下面封装一个添加历史记录的方法
    addHistory (str) {
      // 历史记录里面不能有重复的项
      // 最近一次的搜索记录要放在suggestion: [],最前面

      const idx = this.history.findIndex((item) => item === str)
      if (idx !== -1) {
        // 说明有重复的项，那么删除即可
        this.history.splice(idx, 1)
      }

      // 否则，在history里面添加到头部即可
      this.history.unshift(str)

      // 做持久化处理
      setItem('searchHistory', this.history)
    },

    // 搜索的第1种方法：用户在搜索建议上点击
    hSearchSuggestion (idx) {
      console.log(idx)

      // 1.把当前的搜索建议，添加到历史记录里面去
      this.addHistory(this.suggestion[idx])

      // 2.跳转到搜索结果页
      this.$router.push({
        // 路由地址
        path: '/search/result',

        // 通过query传递参数
        query: {
          keyword: this.suggestion[idx]
        }
      })
    },

    // 搜索的第2种方法：用户在搜索按钮上点击
    hSearch () {
      if (this.keyword === '') {
        return
      }

      // 1.把当前的搜索内容，添加到历史记录里面去
      this.addHistory(this.keyword)

      // 2.跳转路由
      this.$router.push({
        // 路由地址
        path: '/search/result',
        // 通过query传递参数
        query: {
          keyword: this.keyword
        }
      })
    },

    // 用户点击了删除历史记录
    hDeleteHistory (idx) {
      this.history.splice(idx, 1)

      // 做持久化处理
      setItem('searchHistory', this.history)
    }
  }
}
</script>

<style scoped lang='less'></style>
