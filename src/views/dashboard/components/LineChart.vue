<template>
  <div :class="line_chart" :style="{height: line_height, width: line_width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/azul') // echarts theme
const TAG = '=====sea======>'

export default {
  props: { // 必须是键值对
    line_chart: {
      type: String,
      default: 'chart'
    },
    line_height: {
      type: String,
      default: '300px'
    },
    line_width: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    console.log(TAG + " mounted() ");
    // 使用 requestAnimationFrame
    requestAnimationFrame(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    console.log(TAG + " beforeDestroy() ");
    if(!this.chart){
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      console.log(TAG + " initChart() ");
      this.chart = echarts.init(this.$el, 'azul');

      this.chart.setOption({
        title: {
          text: '近一周的访问量'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      })
    }
  }
}
</script>


