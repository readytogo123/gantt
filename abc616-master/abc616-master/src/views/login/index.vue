<template>
    <div class="login">
        <van-nav-bar
        title="标题"
        />
        <van-cell-group >
            <!-- 输入手机号 -->
            <van-field required :error-message="mobile_errmsg"
            :rules="[{ required: true, message: '请填写手机号' }]"
            v-model.trim="mobile" type="tel" label="手机号："
            placeholder="请输入手机号码"/>
            <!-- 输入密码 -->
            <van-field required :error-message="code_errmsg"
            :rules="[{ required: true, message: '请填写密码' }]"
            v-model.trim="code" type="password" label="密码："
            placeholder="请输入密码"/>
        </van-cell-group>
        <div class="btn-wrap">
            <van-button type="info" class="btn" @click="login">登录</van-button>
        </div>
    </div>
</template>

<script>
// import ajax from '@/utils/request'
import { login, getInfo } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      mobile: '13912345678',
      code: '246810',
      mobile_errmsg: '',
      code_errmsg: ''
    }
  },

  methods: {
    check () {
    //   this.mobile_errmsg = this.mobile === '' ? '手机号码要对' : ''
    //   this.code_errmsg = this.code === '' ? '密码要对' : ''
      if (this.mobile === '') {
        this.mobile_errmsg = '手机号不能为空 '
        // return false
      }

      if (this.code === '') {
        this.code_errmsg = '密码不能为空 '
        return false
      }
      return true
    },
    async login () {
      // 一样的套路---校验---***发送请求***，根据结果，登录成功or登录失败
      if (!this.check()) {
        alert('验证不通过')
        return
      }
      // 添加遮罩层，防止用户一直点击登录
      this.$toast.loading({
        duration: 0,
        // 0---永远不关闭
        mask: true,
        // 遮罩层
        message: '登录中...'
      })
      try {
        const res = await login(this.mobile, this.code)
        console.log(res)
        // 1.保存token到vuex，所有组件都可以访问到
        this.$store.commit('SetTokenInfo', res.data.data)
        const backto = this.$route.query.backto || '/'
        this.$router.push(backto)
        const res2 = await getInfo() // 这是获取个人信息的接口，登录的同时，保存token，也可以保存个人信息
        const user = res2.data.data
        // 2.后续请求时，把token加入到请求头当中去
        // await ajax({
        //   method: 'post',
        //   url: 'app/v1_0/authorizations',
        //   data: {
        //   // 请求体body传参，要用data来写
        //     mobile: this.mobile,
        //     code: this.code
        //   }
        // })
        // 添加一个遮罩层，登录成功提示
        // 保存个人的id-name-photo到VUEX中去
        this.$store.commit('SetUserInfo', {
          id: user.id,
          name: user.name,
          photo: user.photo
        })
        this.$toast.success('登录成功')
      } catch (err) {
        // 添加一个遮罩层，登录失败提示
        this.$toast.fail('登录失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
    .btn-wrap {
        .btn {
            width:100%;
        }

    }
}
</style>
