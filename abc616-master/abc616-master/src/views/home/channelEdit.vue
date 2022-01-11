<template>
    <div class="channel-edit">
        <!-- 当前用户已经订阅的频道 -->
        <div class="channel">
            <van-cell title="我的频道" :border="false">
              <!-- :class="{'btn2' : editing}" {{editing ? '取消':'编辑'}} @click="editing=!editing"-->
                <van-button
                @click="editing=!editing"
                v-if="!editing"
                type="info"
                size="mini"
                >编辑</van-button>
                <van-button
                v-else
                @click="editing=!editing"
                size="mini"
                type="danger">取消</van-button>
            </van-cell>
            <van-grid>
                <van-grid-item
                v-for="item in channels"
                :key="item.id"
                @click="hClickMyChannel(item)"
                :class="{'cur': item.id === channelId}">
                    <span>{{item.name}}</span>
                    <van-icon
                    name="cross"
                    class="btn"
                    v-show="editing && item.id!==0"></van-icon>
                </van-grid-item>
            </van-grid>
        </div>
        <!-- 这里用的是网格系统分布 -->
        <!-- 当前用户没有订阅的频道 -->
        <div class="channel">
            <van-cell title="可选频道" :border="false">
            </van-cell>
            <van-grid>
                <van-grid-item
                v-for="index in recommendChannels"
                :key="index.id"
                @click="hAddChannels(index)">
                    <span>{{index.name}}</span>
                    <van-icon></van-icon>
                </van-grid-item>
            </van-grid>
        </div>
    </div>
</template>

<script>
import { getAllChannels, addChannels, deleteChannels } from '@/api/channel'
export default {
  name: 'channelEdit',
  props: ['channels', 'channelId'],
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },

  created () {
    this.loadAllChannels()
  },

  computed: {
    // 这里通过计算属性得出---可选频道
    // 思路：在allchannels数组中-channels数组里面重复的数值
    // 使用filter过滤，通过index下标来计算

    // 根据下标的方法，分情况讨论，删除和添加操作2种情况
    recommendChannels () {
      const res6 = this.allChannels.filter(channel => {
        const index = this.channels.findIndex(item => item.id === channel.id)

        // 添加操作，下标等于-1，说明没有这个数，把它添加进去
        if (index === -1) {
          return true
        } else {
          return false
        }
      })
      return res6
    }
  },

  methods: {
    // 在这个点击按钮当中，包含了2种情况
    // 1.频道跳转，通知父组件
    // 2.“取消按钮”---这个状态，删除频道操作
    async hClickMyChannel (channel) {
      if (this.editing) {
        // 删除频道---ID===0的推荐频道不能删除
        if (channel.id === 0) {
          return
        }

        // 1.调用接口---删除该频道
        await deleteChannels(channel.id)

        // 2.更新视图，在已经选中的频道当中，在本地当中删除这一项
        const idx = this.channels.findIndex(item => item.id === channel.id)
        if (idx !== -1) {
        // 下标不等于-1，说明有这个数，选中把它删除
          this.channels.splice(idx, 1)
        }
      } else {
        // 子传父，在子组件点击之后，通知父组件跳转按钮
        this.$emit('updateCurChannel', channel)
      }
    },
    // 点击可选频道，把这个频道放入上方的订阅频道当中去
    async hAddChannels (channel) {
      // 后台接口要求传入2个参数进去，一个id ，一个 seq
      // 所以这里必须写成后台一致的形式

      // 1.点击下方可选频道，加入到订阅频道中去
      let curChannelList = [...this.channels, channel]
      curChannelList = curChannelList.map((item, idx) => {
        return {
          id: item.id,
          seq: idx
        }
      })

      // 把排在第一个位置的“推荐”频道去掉；
      curChannelList.splice(0, 1)

      // 2.调用新增频道功能的接口
      await addChannels(curChannelList)

      // 3.更新视图
      this.channels.push(channel)
      // this.channels.push(channel)作用有3
      // ---1.修改已经订阅的频道；
      // ---2.修改父组件，index.vue里面的channels；
      // ---3.激活计算属性，重新计算。
    },

    async loadAllChannels () {
      const res5 = await getAllChannels()
      console.log(res5)
      this.allChannels = res5.data.data.channels
    }
  }
}
</script>

<style lang='less' scoped>
.channel {
    padding: 15px;
    font-size: 15px;
}
.btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 25px;
}
.cur {
  color:green;
  font-weight: bold;
}
.btn2 {
  background-color: red;
}
.btn3 {
  background-color: blue;
}
</style>
