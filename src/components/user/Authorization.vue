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
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <!--        添加按钮-->
        <el-col :span="4">
          <el-button type="primary">添加用戶</el-button>
        </el-col>
      </el-row>
      <!--      表格区-->
      <el-table :data="showList" border>
        <!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <!--        bool值处理-->
        <el-table-column label="状态">
          <!--        通过作用域插槽得到本行的数据-->
          <template v-slot="data">
            <!--            {{Object.keys(data)}}-->
            <el-switch
              v-model="data.row.state"
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
          :page-sizes="[5, 10, 20]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userCount">
        </el-pagination>
      </div>
    </el-card>
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
          pageSize: 5
        },
        userList: [],
        showList: [],
        userCount: 0
      }
    },
    methods: {
      getUserList() {
        //分页查询所有用户
        this.axios.get('/user/getAll', {
          params: this.queryParams
        })
          .then(result => {
            let {data} = result
            this.userList = data

            data.forEach(function (item) {
              if (item.role === 'admin') item.role = '超级管理员'
              if (item.role === 'manager') item.role = '管理员'
              if (item.role === 'client') item.role = '客户'
            })

            this.showList = data
            this.userCount = data.length
          })
      },
      //监听每页要显示的条目数的变化
      handleSizeChange(newSize){
        this.queryParams.pageSize=newSize
        this.getUserList()
      },
      //监听页码值改变
      handleCurrentChange(newPage){
        console.log(newPage)
      }
    }

  }
</script>

<style scoped lang="less">

</style>
