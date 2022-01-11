<template>
    <div>
        <!-- 频道列表 -->
        <van-tabs v-model="channelId">
          <!-- v-model="channelId"用来双向绑定频道的ID，与下面的:name="item.id"一起使用-->
            <van-tab v-for="item in channels"
            :title="item.name"
            :key="item.id"
            :name="item.id">
            <!-- 1个频道对应一组文章列表组件 -->
            <!-- 把当前频道信息传给子组件 -->
                <article-list :channel="item"
                @showMoreAction="hShowMoreAction"></article-list>
            </van-tab>
            <div class="bar-btn" v-if="isLogin" @click="showChannelEdit=true">
              <van-icon name="wap-nav"></van-icon>
            </div>
        </van-tabs>
        <!-- 这是vant组件的弹出层组件，该弹出层在屏幕中间显示 通过v-model控制弹出层的显示-->
        <!-- @dislike="hDislike"-----处理不感兴趣的文章 -->
        <van-popup v-model="showMoreAction" :style="{ width: '80%' }">
          <more-action
          @dislike="hDislike"
          @report="hReport"></more-action>
        </van-popup>

        <!-- 下面的弹出层是从下往上显示 -->
        <van-action-sheet v-model="showChannelEdit" title="标题">
          <channel-edit
          :channels="channels"
          :channelId="channelId"
          @updateCurChannel="hUpdateCurChannel"></channel-edit>
        </van-action-sheet>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getChannels } from '@/api/channel'
import { reportArticles, dislikeArticles } from '@/api/article'
import ArticleList from './articleList.vue'
import MoreAction from './moreAction.vue'
import channelEdit from './channelEdit.vue'
export default {
  name: 'home',
  components: {
    ArticleList,
    MoreAction,
    channelEdit
  },
  data () {
    return {
      channels: [],
      channelId: '', // 是当前选中的频道编号
      showChannelEdit: false, // 这里是从下往上的弹层---频道编辑弹层
      showMoreAction: false, //  这里是中间内容弹层------更多操作弹层
      articleId: null
    }
  },
  created () {
    this.loadChannels()
  },

  computed: {
    ...mapGetters(['isLogin'])
  },
  methods: {
    // 点击弹出层，切换频道，并且跳转至该频道
    hUpdateCurChannel (channel) {
      // 1.关闭弹出层
      this.showChannelEdit = false

      // 2.跳转至该频道
      this.channelId = channel.id
    },
    async hReport (reportTypeId) {
      try {
        // 1.调用举报的文章接口
        const res4 = await reportArticles(this.articleId, reportTypeId)
        console.log(res4)
        // 2.退出弹层
        this.showMoreAction = false

        const obj = {
        // 下面的是当前频道ID---以及当前频道下的文章的ID
          channelId: this.channelId,
          articleId: this.articleId
        }
        // 3.通知articleList组件删除被点击的文章
        this.$eventBus.$emit('delArticles', obj)
        this.$toast.success('删除成功')
      } catch (error) {
        this.$toast.fail('删除失败')
      }
    },
    async hDislike () {
    // 1.调用不喜欢的文章接口
      try {
        const res3 = await dislikeArticles(this.articleId)
        console.log(res3)
        // 2.退出弹层
        this.showMoreAction = false

        const obj = {
        // 下面的是当前频道ID---以及当前频道下的文章的ID
          channelId: this.channelId,
          articleId: this.articleId
        }
        // 3.通知articleList组件删除被点击的文章
        this.$eventBus.$emit('delArticles', obj)
        this.$toast.success('删除成功')
      } catch (error) {
        this.$toast.fail('删除失败')
      }
    },

    // 发送请求，获取文章频道
    async loadChannels () {
      const res = await getChannels()
      console.log(res)
      this.channels = res.data.data.channels
    },

    // 处理子组件，显示弹出层
    hShowMoreAction (articleId) {
      console.log('文章ID是', articleId)
      this.articleId = articleId
      this.showMoreAction = true
    }
  }
}

</script>

<style lang='less' scoped>

</style>
