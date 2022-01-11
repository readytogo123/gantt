<template>
  <div class="container">
    <!-- 导航条 -->
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料"></van-nav-bar>

    <!-- 编辑区 -->
    <van-cell-group>
      <input type="file" hidden @change="hPhoto" ref="refphp" />
      <!-- 通过 input type="file"-----来监听change事件-->
      <van-cell is-link title="头像" center @click="hShowSelectImg">
        <van-image
          slot="default"
          width="22px"
          height="22px"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <!-- value： 设置右侧显示的文字 -->
      <van-cell is-link title="姓名" :value="user.name" @click="showName=true"/>

      <van-cell is-link title="性别" :value="user.gender === 1?'男':'女'" @click="showGender=true"/>

      <van-cell is-link title="生日" :value="user.birthday" @click="showBirthday=true"/>
    </van-cell-group>

    <!-- 修改名字 -->
    <van-dialog
    title="修改名字"
    show-cancel-button
    v-model="showName"
    @confirm="hSaveName"
    >
      <van-field v-model.trim="newName" />
    </van-dialog>

    <!-- 修改性别 -->
    <van-popup v-model="showGender" position="bottom">
      <van-nav-bar title="修改性别" left-text="取消" @click-left="showGender=false"></van-nav-bar>
      <van-cell title="男"  @click="hSaveGender(0)" is-link></van-cell>
      <van-cell title="女"  @click="hSaveGender(1)" is-link></van-cell>
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
// import { getProfile, updateUserInfo, updatePhoto } from '@/api/user.js'
import { getProfile, updateUserInfo, updatePhoto } from '@/api/user.js'
import dayjs from 'dayjs'
export default {
  name: 'userProfile',
  data () {
    return {
      // 控制弹层
      showName: false,
      showGender: false,
      showBirthday: false,

      // 当前用户的信息
      user: { },

      // 修改后的新名字
      newName: '',
      // 修改后新生日
      newDate: new Date(),
      minDate: new Date(2000, 0, 10), // dateTime-picker中最小时间
      maxDate: new Date() // 当前时间
    }
  },

  created () {
    this.loadProfile()
  },

  methods: {
    // 点击上传头像
    hShowSelectImg () {
      this.$refs.refphp.click()
    },
    // 保存用户头像函数
    async hPhoto () {
      const file = this.$refs.refphp.files[0]
      // 获取当前的dom对象，在input文件域里面的---files属性名之中，存储了用户选择的所有文件
      // 这个案例之中，只是一个单选，所以用files[0]
      if (!file) {
        return
      }
      this.$toast.loading({
        duration: 0,
        mask: true,
        message: 'loading...'
      })
      try {
        const fd = new FormData() // 由于上传的是图像文件，所以用FormData()构建参数
        fd.append('photo', file)
        const res = await updatePhoto(fd) // 调用接口，发送请求
        this.user.photo = res.data.data.photo // 更新视图
        this.$store.commit('SetUserphoto', this.user.photo)
        this.$toast.success('修改头像成功')
      } catch (error) {
        this.$toast.fail('修改头像失败')
      }
    },
    // 保存用户姓名函数
    async hSaveName () {
      if (this.newName === '') {
        return
      }
      this.$toast.loading({
        duration: 0,
        mask: true,
        message: 'loading...'
      })

      try {
        // 1.调用接口，发送请求，修改名字
        await updateUserInfo({
          name: this.newName
        })

        // 2.更新视图
        this.user.name = this.newName
        this.newName = this.user.name
        this.$toast.success('修改姓名成功')
      } catch (error) {
        this.$toast.fail('修改姓名失败')
      }
    },

    // 保存用户性别函数
    async hSaveGender (gender) {
      this.$toast.loading({
        duration: 0,
        mask: true,
        message: 'loading...'
      })

      try {
        // 1.调用接口，发送请求，修改名字
        await updateUserInfo({
          gender
        })

        // 2.更新视图
        this.user.gender = gender
        this.$toast.success('修改性别成功')
        this.showGender = false
      } catch (error) {
        this.$toast.fail('修改性别失败')
        this.showGender = false
      }
    },

    // 保存用户生日函数
    async hSaveBirthday () {
      const birthday = dayjs(this.newDate).format('YYYY-MM-DD')
      this.$toast.loading({
        duration: 0,
        mask: true,
        message: 'loading...'
      })

      try {
        // 1.调用接口，发送请求，修改日期
        await updateUserInfo({
          birthday: birthday
        })

        // 2.更新视图
        this.user.birthday = birthday
        this.$toast.success('修改日期成功')
        this.showBirthday = false
      } catch (error) {
        this.$toast.fail('修改日期失败')
        this.showBirthday = false
      }
    },
    async loadProfile () {
      const res = await getProfile()
      this.user = res.data.data
      this.newName = this.user.name
    }
  }
}

</script>
