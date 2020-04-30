<template>
<div class="login_container">
  <div class="login_box">
    <div class="login_logo">
      <img src="../assets/logo.png">
    </div>
    <el-form class="form" :model="form" ref="formRef">
      <el-form-item>
        <el-input prefix-icon="el-icon-user" v-model="form.username" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input prefix-icon="el-icon-lock" show-password v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary">登陆</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
    export default {
        data(){
          return{
            form:{
              username:'',
              password:''
            }
          }
        },
        methods:{
          resetForm(){
            this.$refs.formRef.resetFields()
          }
        }

    }
</script>

<style lang="less" scoped>
.login_container{
  background-image: linear-gradient(#a8edea,#fed6e3);
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);//向左、向上移动自身宽度的百分之五十
}
.login_logo{
  width: 110px;
  height: 110px;
  position: absolute;
  left: 50%;
  top: 2.5%;
  transform: translate(-50%);//向左、向上移动自身宽度的百分之五十
  img{
    width: 100%;
    height: 100%;
  }
}
.btn{
  display: flex;
  justify-content: center;
}
.form{
  position: absolute;
  top: 122px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
