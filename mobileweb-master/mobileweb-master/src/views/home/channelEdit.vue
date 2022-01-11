<template>
  <div class="channel-edit">
    <!-- 当前登录用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
        <van-button
          size="mini"
          type="plain"
          @click="editing=!editing"
          class="editBtn"
        >{{editing? '取消':'编辑'}}</van-button>
      </van-cell>
      <van-grid>
        <!-- v-for="item in recommendChannels" -->
        <van-grid-item
          v-for="item in channels"
          :key="item.id"
          @click="hClickMyChannel(item)"
          :class="{'cur':item.id===channelId}"
        >
          <!-- :class="{'cur':item.id === channelId}": 如果item.id === channelId为true，就会多一个cur类。 -->
          <span>{{item.name}}</span>
          <van-icon v-show="editing && item.id!==0" name="cross" class="btn"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 当前登录用户没有订阅的频道 -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item v-for="item in recommendChannels" :key="item.id" @click="hAddChannel(item)">
          <span>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels, addChannel, deleteChannel } from '@/api/channel.js'
export default {
  name: 'ChannelEdit',
  props: ['channels', 'channelId'],
  data () {
    return {
      // 引入接口文件之后，必须添加数据项
      allChannels: [],

      // 默认是false，不显示编辑状态
      editing: false
    }
  },

  created () {
    this.loadAllChannels()
  },

  // 通过计算属性，筛选出未选中的频道
  computed: {
    //   自定义一个函数recommendChannels
    recommendChannels () {
      // 思路：对所有频道进行过滤  -  我的频道
      const result = this.allChannels.filter((channel) => {
        const idx = this.channels.findIndex((item) => item.id === channel.id)
        if (idx === -1) {
          return true
        } else {
          return false
        }
      })
      return result
    }
  },

  methods: {
    async loadAllChannels () {
      const result = await getAllChannels()
      console.log(result)
      this.allChannels = result.data.data.channels
    },

    async hClickMyChannel (channel) {
      if (this.editing) {
        // 如果有这个编辑状态，那么做删除操作
        console.log('删除频道')
        if (channel.id === 0) {
          return
          // id=0，说明是编辑频道，这个频道不能删除
        }

        // 1.请求接口，-----不再去订阅这个频道
        const result = await deleteChannel(channel.id)
        console.log(result)
        const idx = this.channels.findIndex((item) => item.id === channel.id)
        this.channels.splice(idx, 1)

        // 2.更新视图，-----在已经选中的频道里面，删除这一项

        if (idx < this.activeIndex) {
          // 2.1上述代码，-----表示修改频道弹出层里面---已经订阅的频道，减少出去一项
          // 2.2重新激活计算属性，修改可选频道弹出层里面会多出来一项
          // 2.3修改父组件的channels
          this.$emit('updateCurIndex', this.activeIndex - 1)
        }
      } else {
        // 这里用到了子传父值，用$emit
        this.$emit('updateCurChannel', channel)
      }
    },

    async hAddChannel (channel) {
      // 1.根据API要求的格式改造一下；
      // 2.在原版我的频道的基础上，添加选中的频道
      let curChannelList = [...this.channels, channel]
      curChannelList = curChannelList.map((item, idx) => {
        return {
          id: item.id,
          seq: idx
        }
      })

      // 这里要去除推荐频道。因为位置总是放在第一位上面
      curChannelList.splice(0, 1)

      // 3.调用接口
      const result = await addChannel(curChannelList)
      console.log(result)

      // 4.更新视图
      // this.channels表示已经订阅的频道，父组件传过来的
      this.channels.push(channel)
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  padding: 15px;
  font-size: 14px;
}
.btn {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 24px;
}
// 高亮显示
.cur {
  color: red;
  font-weight: bold;
}
.editBtn {
  color: rgb(229, 97, 91) !important;
  margin-right: 10px;
  padding: 0 10px;
  border-color: rgb(229, 97, 91);
}
</style>
