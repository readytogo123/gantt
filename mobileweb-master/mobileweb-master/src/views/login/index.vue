<template>
  <div class="login">
    <!-- 1.导航栏 -->
    <van-nav-bar title="黑马头条-登陆" />

    <!-- 2.表单部分 -->
    <van-cell-group>
      <van-field
        v-model.trim="mobile"
        required
        label="手机号"
        placeholder="请输入手机号"
        :err-message="mobile_errmsg"
      />
      <van-field
        v-model.trim="code"
        required
        label="密码"
        type="password"
        placeholder="请输入密码号"
        :error-message="code_errmsg"
      />
    </van-cell-group>

    <!-- 3.登录按钮 -->
    <div class="btn-wrap">
      <van-button type="primary" @click="hlogin" class="btn">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login, getInfo } from '@/api/user'
// import ajax from "@/utils/request";
// 上面这一步是引入已经封装好了的axios

export default {
  name: 'Login',

  data () {
    // 注意:登录功能的实现，必须要调用接口，而且要传入参数
    return {
      mobile: '13912345678',
      code: '246810',
      mobile_errmsg: '',
      code_errmsg: ''
      // 上面两个是错误提示
    }
  },

  methods: {
    check () {
      // 注意：如果请求验证不通过，则返回false
      this.mobile_errmsg = this.mobile === '' ? '请输入手机号码' : ''
      this.code_errmsg = this.code === '' ? '密码错误' : ''

      if (this.mobile === '') {
        return false
      }

      if (this.code === '') {
        return false
      }

      return true
    },

    async hlogin () {
      if (!this.check()) {
        // 上面的!this.check()意思是-----如果不存在这个验证，那么要先发送请求，获取数据
        return
      }

      this.$toast.loading({
        duration: 0,
        // 上面是持续展示toast，永远不会关闭
        mask: true,
        // 整体加上一个遮罩层
        message: '加载中......'
      })

      try {
        const result = await login(this.mobile, this.code)

        console.log(result.data.data)

        this.$store.commit('settokeninfo', result.data.data)

        // result里面保存了token，直接保存到vuex里面（这样一来，所有的组件都可以使用了）
        // 下面的代码是给页面覆盖上一个toast提示

        // 2.再次发送请求 获取个人信息
        const res = await getInfo()
        console.log(res)
        const user = res.data.data
        // 保存到vuex里面

        this.$store.commit('mSetUserInfo', {
          id: user.id,
          name: user.name,
          photo: user.photo
        })

        this.$toast.success('登录成功')

        const backto = this.$route.query.backto || '/'

        this.$router.push(backto)
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败')
      }
    }
    // 注意：之后在开发项目中，-----所有涉及接口的请求应该这么做：
    // 1.先封装成一个模块
    // 2.再从模块里面调用方法，之后再在组件里面使用
  }
}
</script>

<style lang="less" scoped>
.login {
  .btn-wrap {
    padding: 20px;
    .btn {
      width: 100%;
      background-color: #6db4fd;
      color: #fff;
    }
  }
}
</style>
