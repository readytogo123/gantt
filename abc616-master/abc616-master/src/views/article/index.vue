<template>
    <div class="article-container">
        <!-- 导航栏 -->
        <van-nav-bar
        title="文章详情"
        fixed
        left-arrow
        @click-left="$router.back()">
        </van-nav-bar>

        <!-- 加载中 -->
        <van-loading v-if="loading" class="article-loading">
        </van-loading>

        <div v-if="is404" class="error">
            <p>文章加载失败</p>
            <van-button @click="$router.back()">后退</van-button>
        </div>

        <!-- 文章详情 -->
        <div class="detail">
            <h3 class="title">{{article.title}}</h3>
            <author :author="article">
                <van-button
                  round
                  v-if="!article.is_followed"
                  size="small"
                  type="info"
                  @click="hSwitchFollow">
                      +关注
                  </van-button>
                  <van-button
                  round
                  v-else
                  @click="hSwitchFollow"
                  size="small"
                  type="danger">
                      取消
                  </van-button>
            </author>
            <div class="content" >
                <div v-html="article.content"></div>
            </div>
            <van-divider>END</van-divider>
            <div class="zan">
                <van-button round size="small" hairline type="primary" plain icon="good-job-o">点赞</van-button>
                <van-button round size="small" hairline type="danger" plain icon="delete">不喜欢</van-button>
            </div>
        </div>
        <!-- 文章评论 -->
        <comment :article_id="$route.params.id"></comment>
    </div>
</template>

<script>
import Comment from './comment'
import Author from '../components/author'
import { getArticle } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
export default {
  name: 'ArticleIndex',
  components: {
    Author,
    Comment
  },
  data () {
    return {
      loading: false,
      is404: false,
      article: { }
    }
  },

  created () {
    this.loadArticle()
  },

  methods: {
    // 注意：如果文章是自己写的，则不能关注
    async hSwitchFollow () {
      try {
        const isFollowed = this.article.is_followed
        const autId = this.article.aut_id

        // 如果is_followed是true，说明当前按钮是“关注”，那么进行相反的操作，取消关注
        if (isFollowed) {
          const res11 = await unFollowUser(autId)
          console.log(res11)
        } else {
          const res12 = await followUser(autId)
          console.log(res12)
        }

        // 更新视图----就是在本地操作取反！！！！！！！
        this.article.is_followed = !isFollowed

        this.$toast.success('操作成功')
      } catch (error) {
        this.$toast.fail('操作失败')
      }
    },

    async  loadArticle () {
      try {
        const res = await getArticle(this.$route.params.id)
        console.log(this.$route.params.id)
        this.article = res.data.data
        this.loading = false // 结束loading状态
      } catch (error) {
        this.loading = false
        if (error.response && error.response.status === 404) {
          this.is404 = true
        } else {
          this.$toast.fail('文章加载失败')
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
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
    //   line-height: 1.3;
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
