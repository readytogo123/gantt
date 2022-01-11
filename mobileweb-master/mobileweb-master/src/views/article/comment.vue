<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.com_id.toString()" :title="item">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate}}</span>
            <van-button size="mini" type="default" @click="hShowReply(item)">回复</van-button>
          </p>
        </div>
        <van-icon
          slot="right-icon"
          name="item.is_liking ? 'like' : 'like-o'"
          @click="hSwitchLike(item)"
        />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容" v-model.trim="content">
        <van-button slot="button" size="mini" type="info" @click="hAddComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <!-- 评论回复
       vant弹层组件包含回复组件
    -->
    <van-popup v-model="isReplyShow" round position="bottom" :style="{ height: '85%' }">
      <comment-reply
        :comment="currentComment"
        :articleId="articleId"
        @close="isReplyShow=false"
        v-if="isReplyShow"
      ></comment-reply>
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import {
  addComment,
  getComments,
  addCommentLike,
  deleteCommentLike
} from '@/api/comment.js'
import CommentReply from './commentReply.vue'

export default {
  name: 'ArticleComment',
  props: {
    article_id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      currentComment: {}, // 表示当前的评论回复组件 要 回复是评论是第一条
      isReplyShow: true,
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      content: '', //   评论的内容
      offset: null
      // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
    }
  },

  components: {
    CommentReply
  },

  methods: {
    async hSwitchLike (comment) {
      try {
        const commentId = comment.com_id.toString()

        //   根据不同的状态来调用不同的API
        if (comment.is_liking) {
          // 目前是点赞， 点击按钮时，应该要做取消点赞
          await deleteCommentLike(commentId)
          // 并不关心这个操作接口的返回值，因为：只要是操作成功，它不报错，我们就可以去认为这个状态
          // 已经切过来了，后面直接修改本地数据即可
        } else {
          await addCommentLike(commentId)
        }

        // 更新视图，修改本地数据
        comment.is_liking = !comment.is_liking

        this.$toast.success('操作成功')
      } catch {
        this.$toast.fail('操作失败')
      }
    },

    async onLoad () {
      //   1.请求评论数据

      // 如果是null，则axios在传参时，会忽略这个参数

      const result = await getComments(this.article_id, this.offset)

      this.offset = result.data.data.last_id

      const arr = result.data.data.results

      // 2.把发送请求获取到的数据添加到list里面去
      this.list.push(...arr)

      // 3.加载状态结束
      this.loading = false

      // 4.判断全部数据是否完成
      this.finished = arr.length === 0
    },

    async hAddComment () {
      if (this.content === '') {
        return
      }

      try {
        //   1.发送请求
        // addComment(文章编号，评论内容)
        const result = await addComment(this.article_id, this.content)

        // 2.更新视图-----把最新评论添加到评论列表的最上面
        this.list.unshift(result.data.data.new_obj)

        // 3.清空评论区
        this.content = ''

        // 4.反馈结果
        this.$toast.success('发布评论成功')
      } catch (err) {
        console.log(err)

        this.$toast.fail('发布评论失败')
      }
    },

    hShowReply (item) {
      // 1.显示弹层-----评论回复组件
      this.isReplyShow = true

      // 2.当前评论传递给评论回复组件
      this.currentComment = item
    }
  }
}
</script>

<style scoped lang='less'>
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
