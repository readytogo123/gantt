<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading v-if="loading" class="article-loading" />
    <!-- /加载中 loading -->

    <div class="error" v-if="is404">
      <p>文章去哪里了啊？</p>
      <van-button @click="$router.back()">后退</van-button>
      <van-button @click="$router.push('/')">回主页</van-button>
    </div>

    <!-- 文章详情 -->
    <div class="detail" v-else>
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate}}</p>
        </div>
        <!-- <van-button
          round
          size="small"
          type="info"
          @click="hSwitchFollow"
        >{{article.is_followed? '取关':'+ 关注'}}</van-button>-->

        <author :author="article">
          <van-button
            round
            size="small"
            type="info"
            @click="hSwitchFollow"
          >{{article.is_followed? '取关':'+ 关注'}}</van-button>
        </author>
      </div>
      <div class="content">
        <div v-html="article.content"></div>
      </div>
      <van-divider>END</van-divider>
      <div class="zan">
        <van-button
          round
          size="small"
          hairline
          type="primary"
          plain
          :icon="article.attitude===1? 'good-job':'good-job-o'"
          @click="hSwitchLike"
        >{{article.attitude === 1 ? '取消点赞' : '点赞'}}</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          hairline
          type="danger"
          plain
          icon="delete"
          @click="hSwitchDisLike"
        >{{article.attitude === 0 ? '取消不喜欢' : '不喜欢'}}</van-button>
      </div>
    </div>
    <!-- 文章评论 -->
    <article-comment :article_id="$route.params.id"></article-comment>
    <!-- /文章详情 -->
  </div>
</template>

<script>
import {
  getArticle,
  addLike,
  deleteLike,
  addDisLike,
  deleteDisLike
} from '@/api/article.js'
import { followUser, unFollowUser } from '@/api/user.js'
import Author from '@/components/author'
import ArticleComment from './comment'

export default {
  components: {
    Author,
    ArticleComment
  },
  name: 'ArticleIndex',
  data () {
    return {
      // 控制加载中的loading状态
      loading: true,

      //   添加的数据项，用来表示当前文章，储存发送请求获取的数据
      article: {},

      //   文章是否存在
      is404: false
    }
  },

  created () {
    this.loadArticle()
  },

  methods: {
    async hSwitchDisLike () {
      if (this.article.attitude === 0) {
        await deleteDisLike(this.article.art_id.toString())

        this.article.attitude = -1
      } else {
        await addDisLike(this.article.art_id.toString())

        this.article.attitude = 0
      }
      this.$toast.success('操作成功')
    },
    async hSwitchLike () {
      // 注意：根据console.log的结果来看，里面会有一个attitude属性来辅助判断---用户对待文章的态度

      if (this.article.attitude === 1) {
        // 注意：如果是1，表示已经点赞过了，再次点击就是取消点赞，调用的就是deleteLike
        await deleteLike(this.article.art_id.toString())
      } else {
        await addLike(this.article.art_id.toString())
      }

      this.$toast.success('操作成功')

      // 更新视图
      // 取反，只是更新本地的数据项
      this.article.attitude = this.article.attitude * -1
    },
    async loadArticle () {
      try {
        const id = this.$route.params.id

        const result = await getArticle(id)

        this.article = result.data.data

        this.loading = false
      } catch (err) {
        this.loading = false
        //   表示结束loading
        if (err.response && err.response.status === 404) {
          this.is404 = true
        } else {
          this.$toast.fail('文章加载失败')
        }
      }
    },

    async hSwitchFollow () {
      // 注意：根据console.log的结果来看，里面会有一个is_followed属性来辅助判断是否关注此篇文章
      try {
        const isFollowed = this.article.is_followed

        const autId = this.article.aut_id

        // 注意：根据当前的is_followed来判断，调用哪个方法

        if (isFollowed) {
          // 默认是true，已经关注了的，那么下面的操作就是取消关注

          const result = await unFollowUser(autId)

          console.log(result)
        } else {
          const result = await followUser(autId)

          console.log(result)
        }

        // 更新视图，就是在本地数据里面取反

        this.article.is_followed = !isFollowed

        this.$toast.success('操作成功')
      } catch (err) {
        console.log(err)

        this.$toast.fail('操作失败')
      }
    },

    beforeRouteLeave (to, from, next) {
      console.log('你现在在文章详情页，你将要离开这个页面')
      console.log(to, from)
      if (to.path === '/login' && this.$store.state.tokenInfo.token) {
        next({ path: '/' })
      } else {
        next()
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error {
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan {
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    font-size: 14px;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
  }
}
</style>
