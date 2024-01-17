<template>
  <div :class="bar_chart" :style="{height: bar_height, width: bar_width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/vintage') // echarts theme
const TAG = '=====sea======>'

export default {
  props: { // 必须是键值对
    bar_chart: {
      type: String,
      default: 'chart'
    },
    bar_height: {
      type: String,
      default: '300px'
    },
    bar_width: {
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
      this.chart = echarts.init(this.$el, 'vintage');

      this.chart.setOption({
        title: {
          text: '近一周发文数量统计'
        },
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      })
    }
  }
}
</script>


