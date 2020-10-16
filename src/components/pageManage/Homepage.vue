<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页页面</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addDialog=true">新增图片</el-button>
      <el-table :data="imgList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="图片名" prop="name" sortable width="300"></el-table-column>
        <el-table-column label="描述" prop="description" sortable></el-table-column>
        <el-table-column label="路径" prop="src"></el-table-column>
        <el-table-column label="操作" width="140">
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

    <el-dialog :visible.sync="addDialog" title="新增小程序页面图片">
      <el-form :model="addForm" ref="addRef">
<!--        prop属性使resetFields()方法可以正确清除-->
        <el-form-item label="图片描述" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="上传">
          <Postcard v-if="refresh"></Postcard>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addImg">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="editDialog">
      <el-form :model="editForm" ref="editRef">
        <el-form-item label="图片名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editImg">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import Postcard from "../project/components/Postcard";
  import axios from "axios"

  export default {
    created() {
      axios.defaults.baseURL='http://localhost:2020/admin/mini-img'
      this.getImgList()
    },
    components:{Postcard},
    data() {
      return {
        image:null,
        addDialog:false,
        addForm:{
          name:'',
          description:'',
          src:'',
        },
        editDialog:false,
        editForm:{
          name:'',
          description:'',
          src:'',
        },
        iconList:[],
        //成功提交后所有照片墙子组件强制刷新
        refresh:true,
        imgList:[],
        queryParams: {
          pageNum: 1,
          pageSize: 20,
        },
        total:0
      }
    },
    methods: {
      async getImgList() {
        await axios.get('/queryAll',{
          params : this.queryParams
        })
        .then(res => {
          this.total = res.data.total
          this.imgList = res.data.data
        })
      },

      addImg(){
        let src1 = this.image.src
        //把域名换成远程云服务器
        let temp = src1.split("//");
        this.addForm.src = temp[0] + '//localhost//' + temp[2]
        this.addForm.name = this.image.name
        //请求
        axios.post('/upload',this.addForm)
        .then(res=>{
          if (res.data.status.code===400) {
            this.$message.error('信息残缺')
          }
          else if (res.data.status.code===200) {
            //刷新上传框数据
            this.refresh=false
            this.$nextTick(() => {
              this.refresh = true
            })
            //弹出成功消息
            this.$message.success('成功上传！')
            //关闭添加框
            this.addDialog = false
            //清除表单
            this.$refs.addRef.resetFields()
            //刷新图片列表数据
            this.getImgList()
          }
        })
      },
      async editImg() {
        const {data} = await axios.post('/upload', this.editForm)
        if (data.status.code===400) {
          this.$message.error('信息残缺')
        }
        else if (data.status.code===200) {
          this.refresh=false
          this.$nextTick(() => {
            this.refresh = true
          })
          //关闭添加框
          this.editDialog = false
          //清除表单
          this.$refs.editRef.resetFields()
          //弹出成功消息
          this.$message.success('成功上传！')
          //刷新上传框数据
          this.refresh=false
          this.$nextTick(() => {
            this.refresh = true
          })
          //刷新图片列表数据
          await this.getImgList()
        }
      },
      async del(data){
        const res=await this.$confirm('此操作将永久删除该图片, 是否继续?', '警告', {
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
            if (res.data.status.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getImgList()
            }
            if (res.data.status.code === 520) {
              this.$message({
                type: 'error',
                message: '服务器开小差啦ε=(´ο｀*)))'
              })
            }
          })
        }
      },
      showEditDialog(data){
        this.editDialog=true
        this.editForm=data
      },
      //监听每页要显示的条目数的变化
      handleSizeChange(newSize) {
        this.queryParams.pageSize = newSize
        this.getImgList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryParams.pageNum = newPage
        this.getImgList()
      },
    },
    watch: {
      '$store.state.Postcard.postcard'() {
        this.image = this.$store.state.Postcard.postcard
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-button{
    margin-top: 10px;
  }
  .el-input {
    width: 620px;
  }
</style>
