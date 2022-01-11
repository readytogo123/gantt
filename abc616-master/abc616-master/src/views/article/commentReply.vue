<template>
  <div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count + '条回复'">
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
          <van-button size="mini" type="default">回复{{comment.reply_count}}条评论</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->
    <van-divider>全部回复</van-divider>

    <!-- 对当前评论 回复列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell
      v-for="(item, index) in list"
      :key="index"
      >
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
            <van-button size="mini" type="default">
            </van-button>
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复列表 -->

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field
      clearable
      placeholder="请输入回复内容"
      v-model.trim="content">
        <van-button
        slot="button"
        size="mini"
        type="info"
        @click="hAddReply">发布回复</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
  </div>
</template>
<script>
import { getCommentReplys, addCommentReply } from '@/api/comment'
export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    },
    article_id: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      content: '', // 回复的内容
      offset: null, // 评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false // 是否加载结束
    }
  },
  methods: {
    //   下面是用户自己添加评论的函数
    async hAddReply () {
      if (this.content === '') {
        return
      }
      try {
        // 1.评论文章，传参1---文章ID  传参2---评论的内容   传参3---评论的ID
        const res123 = await addCommentReply(this.comment.com_id.toString(), this.article_id, this.content)
        console.log(res123)

        // 2.把返回来的数据，更新到视图上去
        this.list.unshift(res123.data.data.new_obj)

        // 3.清空输入框
        this.content = ''

        // 4.提示
        this.$toast.success('评论成功')

        // 5.回复数量+1
        this.comment.reply_count++
      } catch (error) {
        console.log(error)
        this.$toast.fail('评论失败')
      }
    },
    async onLoad () {
      // 1.发送请求，获取其他评论回复的数据
      const res111 = await getCommentReplys(this.comment.com_id.toString(), this.offset)
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
