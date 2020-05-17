<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
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
        <el-col :span="4" style="padding: 0">
          <el-button type="primary" @click="addDialog=true">新增活动</el-button>
          <!--          <el-button type="success" @click="nigger">check addForm</el-button>-->
        </el-col>

      </el-row>

      <el-table :data="activityList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="活动名" prop="name"></el-table-column>
        <el-table-column label="活动地址" prop="location"></el-table-column>
        <el-table-column label="宣传语" prop="slogan"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-tooltip effect="dark" content="编辑活动信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(data.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除本活动" placement="top" :enterable="false">
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
    <el-dialog title="新增活动" :visible.sync="addDialog" width="70%" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px" :rules="rules" ref="addActivityRef">
        <el-form-item label="活动名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动地址" prop="location">
          <el-input v-model="addForm.location"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="slogan">
          <el-input v-model="addForm.slogan"></el-input>
        </el-form-item>

        <el-form-item label="名片">
          <postcard v-if="refresh"></postcard>
        </el-form-item>
        <el-form-item label="首页展示图">
          <swiper v-if="refresh"></swiper>
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
        <el-button type="primary" @click="addActivity">确 定</el-button>
      </span>
    </el-dialog>

    <!--    修改 对话框-->
    <el-dialog title="修改活动信息" :visible.sync="editDialog" width="70%" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="rules" ref="editFormRef">
        <el-form-item label="活动名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动地址" prop="location">
          <el-input v-model="editForm.location"></el-input>
        </el-form-item>
        <el-form-item label="宣传语" prop="slogan">
          <el-input v-model="editForm.slogan"></el-input>
        </el-form-item>

        <el-form-item label="名片">
          <postcard v-if="refresh"></postcard>
        </el-form-item>
        <el-form-item label="首页展示图">
          <swiper v-if="refresh"></swiper>
        </el-form-item>
        <el-form-item label="详情页轮播图">
          <intro-imgs v-if="refresh"></intro-imgs>
        </el-form-item>
        <el-form-item>
          <rich-text v-if="refresh"></rich-text>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editActivity">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import axios from "axios"
  import IntroImgs from "./components/IntroImgs"
  import Postcard from "./components/Postcard"
  import Swiper from "./components/Swiper"
  import RichText from "./components/RichText";

  export default {
    components: {IntroImgs, Postcard, Swiper, RichText},
    created() {
      axios.defaults.baseURL="http://localhost:2021/mini/activity"
      this.getActivityList()
    },
    data() {
      return {
        username: '',
        activityList: [],

        addDialog: false,
        addForm: {
          name: '',
          slogan: '',
          username: this.username,
          location: '',
          // introImgs:this.$store.state.IntroImgs.introImgs, 不行，在vue实例创建后只会初始化一次
          introImgs: [],
          postcard: null,
          swiper: null,
          richText: null
        },
        refresh:true,

        editDialog: false,
        editForm: {
          id: '',
          name: '',
          slogan: '',
          username: '',
          location: '',
          // introImgs:this.$store.state.IntroImgs.introImgs, 不行，在vue实例创建后只会初始化一次
          introImgs: [],
          postcard: null,
          swiper: null,
          richText: null
        },

        //添加规则
        rules: {
          name: [
            {required: true, message: '请输入活动名', trigger: 'blur'},
            {max: 20, message: '字数请控制在20以内', trigger: 'blur'}
          ],
          location: [
            {required: true, message: '请输入活动地址', trigger: 'blur'},
            {max: 40, message: '字数请控制在40以内', trigger: 'blur'}
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
      async getActivityList() {
        this.queryParams.username = window.sessionStorage.getItem('username')
        await axios.get('/getByUsername', {
          params: this.queryParams
        })
          .then(res => {
            this.activityList = res.data.activityList
            this.total = res.data.total
          })
      },
      addActivity() {
        this.$refs.addActivityRef.validate(async valid=>{
          if (!valid || this.addForm.swiper==null || this.addForm.richText==null
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
            this.$refs.addActivityRef.resetFields()

            this.refresh=false
            this.$nextTick(() => {
              this.refresh = true
            })

            await this.getActivityList()
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
      editActivity(){
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
            await this.getActivityList()
          }
        })
      },
      async del(data){
        const res=await this.$confirm('此操作将永久删除该活动, 是否继续?', '警告', {
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
              this.getActivityList()
            }
          })
        }
      },

      //监听每页要显示的条目数的变化
      handleSizeChange(newSize) {
        this.queryParams.pageSize = newSize
        this.getActivityList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryParams.pageNum = newPage
        this.getActivityList()
      },
      //搜索
      search() {
        this.getActivityList()
      },
      //清空搜索框的同时重新加载表格
      clear() {
        this.queryParams.condition = ''
        this.getActivityList()
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
      '$store.state.Swiper.swiper'() {
        this.addForm.swiper = this.$store.state.Swiper.swiper
        this.editForm.swiper = this.$store.state.Swiper.swiper
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
