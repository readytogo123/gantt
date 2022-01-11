<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
     @load="onLoad">
      <van-cell
      v-for="item in list"
      :key="item.com_id.toString()"
      >
        <!--这个v-for循环里面的list，是下面data中声明的数据项-->
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
            <van-button
            size="mini"
            type="default"
            @click="hShowReply(item)">回复{{item.reply_count}}条评论</van-button>
          </p>
        </div>
        <van-icon
          slot="right-icon"
          name="like-o"
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
    <van-popup
    v-model="isReplyShow"
    round
    position="bottom"
    :style="{height: '80%'}">
        <comment-reply
        v-if="isReplyShow"
        :comment="curComment"
        :article_id="article_id"
        @close="isReplyShow=false"></comment-reply>
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import CommentReply from './commentReply'
import { addComment, getComments } from '@/api/comment'
export default {
  name: 'ArticleComment',
  props: {
    article_id: {
      type: String,
      required: true
    }
  },

  components: {
    CommentReply
  },

  data () {
    return {
      curComment: {}, //
      isReplyShow: false, // 控制弹层的显示与否
      offset: null, // 用户偏移量-值是评论的ID，从此ID向后面取值；不传参，表示从第1页开始读取数据
      content: '', // 评论的内容
      list: [], // 评论列表
      // 下面应该有一个onLoad函数，用来遍历list[]数组
      loading: false, // 上拉加载更多的 loading
      finished: false // 是否加载结束
    }
  },
  methods: {
    hShowReply (item) {
      this.isReplyShow = true

      this.curComment = item
    },
    //   下面是用户自己添加评论的函数
    async hAddComment () {
      if (this.content === '') {
        return
      }
      try {
        // 1.评论文章，传参1---文章ID  传参2---评论的内容
        const res123 = await addComment(this.article_id, this.content)

        // 2.把返回来的数据，更新到视图上去
        this.list.unshift(res123.data.data.new_obj)

        // 3.清空输入框
        this.content = ''

        // 4.提示
        this.$toast.success('评论成功')
      } catch (error) {
        this.$toast.fail('评论失败')
      }
    },
    async onLoad () {
      // 1.发送请求，获取其他评论
      const res111 = await getComments(this.article_id, this.offset)
      const arr = res111.data.data.results
      this.offset = res111.data.data.last_id

      // 2.获取数据，填充到list中去
      this.list.push(...arr)

      // 3.刷新状态结束
      this.loading = false

      // 4.加载状态结束
      if (arr.length === 0) {
        this.finished = true
      }
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
