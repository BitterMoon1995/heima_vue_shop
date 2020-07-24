<template>
  <div>
      <!-- 冷知识：一个元素只能拥有一个唯一的ID属性，
      一个ID值在一个HTML文档中只能出现一次，也就是一个ID只能唯一标识一个元素
      (不是一类元素，而是一个元素)。 -->
      <div id="main1" style="width: 900px;height:700px;"></div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.show()
    },
    methods: {
      show() {
        let echarts = this.$echarts
        let myChart = echarts.init(document.getElementById('main1'))

        let option = {
          legend: {
            data: ['会员人数变化趋势']
          },
          //xAxis，配置x轴数据、样式、名称
          xAxis: {
            type: 'category',   // 还有其他的type，可以去官网喵两眼哦
            data: ['一月', '二月', '三月', '四月', '五月', '六月'],   // x轴数据
            name: '月份',   // x轴名称
            // x轴名称样式
            nameTextStyle: {
              fontWeight: 600,
              fontSize: 18
            }
          },
          //yAxis，配置y轴名称，样式
          yAxis: {
            type: 'value',
            name: '会员总数',   // y轴名称
            // y轴名称样式
            nameTextStyle: {
              fontWeight: 600,
              fontSize: 18
            }
          },
          label: {},
          //tooltip，鼠标放到折线图上展示的数据展示样式
          tooltip: {
            trigger: 'axis'   // axis   item   none三个值
          },
          //series，y轴数据，每条折线的名称
          series: [
            {
              name: '人数',
              data: [820, 932, 901, 934, 1290, 1330],
              type: 'line'
            }
          ]
        }
        myChart.setOption(option)
      }
    }
  }
</script>

<style scoped>

</style>
