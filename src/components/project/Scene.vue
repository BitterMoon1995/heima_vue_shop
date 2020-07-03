<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>景区列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="0">
        <!--        搜索框-->
        <el-col :span="5">
          <div>
            <!--            可清除输入框-->
            <el-input placeholder="请输入内容" v-model="queryParams.condition"
                      clearable @clear="clear" @keyup.enter.native="search">
              <el-button slot="append" icon="el-icon-search" @click="search" ></el-button>
            </el-input>
          </div>
        </el-col>
        <!--        添加按钮-->
        <el-col :span="4" style="padding: 0;margin-left: 100px">
          <el-button type="primary" @click="addDialog=true">新增景区</el-button>
        </el-col>

      </el-row>

      <el-table :data="sceneList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="景区名" prop="name"></el-table-column>
        <el-table-column label="景区地址" prop="location"></el-table-column>
        <el-table-column label="宣传语" prop="slogan"></el-table-column>
        <el-table-column label="星级" prop="level"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-tooltip effect="dark" content="编辑景区信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(data.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除本景区" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="del(data.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNum"
        :page-sizes="[20, 30, 50, 80]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        <!--          没有总条目数就无法正常分页，全部死妈-->
      </el-pagination>
    </el-card>

    <!--    添加 对话框-->
    <el-dialog title="新增景区" :visible.sync="addDialog" width="70%" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px" :rules="rules" ref="addSceneRef">
        <el-form-item label="景区名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="景区地址" prop="location">
          <el-input v-model="addForm.location"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="slogan">
          <el-input v-model="addForm.slogan"></el-input>
        </el-form-item>
        <el-form-item label="星级" prop="level">
          <el-input v-model="addForm.level"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>

        <el-form-item label="名片">
          <postcard v-if="refresh"></postcard>
        </el-form-item>
        <el-form-item label="首页展示图">
          <slider v-if="refresh"></slider>
        </el-form-item>
        <el-form-item label="详情页轮播图">
          <intro-imgs v-if="refresh"></intro-imgs>
        </el-form-item>
        <el-form-item label="详情页长图">
          <rich-text v-if="refresh"></rich-text>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addScene">确 定</el-button>
      </span>
    </el-dialog>

    <!--    修改 对话框-->
    <el-dialog title="修改景区信息" :visible.sync="editDialog" width="70%" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="rules" ref="editFormRef">
        <el-form-item label="景区名" prop="name" >
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="景区地址" prop="location">
          <el-input v-model="editForm.location"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="slogan">
          <el-input v-model="editForm.slogan"></el-input>
        </el-form-item>
        <el-form-item label="星级" prop="level">
          <el-input v-model="editForm.level"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>

        <el-form-item label="名片">
          <postcard v-if="refresh"></postcard>
        </el-form-item>
        <el-form-item label="首页展示图">
          <slider v-if="refresh"></slider>
        </el-form-item>
        <el-form-item label="详情页轮播图">
          <intro-imgs v-if="refresh"></intro-imgs>
        </el-form-item>
        <el-form-item label="详情页长图">
          <rich-text v-if="refresh"></rich-text>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editScene">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import axios from "axios"
  import IntroImgs from "./components/IntroImgs"
  import Postcard from "./components/Postcard"
  import Slider from "./components/Slider"
  import RichText from "./components/RichText";

  export default {
    components: {IntroImgs, Postcard, Slider, RichText},
    created() {
      axios.defaults.baseURL="http://localhost:2020/mini/scene"
      this.getSceneList()
    },
    data() {
      return {
        username: '',
        sceneList: [],

        addDialog: false,
        addForm: {
          name: '',
          slogan: '',
          username: this.username,
          location: '',
          level: '',
          price: 0,
          // introImgs:this.$store.state.IntroImgs.introImgs, 不行，在vue实例创建后只会初始化一次
          introImgs: [],
          postcard: null,
          slider: null,
          richText: null
        },
        //成功提交后所有照片墙子组件强制刷新
        refresh:true,

        editDialog: false,
        editForm: {
          id: '',
          name: '',
          slogan: '',
          username: '',
          location: '',
          level: '',
          price: 0,

          introImgs: [],
          postcard: null,
          slider: null,
          richText: null
        },

        //添加规则
        rules: {
          name: [
            {required: true, message: '请输入景区名', trigger: 'blur'},
            {max: 20, message: '字数请控制在20以内', trigger: 'blur'}
          ],
          location: [
            {required: true, message: '请输入景区地址', trigger: 'blur'},
            {max: 40, message: '字数请控制在40以内', trigger: 'blur'}
          ],
          slogan: [
            {required: true, message: '请输入宣传语', trigger: 'blur'},
            {max: 200, message: '字数请控制在200以内', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请输入景区星级', trigger: 'blur'},
            {max: 2, message: '字数请控制在2以内', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'}
          ]
        },

        queryParams: {
          pageNum: 1,
          pageSize: 20,
          condition: '',
          username: ''
        },
        total: 0,

      }
    },
    methods: {
      async getSceneList() {
        this.queryParams.username = window.sessionStorage.getItem('username')
        await axios.get('/getByUsername', {
          params: this.queryParams
        })
          .then(res => {
            this.sceneList = res.data.sceneList
            this.total = res.data.total
          })
      },
      addScene() {

        this.$refs.addSceneRef.validate(async valid=>{
          if (!valid || this.addForm.slider==null || this.addForm.richText==null
          || this.addForm.postcard==null || this.addForm.introImgs==null){
            this.$message.error('请检查录入信息！')
            return
          }
          this.addForm.username = window.sessionStorage.getItem('username')
          const {data}=await axios.post('/add', this.addForm)
          if (data.info.code===400) {
            this.$message.error(data.info.msg)
            return
          }
          if (data.info.code===200) {
            this.$message.success(data.info.msg)
            this.addDialog = false
            this.$refs.addSceneRef.resetFields()
            // this.cleanImg=true  子组件监听父组件无效
            // location.reload()   用户体验为淋
            this.refresh=false
            this.$nextTick(() => {
              this.refresh = true
            })  //神神神神神神神神神神神神
            await this.getSceneList()
          }
        })
      },

      showEditDialog(data){
        this.editDialog=true
        this.editForm=data
      },
      editScene(){
        this.$refs.editFormRef.validate(async valid=>{
          // if (!valid){
          //   this.$message.error('请检查录入信息！')
          //   return
          // }
          const {data}=await axios.post('/add', this.editForm)
          if (data.info.code===400) {
            this.$message.error(data.info.msg)
            return
          }
          if (data.info.code===200) {
            this.$message.success(data.info.msg)
            this.editDialog = false
            this.$refs.editFormRef.resetFields()
            this.refresh=false
            this.$nextTick(() => {
              this.refresh = true
            })
            await this.getSceneList()
          }
        })
      },
      async del(data){
        const res=await this.$confirm('此操作将永久删除该景区, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .catch(err=>err)
        if (res==='cancel'){
          return this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }
        else
        {
          axios.delete('/del', {
            params: {id: data}
          }).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getSceneList()
            }
          })
        }
      },

      //监听每页要显示的条目数的变化
      handleSizeChange(newSize) {
        this.queryParams.pageSize = newSize
        this.getSceneList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryParams.pageNum = newPage
        this.getSceneList()
      },
      //搜索
      search() {
        this.getSceneList()
      },
      //清空搜索框的同时重新加载表格
      clear() {
        this.queryParams.condition = ''
        this.getSceneList()
      }
    },
    //★★★用组件的watch属性将data中的数据和vuex中的数据同步
    //不要加this！！！
    //要同步俩
    watch: {
      '$store.state.IntroImgs.intros'() {
        this.addForm.introImgs = this.$store.state.IntroImgs.intros
        this.editForm.introImgs = this.$store.state.IntroImgs.intros
      },
      '$store.state.Postcard.postcard'() {
        this.addForm.postcard = this.$store.state.Postcard.postcard
        this.editForm.postcard = this.$store.state.Postcard.postcard
      },
      '$store.state.Slider.slider'() {
        this.addForm.slider = this.$store.state.Slider.slider
        this.editForm.slider = this.$store.state.Slider.slider
      },
      '$store.state.RichText.richText'() {
        this.addForm.richText = this.$store.state.RichText.richText
        this.editForm.richText = this.$store.state.RichText.richText
      }
    }
  }
</script>

<style scoped lang="less">
  .el-input {
    width: 420px;
  }

  .el-upload-dragger {
    width: 146px;
  }
</style>
