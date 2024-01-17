<template>
  <div :class="pie_chart" :style="{height: pie_height, width: pie_width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/sakura') // echarts theme
const TAG = '=====sea======>'

export default {
  props: { // 必须是键值对
    pie_chart: {
      type: String,
      default: 'chart'
    },
    pie_height: {
      type: String,
      default: '300px'
    },
    pie_width: {
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
      this.chart = echarts.init(this.$el, 'sakura');

      this.chart.setOption({
        title: {
          text: '文章分类占比统计',
          left: 'left'
        },
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            pieWidth: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>


