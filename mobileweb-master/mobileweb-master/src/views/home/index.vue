<template>
  <div class="index">
    <!-- 这里用了一个双向绑定：判断哪一个下标的频道处于活动状态 -->
    <van-tabs v-model="activeIndex">
      <van-tab
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
        :name="channel.id"
      >
        <!--  -->
        <article-list :channel="channel" @showMoreAction="hShowMoreAction"></article-list>
      </van-tab>
      <!-- van-tab具有懒加载的效果：-----只有激活当前的tab，才会去创建文章列表 -->
    </van-tabs>

    <!-- 下面设置频道列表:--通过开关来设置列表的显示与否，默认是显示的-->
    <div v-if="$store.state.tokenInfo.token" class="bar-btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav" />
      <!--  -->
    </div>
    <!-- 文章---更多操作 -->
    <van-popup v-model="showMoreAction" :style="{ width: '80%' }">
      <!-- 这里双向绑定一个自定义的值，用来控制弹出框的显示 -->
      <more-action ref="refMoreAction" @dislike="hDislike" @report="hReport"></more-action>
    </van-popup>

    <!-- 下面的是频道管理 -->
    <van-action-sheet v-model="showChannelEdit" title="频道管理">
      <channel-edit
        :channels="channels"
        :channelId="channelId"
        @updateCurChannel="hUpdateCurChannel"
        @updateCurIndex="hUpdateCurIndex"
      ></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import { getChannels } from '@/api/channel'
import ArticleList from './articleList'
import { dislikeArticle, reportArticle } from '@/api/article.js'
import MoreAction from './moreAction'
import ChannelEdit from './channelEdit'

export default {
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
  },
  name: 'Home',
  data () {
    return {
      channelId: '',
      // 表示当前选中的频道的编号
      articleId: null,
      channels: [],
      showMoreAction: false,
      // 上面设置为默认不显示更多操作的弹出层
      showChannelEdit: false
      // 上面这行代码的意思是----默认不显示频道编辑的弹出层
    }
  },

  created () {
    this.loadChannels()
  },

  methods: {
    async loadChannels () {
      const result = await getChannels()
      console.log(result)
      this.channels = result.data.data.channels
    },

    // 处理子组件发出的请求，显示弹出层的操作
    hShowMoreAction (articleId) {
      // 保存文章编号
      this.articleId = articleId

      // 显示弹出层
      this.showMoreAction = true

      if (this.$refs.refMoreAction) {
        this.$refs.refMoreAction.isReport = false
      }
    },

    // 下面是处理用户在弹出层一，选中的一项的操作
    async hDislike () {
      console.log('收到从子组件传递的文章编号', this.articleId)

      // 1.调用后端接口
      const result = await dislikeArticle(this.articleId)
      console.log(result)

      // 2.退出弹出框
      this.showMoreAction = false

      // 3.删除用户点击的那个文章
      this.delArticle()
      // const obj = {
      //   articleId: this.articleId,
      //   channelId: this.channelId,
      //   // 以上两个是当前频道ID，当前文章ID
      // };
      // this.$eventBus.$emit("delArticle", obj);
    },

    async hReport (reportTypeId) {
      console.log(reportTypeId)
      // 1.调用接口
      const result = await reportArticle(this.articleId, reportTypeId)
      console.log(result)

      // 2. 关闭弹层
      this.showMoreAction = false

      // 3. 删除文章
      this.delArticle()
    },

    delArticle () {
      // 通过事件总线去发布一个消息，告诉articleList组件，去删除对应的文章
      // 参数是：当前要删除的文章编号 及当前的频道编号
      const eventObj = {
        articleId: this.articleId,
        channelId: this.channels[this.activeIndex].id
      }
      // console.log(eventObj)
      this.$eventBus.$emit('delArticle', eventObj)
    },

    hUpdateCurChannel (channel) {
      console.log('处理子组件channeledit，用户在我的频道上点击的动作', channel)
      // 1.我是父组件，index.vue，在我的组件里面关闭弹出层
      this.showChannelEdit = false

      // 2.切换到选中的频道上去，即，-----变换一下ID即可
      this.channelId = channel.id
    },

    hUpdateCurIndex (idx) {
      this.activeIndex = idx
    }
  }
}
</script>

<style scoped lang='less'>
// 给按钮设置样式，定位在右上角蓝色标题的下方
.bar-btn {
  position: fixed;
  right: 5px;
  top: 57px;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 0.8;
  z-index: 1;
  .van-icon-wap-nav {
    font-size: 20px;
  }
}
</style>
