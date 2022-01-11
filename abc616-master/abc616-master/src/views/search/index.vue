<template>
    <div>
        <!-- 这里是最上面的标题，nav-bar，机上路由跳转 -->
        <!-- 去vant组件库查找，包括组件附带的一些属性，有现成的 -->
        <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()"></van-nav-bar>

        <!-- 1.下面是搜索区域，有个输入框 -->
        <van-search
        v-model.trim="keyword"
        show-action
        placeholder="请输入关键词"
        @input="hGetSuggestion_jieliu">
            <!-- #action slot="action" -->
            <div slot="action" @click="hSearch">搜索</div>
        </van-search>

        <!-- 2.搜索建议 -->
        <van-cell-group v-if="keyword">
            <van-cell
            v-for="(item,idx) in cSuggestion"
            :key="idx"
            icon="search"
            @click="hSearchSuggestion(idx)">
            <div v-html="item"></div></van-cell>
        </van-cell-group>

        <!-- 3.历史记录 -->
        <van-cell-group v-else>
            <van-cell title="历史记录"></van-cell>
            <van-cell v-for="(item,idx) in history"
            :title="item"
            :key="idx"
            @click="$router.push('/search/result?keyword='+item)">
                   <van-icon name="close" @click.stop="hDeleteHistory(idx)"></van-icon>
               </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { setItem, getItem } from '@/utils/storage'
import _ from 'lodash'
export default {
  name: 'search',
  data () {
    return {
      keyword: '', // 搜索框中输入的关键词
      history: getItem('searchHistory') || [], // 用来存放后台返回的数据项
      suggestion: []
    }
  },

  computed: {
    // 利用计算属性保存suggestion中的内容做高亮效果
    cSuggestion () {
      const reg = new RegExp(this.keyword, 'gi')

      // 利用map方法对suggestion中的每一项数据进行正则高亮替换
      const arr = this.suggestion.map(str => {
        return str.replace(reg, function (s) {
          return `<span style="color:red;">${s}</span>`
        })
      })
      return arr
    }
  },

  methods: {
    //  删除下方的的历史记录
    hDeleteHistory (idx) {
      this.history.splice(idx, 1)

      //   保存到本地当中去
      setItem('searchHistory', this.history)
    },
    //   点击所搜建议这一项---来添加搜索记录
    addHistory (str) {
    // 在数组中，删除重复项
    // findIndex()---方法找到符合条件的元素
      const idx = this.history.findIndex(item => item === str)
      if (idx !== -1) {
        this.history.splice(idx, 1)
      }

      // 添加到最前面
      this.history.unshift(str)
      console.log(history)

      //   保存到本地当中去
      setItem('searchHistory', this.history)
    },

    // 点击搜索建议这一项
    hSearchSuggestion (idx) {
    // 1.在这里面调用---addHistory (str) 方法，添加到下面的历史记录中去
      this.addHistory(this.suggestion[idx])

      // 2.跳转到该项搜索页面中去
      this.$router.push({
        path: 'search/result',
        query: {
          keyword: this.suggestion[idx]
        }
      })
    },

    // 点击搜索按钮这一项---来添加搜索记录
    hSearch () {
      if (this.keyword === '') {
        return
      }

      // 1.在这里面调用---addHistory (str) 方法，添加到下面的历史记录中去
      this.addHistory(this.keyword)

      // 2.跳转到该项搜索页面中去
      this.$router.push({
        path: 'search/result',
        query: {
          keyword: this.keyword
        }
      })
    },

    async hGetSuggestion () {
      if (this.keyword === '') {
        this.suggestion = []
        return
      }

      //   1.调用接口，发送ajax请求，后台进行模糊处理
      const result = await getSuggestion(this.keyword)
      //   console.log(result)
      this.suggestion = result.data.data.options
    },

    // 下面的操作是防抖处理
    hGetSuggestion_fangdou () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.hGetSuggestion()
      }, 3 * 1000)
    },

    // 下面的操作是节流处理
    hGetSuggestion_jieliu () {
      if (this.timer) {
        return
      }
      this.timer = setTimeout(() => {
        this.timer = null
        this.hGetSuggestion()
      }, 3 * 1000)
    },

    hGetSuggestion_debounce: _.debounce(function () {
      this.hGetSuggestion()
    }, 1000),

    hGetSuggestion_throttle: _.throttle(function () {
      this.hGetSuggestion()
    }, 1000)

  }
}
</script>

<style lang='less' scoped>

</style>
