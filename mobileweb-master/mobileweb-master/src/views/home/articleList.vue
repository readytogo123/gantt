<template>
  <div class="scroll-wrapper">
    {{channel}}文章列表组件 {{Math.random()}}
    <!-- 注意：在onload里面是要通过ajax取回数据，
    1.后台不断地提供数据，到list里面，list里面的内容会越来越多
    2.loading手动设置为false，表示目前没有加载，必须触发某项条件（onLoad事件，函数）才会加载
    3.finished判断是否加载完毕，false，表示没有加载完毕-->
    <van-pull-refresh v-model="isLoadingNew" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell
          v-for="(item,idx) in list"
          :key="idx"
          :title="item.title"
          @click="$router.push('/article/'+item.art_id.toString())"
        >
          <!--点击文章列表页，传递文章ID跳转到，-----文章详情页面 -->
          <div slot="label">
            <!-- 图片 当前文章有几张图 就用几个宫格 -->
            <van-grid :column-num="item.cover.images.length">
              <van-grid-item v-for="(img,idx) in item.cover.images" :key="idx">
                <van-image :src="img" />
              </van-grid-item>
            </van-grid>

            <!-- 文字说明 -->
            <div class="meta">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate}}</span>

              <!-- 如果用户登录成功，进入主页面，则显示X按钮，并且给按钮注册点击事件-->
              <span class="close" @click="hClose(item)" v-if="$store.state.tokenInfo.token">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
export default {
  name: 'ArticleList',
  props: ['channel'],
  data () {
    return {
      list: [],
      timeatamp: null,
      loading: false,
      finished: false,
      isLoadingNew: false
    }
  },

  computed: {},

  created () {
    //   创建组件完毕，自动调用created
    console.log(Date.now(), this.channel)

    this.$eventBus.$on('delArticle', (obj) => {
      const { articleId, channelId } = obj
      console.log('我这里是', this.channel, '收到了事件', obj)

      // 下面的代码意思是如果不是当前频道的ID，提示信息
      if (channelId !== this.channel.id) {
        console.log('你要删除的文章不在我这个' + this.channel.name + '里面')
        return
      }

      console.log(`在list数组里面找到编号是${articleId}的数据，并且删除`)
      // 在数组里面找到元素并且删除，用下标来做

      const idx = this.list.findIndex((article) => {
        return article.art_id.toString() === articleId
      })

      if (idx !== -1) {
        // 那就说明找到了元素
        this.list.splice(idx, 1)
      }
    })
  },

  medthods: {
    // List 组件通过loading和finished两个变量控制加载状态，
    // 当组件滚动到底部时，会触发load事件并将loading设置成true。
    // 此时可以发起异步操作并更新数据，数据更新完毕后，将loading设置成false即可。
    // 若数据已全部加载完毕，则直接将finished设置成true即可。

    // 1. 如果当前的内容不够一屏 ，它会自动去调用onLoad去加载数据
    // 2. 组件滚动到底部时，它会再次去触发onLoad
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (!this.timestamp) {
        this.timestamp = Date.now()
      }
      // 1. 发请求
      const result = await getArticles(this.channel.id, this.timestamp)
      // 保存本次请求回来的数据中携带的时间戳，以便下次传入请求再传入
      this.timestamp = result.data.data.pre_timestamp

      const arr = result.data.data.results
      console.log(arr) // 这里有10条数据
      // 2. 把数据添加到list中去
      //   把10条数据追加到数据中去
      this.list.push(...arr)

      // 3. 加载状态结束
      this.loading = false
      // 4. 是否全部加载完成
      if (arr.length === 0) {
        this.finished = true
      }
    },

    async onRefresh () {
      // 1. 去取回最新的文章 .传入最新的时间戳
      const result = await getArticles(this.channel.id, Date.now())
      // 2. 把文章追加到 list 的 头部
      const arr = result.data.data.results
      this.list.unshift(...arr)
      // this.list = [...arr, ...this.list]
      // this.list = arr.concat(this.list)
      // 3. 提示更新结果
      this.$toast.success('刷新成功' + arr.length + '条')
      // 4. 结束loading状态
      this.isLoadingNew = false
    },

    hClose (article) {
      // 这个点击事件的函数，用到了自定义事件，通知父组件去显示弹出层

      // 大数处理之后，文章ID变成了对象，需要转换成字符串格式
      const articleId = article.art_id.toString()

      // 这里是在弹出框一的基础上，去触发弹出框二
      this.$emit('showMoreAction', articleId)
    }
  }
}
</script>

<style scoped lang='less'>
.meta {
  display: flex;
  span {
    margin-right: 10px;
  }
  .close {
    margin-left: auto;
  }
}
</style>
