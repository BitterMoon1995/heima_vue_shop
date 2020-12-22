<template>
  <!--  必须要有根标签!!!-->
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>置顶管理</el-breadcrumb-item>
      <el-breadcrumb-item>线路</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片-->
    <el-card class="box-card">
      <!--      搜索与添加区-->
      <el-row :gutter="0">
        <!--        搜索框-->
        <el-col :span="5">
          <div>
            <!--            可清除输入框-->
            <el-input placeholder="请输入内容" v-model="queryParams.condition"
                      clearable @clear="clear" @keyup.enter.native="search">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-form>
        <!--      表格区-->
        <el-table :data="routeList" border>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="线路名" prop="name"></el-table-column>
          <el-table-column label="轮播图置顶">
            <template v-slot="data">
              <el-switch @change="handleChange(data.row)"
                         v-model="data.row.sliderTop"
                         active-color="#13ce66"
                         inactive-color="#DCE0E4">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="轮播图顺序">
            <template v-slot="data">
              <el-input style="width: 140px" v-model="data.row.sliderOrder"
                        oninput = "value=value.replace(/[^1-4.]+/g,'')" maxlength="1"
                        @blur="handleChange(data.row)" class="theshy">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="楼层图置顶">
            <template v-slot="data">
              <el-switch @change="handleChange(data.row)"
                         v-model="data.row.stickyTop"
                         active-color="#13ce66"
                         inactive-color="#DCE0E4">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="楼层图顺序">
            <template v-slot="data">
              <el-input style="width: 140px" v-model="data.row.stickyOrder"
                        oninput = "value=value.replace(/[^\d]/g,'')" maxlength="3"
                        @blur="handleChange(data.row)" class="theshy">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="页面路径(开发人员设置)">
            <template v-slot="data">
              <el-input style="width: 140px" v-model="data.row.url" maxlength="40"
                        @blur="handleChange(data.row)" class="rookie">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>


      <!--      分页导航区-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pageNum"
          :page-sizes="[10, 20, 35, 50]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="routeTotal">
          <!--          没有总条目数就无法正常分页，全部死妈-->
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {iAxios as axios} from "@/config/iAxios";

  export default {
    created() {
      this.getRouteList()
    },
    data() {
      return {
        routeList: [],
        routeTotal: 0,
        queryParams: {
          condition: '',
          pageNum: 1,
          pageSize: 10
        }
      }
    },
    methods: {
      async getRouteList() {
        await axios.get('/route/getSticky', {
          params: this.queryParams
        })
          .then(res => {
            let {stickyList, total} = res.data
            console.log(res)
            this.routeList = stickyList
            this.routeTotal = total
          })
      },
      async handleChange(changeItem) {
        let {data}=await axios.post('/route/change',changeItem)
        if (data.info.code===400){
          this.$message.error(data.info.msg)
          changeItem.stickyTop=false
          await axios.post('/route/change',changeItem)
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
    }

  }
</script>

<style scoped lang="less">
  .theshy{
    width: 70px!important;
  }
  .rookie{
    width: 300px!important;
  }
</style>
