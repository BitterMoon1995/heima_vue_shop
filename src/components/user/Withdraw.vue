<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员提现管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片-->
    <el-card>
      <!--      搜索-->
      <el-row :gutter="0">
        <el-col :span="5">
          <div>
            <el-input placeholder="请输入内容" v-model="wxId" clearable @clear="clear">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!--      表格-->
      <el-table :data="withdrawList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="微信号" prop="wechatId"></el-table-column>
        <el-table-column label="金额" prop="amount"></el-table-column>
        <el-table-column label="申请时间" prop="createTime"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-tooltip content="开始处理" placement="top" :enterable='false'>
              <el-button type="primary" icon="el-icon-edit" circle @click="handle(data.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="已支付" placement="top" :enterable='false'>
              <el-button type="success" icon="el-icon-check" circle @click="complete(data.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页-->
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
  </div>
</template>

<script>
  import {iAxios as axios} from "../../config/iAxios";
  export default {
    created() {
      this.getList()
    },
    data() {
      return {
        total: 0,
        wxId: '',
        queryParams: {
          pageNum: 1,
          pageSize: 5,
          //索引0处，为微信号；1处，为提现状态类型
          conditions: []
        },
        withdrawList:[]
      }
    },
    methods: {
      async getList() {
        await axios.post('admin/withdraw/getList',this.queryParams)
        .then(res=>{
          let {list,total} = res.data
          this.withdrawList = list
          this.total = total
        })
      },
      search() {
        let arr = this.queryParams.conditions

        arr.splice(0,arr.length)
        arr.push(this.wxId)

        this.queryParams.conditions = arr
        this.getList()
      },
      //清空搜索框
      clear() {
        this.queryParams.conditions.splice(0,this.queryParams.conditions.length)
        this.getList()
      },

      //改变状态
      change(data){
        axios.post(
          "admin/withdraw/change",data
        )
      },
      handle(data){
        console.log(data)
        data.state = '处理中'
        this.change(data)
      },
      complete(data){
        console.log(data)
        data.state = '已处理'
        this.change(data)
      },
      //监听每页要显示的条目数的变化
      handleSizeChange(newSize) {
        this.queryParams.pageSize = newSize
        this.getList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryParams.pageNum = newPage
        this.getList()
      },
    }
  }
</script>

<style scoped>

</style>
