<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list" ref="list">
      <!-- 左侧是机器人小智 -->
      <div class="chat-item"
      v-for="(item,idx) in list"
      :key="item.timestamp + idx"
      :class="item.name==='zx' ? 'left':'right'"
      >
      <!-- 这里用到了template组件，逻辑上形成一个整体，实际渲染的时候，不会呈现为任意的DOM元素 -->
      <template v-if="item.name==='xz'">
        <van-image fit="cover" round  />
        <div class="chat-pao">{{item.msg}}</div>
      </template>

      <!-- 右侧是当前用户 -->
      <template v-else>
        <div class="chat-pao">{{item.msg}}</div>
        <van-image  fit="cover" round :src="$store.state.userInfo.photo"/>
      </template>

      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <span slot="button" @click="send" style="font-size:12px;color:#999">提交</span>
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
        { name: 'xz', msg: 'Hello, my name is Kobe', timestamp: Date.now() },
        { name: 'me', msg: 'Mr kobe,can I help you?', timestamp: Date.now() },
        { name: 'xz', msg: 'I have a headache', timestamp: Date.now() },
        { name: 'xz', msg: '111Hello, my name is Kobe', timestamp: Date.now() },
        { name: 'me', msg: '222Mr kobe,can I help you?', timestamp: Date.now() },
        { name: 'xz', msg: '333I have a headache', timestamp: Date.now() },
        { name: 'xz', msg: '444Hello, my name is Kobe', timestamp: Date.now() },
        { name: 'me', msg: '555Mr kobe,can I help you?', timestamp: Date.now() },
        { name: 'xz', msg: '666I have a headache', timestamp: Date.now() }
      ]
    }
  },

  created () {
    // 1.创建websocket连接---格式：io(url,参数)
    // http://47.114.163.79:3003
    this.socket = io('http://47.114.163.79:3003', {
      query: {
        token: this.$store.state.tokenInfo.token
      }
    })
    console.log(this.socket)
    this.socket.on('connect', () => {
      console.log('与websocket链接成功')
      this.list.push({
        msg: 'xxx',
        name: 'zx',
        timestamp: Date.now()
      })
      this.$nextTick(() => {
        document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight
      })
    })
    this.socket.on('message', obj => {
      console.log('收到服务器端的消息', obj)
      // 服务器返回的内容添加到list当中
      this.list.push({
        msg: obj.msg,
        name: 'xz'
      })
      this.$nextTick(() => {
        document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight
      })
    })
  },

  methods: {
    send () {
      console.log(this.word)
      if (this.word === '') {
        return
      }
      // 1.向服务器发送消息
      if (this.socket) {
        const info = {
          msg: this.word,
          timestamp: Date.now()
        }
        this.socket.emit('message', info)

        // 2.把自己说的话，添加到list里面去
        this.list.push({
          name: 'me',
          msg: this.word,
          timestamp: Date.now()
        })

        // vue的视图自动更新，---这个过程本身是异步的
        // 会过一会再去更新
        // 会去搜集本轮数据变化之后的视图，---放入队列当中
        // 等本轮同步代码全部执行完毕以后，再去这个队列当中依次更新
        this.$nextTick(() => {
          document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight
        })

        // 3.清空留言区
        this.word = ''
      }
    }
  }

//   destroyed () {
//     if (this.socket) {
//       this.socket.close()
//     }
//   }
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
