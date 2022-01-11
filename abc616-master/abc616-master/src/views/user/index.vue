<template>
  <div class="container">
    <!-- 用户个人资料 -->
    <div class="user-profile">
      <div class="info">
        <van-image round :src="user.photo"/>
        <h3 class="name">
          {{user.name}}
          <br />
          <van-tag size="mini">申请认证</van-tag>
        </h3>
      </div>
      <van-row>
        <van-col span="8">
          <p>{{user.art_count}}</p>
          <p>动态</p>
        </van-col>
        <van-col span="8">
          <p>{{user.follow_count}}</p>
          <p>关注</p>
        </van-col>
        <van-col span="8">
          <p>{{user.fans_count}}</p>
          <p>粉丝</p>
        </van-col>
      </van-row>
    </div>

    <!-- 操作链接 -->
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="newspaper-o" color="#7af" />我的作品
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" color="#f00" />我的收藏
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" color="#fa0" />阅读历史
      </van-col>
    </van-row>

    <!-- 编辑入口
      is-link: 产生一个向右的箭头
      to: 用来做路由的跳转
    -->
    <van-cell-group class="user-group">
      <van-cell icon="edit" title="编辑资料" to="/user/profile" is-link />
      <van-cell icon="chat-o" title="小智同学" to="/user/chat" is-link />
      <van-cell icon="setting-o" title="系统设置" />
      <van-cell icon="warning-o" title="退出登录" @click="quit" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { removeItem } from '@/utils/storage'
import { getInfo } from '@/api/user'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {}
    }
  },

  created () {
    this.loadInfo()
  },

  methods: {
    // 退出登录
    quit () {
      this.$dialog.confirm({
        title: '系统提示',
        message: 'Are you sure ?'
      }).then(() => {
        // 1.清空token
        // 2.回退到登录界面
        // this.$store.commit('ClearTokenInfo')
        removeItem('tokenInfo')
        this.$router.push('/login')
      }).catch(() => {
        // 取消“删除”---,代码会运行到这里来
      })
    },
    async loadInfo () {
      this.$toast.loading({
        duration: 0,
        mask: true,
        message: 'loading'
      })
      try {
        const res = await getInfo()
        this.user = res.data.data

        // 保存到vuex中去
        this.$store.commit('SetUserInfo', {
          id: this.user.id,
          name: this.user.name,
          photo: this.user.photo
        })
        this.$toast.success('获取个人信息成功')
      } catch (error) {
        this.$toast.fail('获取个人信息失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  &-profile {
    width: 100%;
    height: 200px;
    display: block;
    background: #3296fa;
    color: #fff;
    .info {
      display: flex;
      padding: 20px;
      align-items: center;
      .van-image {
        width: 64px;
        height: 64px;
      }
      .name {
        font-size: 16px;
        font-weight: normal;
        margin-left: 10px;
      }
      .van-tag {
        background: #fff;
        color: #3296fa;
      }
    }
    p {
      margin: 0;
      text-align: center;
    }
  }
  &-group {
    margin-bottom: 15px;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      padding-bottom: 5px;
    }
  }
}
</style>
