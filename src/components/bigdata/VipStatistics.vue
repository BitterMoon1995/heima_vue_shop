<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>大数据</el-breadcrumb-item>
      <el-breadcrumb-item>会员统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
<!--      标签页-->
      <el-tabs v-model="activeName">
<!--        把内容直接放在每个窗口里面，就可以动态切换显示，无需再v-if、@tab-click...像个小丑-->
        <el-tab-pane label="人数趋势" name="first">
          <QuantityTrend></QuantityTrend>
        </el-tab-pane>
        <el-tab-pane label="年龄分布" name="second">
          <AgeDistribution></AgeDistribution>
        </el-tab-pane>
        <el-tab-pane label="地区分布" name="third"></el-tab-pane>
        <el-tab-pane label="性别分布" name="fourth"></el-tab-pane>
      </el-tabs>


    </el-card>

  </div>
</template>

<script>
  //默认导出、默认导入
  import AgeDistribution from "./components/AgeDistribution";//年龄分布
  import QuantityTrend from "./components/QuantityTrend";//数量趋势

  export default {
    //注册组件
    components: {AgeDistribution, QuantityTrend},

    data() {
      return {
        activeName: 'first',
      }
    },
    methods: {

    }

  }
</script>

<style scoped lang="less">
  .el-tab-pane{
    display: flex;
    justify-content: center;
  }
</style>
