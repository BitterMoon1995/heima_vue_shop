<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>景区列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <!--        添加按钮-->
        <el-col>
          <el-button type="primary" @click="addDialog=true">新增景区</el-button>
        </el-col>
      </el-row>

      <el-table :data="sceneList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="景区名" prop="name"></el-table-column>
        <el-table-column label="景区地址" prop="location"></el-table-column>
        <el-table-column label="宣传语" prop="introduce"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-tooltip effect="dark" content="编辑景区信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(data.row)" ></el-button>
            </el-tooltip>
            <!--            <el-tooltip effect="dark" content="修改权限" placement="top" :enterable="false">-->
            <!--              <el-button type="warning" icon="el-icon-setting" circle></el-button>-->
            <!--            </el-tooltip>-->
            <el-tooltip effect="dark" content="删除本景区" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="delUser(data.row.id)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

<!--    添加 对话框-->
    <el-dialog title="新增景区" :visible.sync="addDialog" width="70%" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="景区名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="景区地址" prop="location">
          <el-input v-model="addForm.location"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="introduce">
          <el-input v-model="addForm.introduce"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addScene">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import axios from "axios"

  export default {
    created() {
      axios.defaults.baseURL='http://localhost:2021/mini/scene'
      this.username=window.sessionStorage.getItem('username')
      this.getSceneList()
    },
    data() {
      return {
        username:'',
        sceneList:[],
        addDialog:false,
        addForm: {
          name:'',
          introduce:'',
          username:this.username,
          location:''
        }
      }
    },
    methods:{
      async getSceneList(){
        await axios.get('/getByUsername',{
          params:{username:this.username}
        })
        .then(res=>{
          this.sceneList=res.data
        })
      },
      addScene(){

      }
    }
  }
</script>

<style scoped lang="less">
.el-input{
  width: 400px;
}
</style>
