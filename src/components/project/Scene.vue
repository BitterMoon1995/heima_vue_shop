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
        <!--    插槽指的是写在父组件中，传递并填补子组件slot标签的内容
        作用域插槽就是在单个插槽和具名插槽的基础上，绑定子组件数据的插槽
        所以渲染结果就是父组件提供样式，子组件提供数据
        作用域插槽绑定子组件数据的具体方式是：
          子组件：在slot标签中自定义属性，属性名作为数据的索引，方便父组件检索；属性的值就是要传递的数据。

          父组件：带值的 v-slot 来定义我们提供的插槽 prop 的名字，这个名字可以是任意的，
          定义后名字是一个包含所有插槽 prop 的对象
          例如v-slot="data"，就可以通过data.【子组件中属性名】的形式获取子组件slot中所有自定义属性的数据-->
        <el-table-column label="操作">
          <!--HTML内容模板：<template>元素，是一种用于保存客户端内容机制，该内容在加载页面时不会呈现，
          但随后可以(原文为 may be)在运行时使用JavaScript实例化。
          将模板视为一个可存储在文档中以便后续使用的内容片段。
          虽然解析器在加载页面时确实会处理<template>元素的内容，但这样做只是为了确保这些内容有效；但元素内容不会被渲染。
          -->
          <template v-slot="data">
            <el-tooltip effect="dark" content="编辑景区信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(data.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除本景区" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="del(data.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看景区ID" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-info" circle @click="showID(data.row.id)"></el-button>
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
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="addForm.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="addForm.latitude"></el-input>
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
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="editForm.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="editForm.latitude"></el-input>
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
        <el-button type="primary" @click="editScene">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {iAxios as axios} from "../../config/iAxios"
  import IntroImgs from "./components/IntroImgs"
  import Postcard from "./components/Postcard"
  import Slider from "./components/Slider"
  import RichText from "./components/RichText";
  import imgSize from "../../utils/imgSize";
  import {transform} from "../../utils/imgSrc";

  export default {
    components: {IntroImgs, Postcard, Slider, RichText},
    created() {
      let username = window.sessionStorage.getItem('username')
      this.addForm.username = username
      this.editForm.username = username
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
          longitude: 0,
          latitude: 0,
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
          longitude: 0,
          latitude: 0,
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
          longitude: [
            {required: true, message: '务必输入正确经度', trigger: 'blur'},
          ],
          latitude: [
            {required: true, message: '务必输入正确纬度', trigger: 'blur'},
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
        await axios.get('mini/scene/getByUsername', {
          params: this.queryParams
        })
          .then(res => {
            this.sceneList = res.data.sceneList
            this.total = res.data.total
          })
      },
      addScene() {
        this.addForm = transform(this.addForm)
        console.log(this.addForm)

        this.$refs.addSceneRef.validate(async valid=>{
          if (!valid || this.addForm.slider==null || this.addForm.richText==null
          || this.addForm.postcard==null || this.addForm.introImgs==null
          || this.addForm.latitude===0 || this.addForm.longitude===0){
            this.$message.error('请检查录入信息！')
            return
          }
          this.addForm.username = window.sessionStorage.getItem('username')
          const {data}=await axios.post('mini/scene/add', this.addForm)
          console.log(data)
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
        this.editForm = transform(this.editForm)
        console.log(this.editForm)

        this.$refs.editFormRef.validate(async valid=>{
          if (!valid || this.editForm.latitude===0 || this.editForm.longitude===0){
            this.$message.error('请检查录入信息！')
            return
          }
          const {data}=await axios.post('mini/scene/add', this.editForm)
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
          axios.delete('mini/scene/del', {
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
      },
      //查看景区ID
      showID(id) {
        //MessageBox 弹框
        this.$alert(id, '本景区ID', {
          confirmButtonText: '确定',
          showConfirmButton: false,//是否显示确定按钮
          closeOnClickModal: true,//是否可通过点击遮罩关闭 MessageBox
          closeOnPressEscape: true,//是否可通过按下 ESC 键关闭 MessageBox
          // callback: action => {
          //   this.$message({
          //     type: 'success',
          //     // message: `已复制到剪切板o(*￣︶￣*)o: ${ action }`
          //   });
          // }
        });
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
