<template>
    <!-- 返回文章列表时，回到滚动条原来的位置 -->
    <!-- 如果这个组件被keep-alive缓存了，会多出activated(),deactivated()这两个钩子函数 -->
    <div class="scroll-wrapper" @scroll="hScroll" ref="refScroll">
        <!-- 这个组件的作用：显示这个频道对应的文章信息 -->
        <!-- 组件传值：父传子 -->
        {{channel.name}}频道的：文章列表
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <van-cell v-for="(item, index) in list"
            :key="index"
            :title="item.title"
            @click="$router.push('/article/'+item.art_id.toString())" :border="false">
                <!-- 文章内容有了，接着要加载文章对应的图片 -->
                <div slot="label">
                    <!-- 这里用宫格系统，有几张图片，就用几个宫格 -->
                <van-grid :column-num="item.cover.images.length">
                    <van-grid-item v-for="(img, index) in item.cover.images" :key="index" icon="photo-o">
                        <van-image :src="img" lazy-load/>
                    </van-grid-item>
                </van-grid>
                <!-- 图片的文字说明 -->
                <div class="meta">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论：</span>
                    <!-- 下面是使用过滤器 -->
                    <span>{{item.pubdate | formatTime}}</span>
                    <span>{{item.pubdate | relativeTime}}</span>

                    <!-- 如果是登录用户， 显示X按钮-->
                    <span class="close"
                    v-if="isLogin"
                    @click.stop="$emit('showMoreAction', item.art_id.toString())">
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
import { mapGetters } from 'vuex'
import { getArticles } from '@/api/article'
export default {
  name: 'ArticleList',
  props: ['channel'],
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  created () {
    this.$eventBus.$on('delArticles', obj => {
      // 在List中找到编号是obj.articleId的文章并且删除
      if (obj.channelId !== this.channel.id) {
        console.log('你要删除的文章不在我这个频道之上')
        return
      }

      // 在list数组中找到一个元素的下标并且删除
      const index = this.list.findIndex(item => {
        return item.art_id.toString() === obj.articleId
      })

      if (index !== -1) {
        // 不等于-1，说明找到了该元素
        // 在数组里面，删除确定下标的元素
        this.list.splice(index, 1)
      }
    })
  },
  methods: {
    hScroll () {
      this.scrollTop = this.$refs.refScroll.scrollTop
    },
    // 在父组件里面通知弹出层显示
    // hClose () {
    //   this.$emit('showMoreAction')
    // },
    async onRefresh () {
      // 在组件下拉时候，执行该函数

      // 1.获取最新文章，传入最新时间戳
      const res2 = await getArticles(this.channel.id, Date.now())

      // 2.最新文章放到list最前面
      const arr2 = res2.data.data.results

      this.list.unshift(...arr2)

      // 3.提示更新结果
      this.$toast.success('成功刷新' + arr2.length + '条信息')

      // 4.结束更新loading的状态
      this.isLoading = false
    },
    // list组件通过loading---finished两个变量控制信息加载状态；
    // 滚动条到达底部时候，触发loading设置成true；
    // 发起异步操作更新数据，更新完毕之后，loading设置成false；
    // 全部加载完毕之后，finished设置成true
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // 1.发ajax请求
      if (!this.timestamp) {
        this.timestamp = Date.now()
      }
      const res1 = await getArticles(this.channel.id, this.timestamp)

      // 保存本次请求回来的数据中携带的---时间戳，方便下次请求的时候传入
      this.timestamp = res1.data.data.pre_timestamp

      // 2.把数据加入List数组中去
      const arr1 = res1.data.data.results

      this.list.push(...arr1)

      // 3.加载状态结束
      this.loading = false

      // 4.是否全部加载完毕----根据arr的长度来判断
      if (arr1.length === 0) {
        this.finished = true
      }
    },

    activated () {
      if (this.scrollTop) {
        this.$refs.refScroll.scrollTop = this.scrollTop
      }
    }
  }
}
</script>

<style lang='less' scoped>
    .meta {
        display: flex;
        .close {
            margin-left: auto;
        }
    }
</style>
