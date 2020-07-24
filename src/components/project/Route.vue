<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>线路列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialog=true">新增线路</el-button>
          <!--          <el-button type="success" @click="nigger">check addForm</el-button>-->
        </el-col>

      </el-row>

      <el-table :data="routeList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="线路名" prop="name"></el-table-column>
        <el-table-column label="线路规划" prop="planning"></el-table-column>
        <el-table-column label="宣传语" prop="slogan"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-tooltip effect="dark" content="编辑线路信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(data.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除本线路" placement="top" :enterable="false">
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
    <el-dialog title="新增线路" :visible.sync="addDialog" width="70%" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px" :rules="rules" ref="addRouteRef">
        <el-form-item label="线路名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="线路规划" prop="planning">
          <el-input v-model="addForm.planning"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="slogan">
          <el-input v-model="addForm.slogan"></el-input>
        </el-form-item>

        <el-form-item label="名片">
          <postcard v-if="refresh"></postcard>
        </el-form-item>
        <el-form-item label="首页轮播图">
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
        <el-button type="primary" @click="addRoute">确 定</el-button>
      </span>
    </el-dialog>

    <!--    修改 对话框-->
    <el-dialog title="修改线路信息" :visible.sync="editDialog" width="70%" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="rules" ref="editFormRef">
        <el-form-item label="线路名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="线路规划" prop="planning">
          <el-input v-model="editForm.planning"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="slogan">
          <el-input v-model="editForm.slogan"></el-input>
        </el-form-item>

        <el-form-item label="名片">
          <postcard v-if="refresh"></postcard>
        </el-form-item>
        <el-form-item label="首页轮播图">
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
        <el-button type="primary" @click="editRoute">确 定</el-button>
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
      let username = window.sessionStorage.getItem('username')
      this.addForm.username = username
      this.editForm.username = username
      axios.defaults.baseURL="http://localhost:2020/mini/route"
      this.getRouteList()
    },
    data() {
      return {
        username: '',
        routeList: [],

        addDialog: false,
        addForm: {
          name: '',
          planning:'',
          slogan: '',
          username: this.username,
          // introImgs:this.$store.state.IntroImgs.introImgs, 不行，在vue实例创建后只会初始化一次
          introImgs: [],
          postcard: null,
          slider: null,
          richText: null
        },
        refresh:true,

        editDialog: false,
        editForm: {
          id: '',
          name: '',
          planning:'',
          slogan: '',
          username: '',
          // introImgs:this.$store.state.IntroImgs.introImgs, 不行，在vue实例创建后只会初始化一次
          introImgs: [],
          postcard: null,
          slider: null,
          richText: null
        },

        //添加规则
        rules: {
          name: [
            {required: true, message: '请输入线路名', trigger: 'blur'},
            {max: 20, message: '字数请控制在20以内', trigger: 'blur'}
          ],
          planning: [
            {required: true, message: '请输入线路规划', trigger: 'blur'},
            {max: 20, message: '字数请控制在80以内', trigger: 'blur'}
          ],
          slogan: [
            {required: true, message: '请输入宣传语', trigger: 'blur'},
            {max: 200, message: '字数请控制在200以内', trigger: 'blur'}
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
      async getRouteList() {
        this.queryParams.username = window.sessionStorage.getItem('username')
        await axios.get('/getByUsername', {
          params: this.queryParams
        })
          .then(res => {
            this.routeList = res.data.routeList
            this.total = res.data.total
          })
      },
      addRoute() {
        this.$refs.addRouteRef.validate(async valid=>{
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
            this.$refs.addRouteRef.resetFields()

            this.refresh=false
            this.$nextTick(() => {
              this.refresh = true
            })

            await this.getRouteList()
          }
        })
      },

      nigger() {
        console.log(this.addForm)
      },

      showEditDialog(data){
        this.editDialog=true
        this.editForm=data
      },
      editRoute(){
        this.$refs.editFormRef.validate(async valid=>{
          if (!valid){
            this.$message.error('请检查录入信息！')
            return
          }
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
            await this.getRouteList()
          }
        })
      },
      async del(data){
        const res=await this.$confirm('此操作将永久删除该线路, 是否继续?', '警告', {
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
              this.getRouteList()
            }
          })
        }
      },

      //监听每页要显示的条目数的变化
      handleSizeChange(newSize) {
        this.queryParams.pageSize = newSize
        this.getRouteList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryParams.pageNum = newPage
        this.getRouteList()
      },
      //搜索
      search() {
        this.getRouteList()
      },
      //清空搜索框的同时重新加载表格
      clear() {
        this.queryParams.condition = ''
        this.getRouteList()
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
