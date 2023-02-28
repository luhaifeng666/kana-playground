<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-23 15:14:12
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2023-02-28 23:27:41
 * @Description: 
-->
<template>
  <div display="flex" text="white sm center">
    <template v-if="hasData">
      <div ref="pie" w="lg" h="sm"></div>
      <div ref="bar" w="lg" h="sm"></div>
    </template>

    <div v-else>
      <img src="https://user-images.githubusercontent.com/9375823/221803688-2559ab76-20d3-4469-b40e-a4da87343ff0.png" alt="empty" display="block" w="20" mx="auto" mb="2" />
      <p mb="1">{{ !hasData ? '暂无数据' : '' }}</p>
      <p text="center xs zinc-400">今天还没有练习哦~快去练习假名吧！</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, computed, ref } from 'vue'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, PieChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import { CHAR_COLORS } from '@/constants'
import type { RecordData, RecordDataItem } from '@/types'
import type { Ref } from 'vue'

onBeforeMount(() => {
  // 获取本地数据
  const recordData = localStorage.getItem('kanaRecord')
  localData.recordData = JSON.parse(recordData || '{}')
  // 注册必须的组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    PieChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
  ])
})

onMounted(() => {
  // 渲染图表
  renderPieChart()
  renderBarChart()
})

// 本地记录数据
const localData: { recordData: RecordData } = reactive({
  recordData: {}
})
// 饼图
const pie: Ref<HTMLElement|null> = ref(null)
// 柱状图
const bar: Ref<HTMLElement|null> = ref(null)

// 格式化本地数据
const renderData = computed(() => {
  const { recordData: { data = {} } = {} } = localData
  return Object.keys(data).map(key => data[key])
})
// 饼图数据
const pieData = computed(() => renderData.value.map((item: RecordDataItem) => ({
  name: item.lowerCase,
  value: item.rightTimes + item.errorTimes
})))
// 获取错误 top 10 数据
const topErrorData = computed(() => {
  return renderData.value.sort((pre, aft) => aft.errorTimes - pre.errorTimes).slice(0, 10)
})
// 是否有本地数据
const hasData = computed(() => renderData.value && !!renderData.value.length)

// 渲染饼图
const renderPieChart = () => {
  if (pie.value && hasData.value) {
    const pieChart = echarts.init(pie.value)
    pieChart.setOption({
      color: CHAR_COLORS,
      title: {
        text: '假名练习数量统计',
        left: 'center',
        subtext: '统计当天练习的所有假名次数',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
          fontSize: '14'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}次 (占{d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          data: pieData.value,
          top: 40,
          label: {
            position: 'outer',
            alignTo: 'edge',
            margin: 40
          },
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
// 渲染柱状图
const renderBarChart = () => {
  if (bar.value && hasData.value) {
    const barChart = echarts.init(bar.value)
    barChart.setOption({
      color: CHAR_COLORS,
      title: {
        text: '错误假名',
        left: 'center',
        subtext: '统计当天练习错误次数最多的前10个假名',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
          fontSize: '14'
        }
      },
      tooltip: {
        formatter: '{b0}:  错{c0}次'
      },
      grid: {
        right: 0
      },
      xAxis: {
        data: topErrorData.value.map(item => item.lowerCase)
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: topErrorData.value.map(item => item.errorTimes),
          itemStyle: {
            color: (param: any) => CHAR_COLORS.slice(4, 10)[param.dataIndex]
          }
        }
      ]
    })
  }
}
</script>