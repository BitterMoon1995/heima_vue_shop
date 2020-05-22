<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页页面</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="12">
          <p>首页分类导航图标</p>
          <CategoryIcons v-if="refresh"></CategoryIcons>
          <el-button type="primary" @click="addCategory">提交</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import CategoryIcons from "./components/CategoryIcons";
  import axios from "axios"
  export default {
    created() {
      axios.defaults.baseURL='http://localhost:2020/mini/icon'
    },
    components:{CategoryIcons},
    data() {
      return {
        iconList:[],
        //成功提交后所有照片墙子组件强制刷新
        refresh:true
      }
    },
    methods: {
      addCategory(){
        axios.post('/addCategory',this.iconList)
        .then(res=>{
          if (res.data.info.code===200) {
            this.refresh=false
            this.$nextTick(() => {
              this.refresh = true
            })
            this.$message.success('成功上传！')
          }
        })
      }
    },
    watch: {
      '$store.state.IntroImgs.intros'() {
        this.iconList = this.$store.state.IntroImgs.intros
        console.log(this.iconList)
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-button{
    margin-top: 10px;
  }
</style>
