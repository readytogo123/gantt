<template>
  <div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count+'条回复'">
      <van-icon @click="$emit('close')" slot="left" name="cross" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px;"
        :src="comment.aut_photo"
      />
      <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
      <div slot="label">
        <p style="color: #363636;">{{comment.content}}</p>
        <p>
          <span style="margin-right: 10px;">{{comment.pubdate}}</span>
          <van-button size="mini" type="default">回复{{comment.reply_count}}</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->
    <van-divider>全部回复</van-divider>

    <!-- 对当前评论 回复列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item, index) in list" :key="index" :title="item">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate}}</span>
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复列表 -->

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入回复内容" v-model.trim="content">
        <van-button slot="button" size="mini" type="info" @click="hAddReply">发布回复</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
  </div>
</template>
<script>
import { getCommentReplys, addCommentReply } from '@/api/comment.js'

export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      content: '', // 回复的内容
      offset: null,
      // 评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false // 是否加载结束
    }
  },
  methods: {
    async onLoad () {
      // 1. 请求数据
      // 如果其中的某个参数是null，则axios将会自动忽略这个参数

      const result = await getCommentReplys(
        this.comment.com_id.toString(),
        this.offset
      )

      console.log(result)

      const results = result.data.data.results

      // 2. 把数据添加到list中

      this.list.push(...results)

      // 3. 加载状态结束

      this.loading = false

      // 4. 判断数据全部加载完成

      if (results.length === 0) {
        this.finished = true
      }

      // 5. 更新offset

      this.offset = result.data.data.last_id
    },

    async hAddReply () {
      if (this.content === '') {
        return
      }

      // 1. 发请求
      const result = await addCommentReply(
        this.comment.com_id.toString(),
        this.content,
        this.articleId
      )
      console.log(result)

      // 2. 更新视图。添加评论成功，最新的评论应该出现在评论列的最上方
      //  (1) 从接口的返回的值中，会有一个new_obj的数据，它就表示本次评论的结果。
      this.list.unshift(result.data.data.new_obj)
      //  (2) 把回复数量+1
      this.comment.reply_count++

      // 3. 清空评论区
      this.content = ''

      // 4. 给出操作提示
      this.$toast.success('发布回复成功')
    }
  }
}
</script>
<style lang="less" scoped>
// 发表评论的区域是固定在下端的
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
// 给发表评论区空出地方
.van-list {
  margin-bottom: 45px;
}
</style>
