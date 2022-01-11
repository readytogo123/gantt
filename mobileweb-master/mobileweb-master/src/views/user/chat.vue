<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list" ref="list">
      <!-- 左侧是机器人小智 -->
      <div class="chat-item left"
      v-for="item in list"
      :key="item.timestamp"
      :class="item.name==='xz'? 'left':'right'">
      <!-- 这里用到了template组件，逻辑上形成一个整体，实际渲染的时候，不会呈现为任意的DOM元素 -->
      <template v-if="item.name==='zx'">
        <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <div class="chat-pao">{{item.msg}}</div>
      </template>

      <!-- 右侧是当前用户 -->
      <template v-else>
        <div class="chat-pao">{{item.msg}}</div>
        <van-image  fit="cover" round :src="$store.state.userInfo.photo" />
      </template>

      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <span  @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  name: 'UserChat',
  data () {
    return {
      // 下面的list是静态的聊天对话数据
      word: '',
      list: [
        { name: 'xz', msg: 'hello,my name is kobe', timestamp: Date.now() },
        { name: 'me', msg: 'mr kobe,can i help you?', timestamp: Date.now() },
        { name: 'xz', msg: 'I have a headache', timestamp: Date.now() }
      ]
    }
  },

  created () {
    // 1. 建立连接
    // this表示当前组件实例
    // 给当前组件添加一个属性，名为 socket。
    // 由于这个属性我们不需要响应式的效果，所以不需要写在data中成为一个数据项。
    // todo: 这里的接口目前有问题... 待后端修复
    const url = 'http://47.114.163.79:3003' // 我的个人服务器
    // const url = 'http://ttapi.research.itcast.cn'
    this.socket = io(url, {
      query: {
        token: this.$store.state.tokenInfo.token
      }
    })

    this.socket.on('connect', () => {
      console.log('与 websocket服务器建立连接成功')
    })

    this.socket.on('message', obj => {
      console.log('服务器端回来的数据', obj)
      // 1. 把消息添加到list中
      this.list.push({
        name: 'xz', msg: obj.msg, timestamp: Date.now()
      })
      // 2. 滚动条到达最底部
      this.moveToBottom()
    })
  },

  methods: {
    hSend () {
      if (this.word === '') {
        return
      }
      // 1. 向websocket服务器发消息
      // message是消息名，它是由后端服务器约定的。
      // info它的格式也是接口要求的。
      const info = {
        msg: this.word,
        timestamp: Date.now()
      }

      this.socket.emit('message', info)

      // 2. 把自已这句话，添加到list中去
      this.list.push({
        name: 'me',
        msg: this.word,
        timestamp: Date.now()
      })

      // 3. 滚动条到达最底部
      this.moveToBottom()
      // 4. 清空留言区域
      this.word = ''

      // 更新一下滚动条,让它到达最底部
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
        // document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight
      })
    },

    moveToBottom () {
      // this.list.push()向列表中添加了数据，它会引起高度的增长，
      this.$refs.refList.scrollTop = this.$refs.refList.scrollHeight
    }
  },
  destroyed () {
    // 离开这个页面时，关闭和websocket服务器的连接
    this.socket.close()
  }
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
