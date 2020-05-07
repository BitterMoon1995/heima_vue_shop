<template>
  <!--  必须要有根标签!!!-->
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片-->
    <el-card class="box-card">
      <!--      搜索与添加区-->
      <el-row :gutter="20">
        <!--        搜索框-->
        <el-col :span="6">
          <div>
<!--            可清除输入框-->
            <el-input placeholder="请输入内容" v-model="username" clearable @clear="clear">
              <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
            </el-input>
          </div>
        </el-col>
        <!--        添加按钮-->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用戶</el-button>
        </el-col>
      </el-row>
      <!--      表格区-->
      <el-table :data="userList" border>
        <!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
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
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
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
    <!--    添加layout对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%">
<!--      内容主体区-->
      <el-form>

      </el-form>
<!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created() {
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
        dialogVisible:false
      }
    },
    methods: {
      async getUserList() {
        //分页查询所有用户
        await this.axios.get('/user/getAll', {
          params: this.queryParams
        })
          .then(result => {
            console.log(result)
            let {userList,total} = result.data

            userList.forEach(function (item) {
              if (item.role === 'admin') item.role = '超级管理员'
              if (item.role === 'manager') item.role = '管理员'
              if (item.role === 'client') item.role = '客户'
            })

            this.userList = userList
            this.total = total

          })
      },
      //监听每页要显示的条目数的变化
      handleSizeChange(newSize){
        console.log(newSize)
        this.queryParams.pageSize=newSize
        this.getUserList()
      },
      //监听页码值改变
      handleCurrentChange(newPage){
        console.log(newPage)
        this.queryParams.pageNum=newPage
        this.getUserList()
      },
      //监听switch开关变化
      handleSwitch(currentData){
        this.axios.post('/user/update',currentData)
      },
      //搜索
      searchUser(){
        this.queryParams.condition=this.username
        this.getUserList()
      },
      //清空搜索框的同时重新加载表格
      clear(){
        this.queryParams.condition=''
        this.getUserList()
      }
    }

  }
</script>

<style scoped lang="less">

</style>
