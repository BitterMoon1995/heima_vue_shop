<template>
  <!--  必须要有根标签!!!-->
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片-->
    <el-card class="box-card">
      <!--      搜索与添加区-->
      <el-row :gutter="0">
        <!--        搜索框-->
        <el-col :span="5">
          <div>
            <!--            可清除输入框-->
            <el-input placeholder="请输入内容" v-model="username" clearable @clear="clear">
              <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
            </el-input>
          </div>
        </el-col>
        <!--        添加按钮-->
        <el-col :span="4" style="margin-left: 100px">
          <el-button type="primary" @click="dialogVisible=true">添加用戶</el-button>
        </el-col>
      </el-row>
      <!--      表格区-->
      <el-table :data="userList" border>
        <!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="公司" prop="company"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <!--        bool值处理-->
        <el-table-column label="激活">
          <!--        通过作用域插槽得到本行的数据-->
          <template v-slot="data">
            <!--            {{Object.keys(data)}}-->
            <el-switch @change="handleSwitch(data.row)"
                       v-model="data.row.activated"
                       active-color="#13ce66"
                       inactive-color="#DCE0E4">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="data">
            <el-tooltip effect="dark" content="编辑用户" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(data.row)" ></el-button>
            </el-tooltip>
            <!--            <el-tooltip effect="dark" content="修改权限" placement="top" :enterable="false">-->
            <!--              <el-button type="warning" icon="el-icon-setting" circle></el-button>-->
            <!--            </el-tooltip>-->
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="delUser(data.row.id)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页导航区-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pageNum"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
          <!--          没有总条目数就无法正常分页，全部死妈-->
        </el-pagination>
      </div>
    </el-card>
    <!--    添加用户对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%" @close="addDialogClose">
      <!--      内容主体区-->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="addForm.company"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <!--          placeholder只有在所绑定的数据为空的、字符串时，才会生效-->
          <!--          所以被迫把表单模型的role字段改为了空串，再在add方法中做后续的转换处理-->
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="客户" value='3'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--    修改用户对话框-->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="30%">
      <!--      内容主体区-->
      <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="editForm.company"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="客户" value='3'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    created() {
      this.resetOrder()
      this.getUserList()
    },
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 5,
          condition: ''
        },
        userList: [],
        showList: [],
        userCount: 0,
        total: 0,
        username: '',
        dialogVisible: false,
        editDialogVisible: false,
        //添加用户表单数据
        addForm:{
          username:'',
          password:'',
          role:'',
          phone:'',
          email:'',
          company:'',
          activated:true
        },
        //添加规则
        addRules:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入电子邮箱', trigger: 'blur' }
          ],
          company: [
            { required: true, message: '请输入公司名', trigger: 'blur' }
          ]
        },
        //修改用户数据模型
        editForm:{
          username:'',
          password:'',
          role:0,
          phone:'',
          email:'',
          company:'',
          activated:true
        }
      }
    },
    methods: {
      async getUserList() {
        //分页查询所有用户
        await this.axios.get('http://localhost:2020/evenstar/user/getClients', {
          params: this.queryParams
        })
        .then(result => {
          let {userList, total} = result.data

          userList.forEach(function (item) {
            if (item.role === 1) item.role = '超级管理员'
            if (item.role === 2) item.role = '管理员'
            if (item.role === 3) item.role = '客户'
          })

          this.userList = userList
          this.total = total

        })
      },
      //打开页面、增删改后，都要通过神之操作重置表的顺序，永远滴神！！！
      resetOrder(){
        this.axios.get('http://localhost:2020/evenstar/user/resetOrder')
      },
      //监听每页要显示的条目数的变化
      handleSizeChange(newSize) {
        this.queryParams.pageSize = newSize
        this.getUserList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryParams.pageNum = newPage
        this.getUserList()
      },
      //监听switch开关变化
      handleSwitch(currentData) {
        this.axios.post('http://localhost:2020/evenstar/user/update', currentData)
      },
      //搜索
      searchUser() {
        this.queryParams.condition = this.username
        this.getUserList()
      },
      //清空搜索框的同时重新加载表格
      clear() {
        this.queryParams.condition = ''
        this.getUserList()
      },
      //监听添加对话框的关闭
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      addUser() {
        this.$refs.addFormRef.validate(async valid=> {
          //先校验
          if (valid===false) {
            this.$message.error('请检查输入信息！')
            return
          }
          //校验通过发请求
          if (this.addForm.role === '超级管理员') this.addForm.role = 1
          if (this.addForm.role === '管理员') this.addForm.role = 2
          if (this.addForm.role === '客户') this.addForm.role = 3
          const {data}=await this.axios.post('http://localhost:2020/evenstar/user/add',this.addForm)
          //后端校验用户名，存在则失败，弹出消息
          if (data.info.code===400) {
            this.$message.error(data.info.msg)
            return
          }
          //成功
          if (data.info.code===200) {
            this.$message.success(data.info.msg)
            //弹出消息后，隐藏对话框
            this.dialogVisible=false
            //重新排序并刷新用户列表
            this.resetOrder()
            await this.getUserList()
          }
        })

      },
      editUser() {
        let validResult
        this.$refs.editFormRef.validate(async valid=> {
          //先校验
          validResult = valid
          if (validResult===false) return
          //校验通过发请求
          const {data}=await this.axios.post('http://localhost:2020/evenstar/user/update',this.editForm)
          //弹出成功消息
          this.$message.success('修改用户成功！')
          //隐藏对话框
          this.editDialogVisible=false
          //重新排序并刷新用户列表
          this.resetOrder()
          await this.getUserList()
        })

      },
      //展示编辑用户的对话框
      showEditDialog(raw){
        this.editDialogVisible=true
        this.editForm=raw
      },
      async delUser(id){
        const res=await this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
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
        else {
          await this.axios.delete('/user/delOne', {
            params: {id: id}
          }).then(res=>{
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.resetOrder()
              this.getUserList()
            }
          })
        }
      }
    }

  }
</script>

<style scoped lang="less">
  .el-input {
    width: 420px;
  }
</style>
