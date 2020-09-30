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
          <p>图片上传及管理</p>
          <CategoryIcons v-if="refresh"></CategoryIcons>
          <el-button type="primary" @click="addCategory">提交</el-button>
        </el-col>
      </el-row>
      <el-button type="primary" @click="addDialog=true">新增图片</el-button>
      <el-table :data="imgList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="描述" prop="describe"></el-table-column>
        <el-table-column label="位置" prop="position" ></el-table-column>
        <el-table-column label="路径" prop="src"></el-table-column>
        <el-table-column label="操作" width="120">
          <!--HTML内容模板：<template>元素，是一种用于保存客户端内容机制，该内容在加载页面时不会呈现，
          但随后可以(原文为 may be)在运行时使用JavaScript实例化。
          将模板视为一个可存储在文档中以便后续使用的内容片段。
          虽然解析器在加载页面时确实会处理<template>元素的内容，但这样做只是为了确保这些内容有效；但元素内容不会被渲染。
          -->
          <template v-slot="data">
            <el-tooltip effect="dark" content="编辑图片信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(data.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除图片" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="del(data.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :visible.sync="addDialog"></el-dialog>
    <el-dialog :visible.sync="editDialog"></el-dialog>

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
        addDialog:false,
        editDialog:false,
        iconList:[],
        //成功提交后所有照片墙子组件强制刷新
        refresh:true,
        imgList:[]
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
