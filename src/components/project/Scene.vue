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
        <el-table-column label="宣传语" prop="slogan"></el-table-column>
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
      <el-form :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="景区名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="景区地址" prop="location">
          <el-input v-model="addForm.location"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="slogan">
          <el-input v-model="addForm.slogan"></el-input>
        </el-form-item>

        <el-form-item label="详情页图片">
          <intro-imgs @intro="intro($event)"></intro-imgs>
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
  import IntroImgs from "./components/IntroImgs"
  import {mapGetters, mapState,mapActions,mapMutations} from "vuex"

  export default {
    components: {IntroImgs},
    created() {
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
          slogan:'',
          username:this.username,
          location:'',
          // introImgs:this.$store.state.IntroImgs.introImgs, 不行，在vue实例创建后只会初始化一次
          introImgs:[],
          postcard:null,
          swiper:null,
          detail:null
        },

        dialogImageUrl: '',
        dialogVisible: false,
        fileList:[],

        //添加规则
        rules:{
          name: [
            { required: true, message: '请输入景区名', trigger: 'blur' },
          ],
          location: [
            { required: true, message: '请输入景区地址', trigger: 'blur' },
          ],
          slogan: [
            { required: true, message: '请输入宣传语', trigger: 'blur' },
          ]
        },
      }
    },
    methods:{
      async getSceneList(){
        await axios.get('http://localhost:2021/mini/scene/getByUsername',{
          params:{username:this.username}
        })
        .then(res=>{
          this.sceneList=res.data
        })
      },
      addScene(){

      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(file, fileList){
        this.fileList = fileList.slice(-6)
      },
      handleSuccess(response,file){
        this.addForm.introImgs.push({
          name:file.name,
          src:file.response,
          type:'swiper',
          top:false
        })
        console.log(this.addForm.introImgs)
      },
      handleRemove(file, fileList) {
        this.addForm.introImgs = []
        fileList.forEach(file => {
          this.addForm.introImgs.push({
            name:file.name,
            src:file.response,
            type:'swiper',
            top:false
          })
        })
      },
    },
    //★★★用组件的watch属性将data中的数据和vuex中的数据同步
    //不要加this！！！
    watch: {
      '$store.state.IntroImgs.sceneIntros'(){
        this.introImgs=this.$store.state.IntroImgs.sceneIntros
        console.log(this.introImgs)
      }
    }
  }
</script>

<style scoped lang="less">
.el-input{
  width: 400px;
}
.el-upload-dragger{
  width: 146px;
}

</style>
