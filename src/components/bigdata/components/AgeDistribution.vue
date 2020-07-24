<template>
  <div>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 900px;height:700px;"></div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.show()
    },
    methods: {
      show() {
        // 从原型引入
        let echarts = this.$echarts;
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        let option = {
          title: {
            text: '会员年龄段统计'
          },
          tooltip: {},
          legend: {
            data: ['人数']
          },
          xAxis: {
            data: ["12~18", "19~25", "26~35", "36~55", "56~85"]
          },
          yAxis: {},
          series: [{
            name: '人数',
            type: 'bar',
            data: [5, 20, 36, 10, 10]
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>
