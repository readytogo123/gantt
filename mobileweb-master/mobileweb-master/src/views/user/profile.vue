<template>
  <div class="container">
    <!-- 导航条 -->
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料"></van-nav-bar>

    <!-- 编辑区 -->
    <van-cell-group>
      <input type="file" hidden @change="hPhotoChange" ref="refPhoto" />
      <!-- 通过 input type="file"-----来监听change事件-->
      <van-cell is-link title="头像" center @click="hShowSelectImage">
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <!-- value： 设置右侧显示的文字 -->
      <van-cell is-link title="姓名" :value="user.name" @click="showName=true" />

      <van-cell is-link title="性别" :value="user.gender === 1?'男':'女'" @click="showGender=true" />

      <van-cell is-link title="生日" :value="user.birthday" @click="showBirthday=true" />
    </van-cell-group>

    <!-- 修改名字 -->
    <van-dialog v-model="showName" title="修改名字" show-cancel-button @confirm="hSaveName">
      <van-field v-model.trim="newName" />
    </van-dialog>

    <!-- 修改性别 -->
    <van-popup v-model="showGender" position="bottom">
      <van-nav-bar title="修改性别" left-text="取消" @click-left="showGender=false"></van-nav-bar>
      <van-cell title="男" @click="hSaveGender(0)" is-link></van-cell>
      <van-cell title="女" @click="hSaveGender(1)" is-link></van-cell>
    </van-popup>

    <!-- 修改年龄 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-nav-bar title="修改生日"></van-nav-bar>
      <!-- min-date：  dateTime-picker中最小时间 -->
      <van-datetime-picker
        v-model="newDate"
        type="date"
        title="选择年月日"
        @cancel="showBirthday=false"
        @confirm="hSaveBirthday"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { getProfile, updateUserInfo, updatePhoto } from '@/api/user.js'

export default {
  name: 'userProfile',
  data () {
    return {
      // 控制弹层
      showName: false,
      showGender: false,
      showBirthday: false,

      // 当前用户的信息
      user: { name: '张三' },

      // 修改后的新名字
      newName: '',
      // 修改后新生日
      newDate: new Date(),
      minDate: new Date(1965, 0, 10), // dateTime-picker中最小时间
      maxDate: new Date() // 当前时间
    }
  },

  created () {
    this.loadProfile()
  },

  methods: {
    hShowSelectImage () {
      this.$refs.refPhoto.click()
    },

    async loadProfile () {
      const result = await getProfile()
      console.log(result)
      this.user = result.data.data
    },

    // 下面是确认修改名字的函数
    async hSaveName () {
      if (this.newName === '') {
        return
      }

      this.$toast.loading({
        duration: 0, // 永远不会关闭
        mask: true,
        message: '操作中....'
      })

      try {
        // 1.调用接口，发送请求，修改名字
        const result = await updateUserInfo({
          name: this.newName
        })

        console.log(result)

        // 2.更新视图
        this.user.name = this.newName
        this.newName = ''

        this.$toast.success('修改名字成功')
      } catch {
        this.$toast.fail('修改名字失败')
      }
    },

    // 下面是确认修改性别的函数
    async hSaveGender (gender) {
      this.$toast.loading({
        duration: 0, // 永远不会关闭
        mask: true,
        message: '操作中....'
      })

      try {
        // 1. 调用接口，发请求，修改性别
        const result = await updateUserInfo({
          gender
        })
        console.log(result)

        // 2. 更新视图
        this.user.gender = gender

        this.$toast.success('修改性别成功')

        // 3. 收起弹层

        this.showGender = false
      } catch (err) {
        this.$toast.fail('修改性别失败')
      }
    },

    // 下面是确认修改生日的函数
    async hSaveBirthday (val) {
      // console.log(val)
      // https://day.js.org/docs/zh-CN/display/format
      // console.log(dayjs(val).format('YYYY-MM-DD'))

      // 现在拿到的格式是：2020-06-14T16:00:00.000Z

      // 接口中需要的格式是： 2018-12-20
      // 需进行日期时间的格式转换
      // val = dayjs(val).format('YYYY-MM-DD')
      this.$toast.loading({

        duration: 0, // 持续展示 toast,永远不会关闭

        overlay: true, // 整体添加一个遮罩

        message: '操作中...'
      })

      try {
        // 2. 调用api,更新生日
        const result = await updateUserInfo({
          birthday: val
        })
        console.log(result)

        // 3. 更新视图

        this.user.birthday = val

        this.showBirthday = false

        this.$toast.success('修改成功')
      } catch {
        this.$toast.fail('修改失败')

        this.showBirthday = false
      }
    },

    // 下面是确认修改头像的函数
    async hPhotoChange () {
      // 1. 获取当前用户选中的图片文件
      // this.$refs.refPhoto就是页面上的input文件域。
      // 它有一个属性files，是一个集合，其中就放置着当前用户选中的文件

      const file = this.$refs.refPhoto.files[0]

      if (!file) {
        // 表示用户没有弹出的选择框中选中任何文件： 用户点击了取消
        return
      }

      this.$toast.loading({
        duration: 0, // 持续展示 toast,永远不会关闭

        overlay: true, // 整体添加一个遮罩

        message: '操作中...'
      })
      try {
        // 1. 组装参数

        const fd = new FormData()

        fd.append('photo', file)

        // 2. 调用接口

        const result = await updatePhoto(fd)

        // 调用接口成功时，它会返回这张图在服务器上的绝对地址
        // 3. 更新视图

        this.user.photo = result.data.data.photo

        // 4.保存到VUEX里面
        this.$store.commit('mSetUserPhoto', this.user.photo)

        this.$toast.success('修改成功')
      } catch {
        this.$toast.fail('修改失败')
      }
    }
  }
}
</script>
