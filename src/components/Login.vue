<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png">
      </div>
<!--      ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。-->
<!--      如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例：-->
      <el-form class="form" :model="form" ref="formRef" :rules="loginRules">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" show-password v-model="form.password" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login" >登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      resetForm() {
        console.log(this)
        //调用组件的表单重置方法
        this.$refs.formRef.resetFields()
      },
      login() {
        let validResult
        //前台校验，规则沿用rules。第一个参数为校验结果，第二个为出错的字段
        this.$refs.formRef.validate((valid,obj)=>{
          validResult=valid
        })
        if (!validResult) return
        this.axios.post('/user/login',this.form)
        .then(result=>{
          let {msg,code}=result.data.info
          if (code===404) return this.$message.success(msg)
          if (code===400) return this.$message.success(msg)
          if (code===200) {
            let {data}=result
            console.log(data.data)
            //弹窗
            this.$message.success(msg)
            // 获取并存贮token到sessionStorage中（存活于当前会话）
            let token=data.data
            window.sessionStorage.setItem('token',token)
            //
            this.$router.push('/home')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-image: linear-gradient(#a8edea, #fed6e3);
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); //向左、向上移动自身宽度的百分之五十
  }

  .login_logo {
    width: 110px;
    height: 110px;
    position: absolute;
    left: 50%;
    top: 2.5%;
    transform: translate(-50%); //向左、向上移动自身宽度的百分之五十
    img {
      width: 100%;
      height: 100%;
    }
  }

  .btn {
    display: flex;
    justify-content: center;
  }

  .form {
    position: absolute;
    top: 122px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
