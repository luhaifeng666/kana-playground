<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-21 11:21:46
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-23 17:23:29
 * @Description: 
-->
<template>
  <!-- 进度条 -->
  <div class="text-white" v-if="processVisible">
    <div w="40" mb="1" position="relative" class="p_progress">
      <div bg="green-400" h="2" position="absolute" top="-0.5" left="0" border="rounded" :style="processWidth"></div>
    </div>
    <p text="center">
      <span text="green-400">{{ currentIndex + 1 }}</span><span mx="1">/</span><span>{{ count }}</span>
    </p>
  </div>

  <!-- 题目 -->
  <div class="flex-center" flex="col">
    <p class="text-white text-4xl">{{ currentQuestion }}</p>
    <!-- 输入框 -->
    <div class="my-4 flex-center">
      <!-- 上一个 -->
      <div class="switch-btn hover:(text-green-400 -translate-x-1)" v-if="processVisible">
        <ChevronLeft :size="40"/>
      </div>

      <div class="w-18">
        <input
          v-model="firstAnswer"
          maxlength="3"
          type="text"
          autofocus
          ref="firstAnswerInput"
          :class="['signle-inputbox', !!firstAnswer ? `text_${firstIsRight ? 'right' : 'error'}` : '', firstShake ? 'shake' : '']"
        />
        <p text="xs zinc-400 center" select="none">{{ inputLabel(0) }}</p>
      </div>

      <div class="w-18 ml-4" v-if="secondInputVisible">
        <input
          v-model="secondAnswer"
          maxlength="3"
          type="text"
          ref="secondAnswerInput"
          :class="['signle-inputbox', !!secondAnswer ? `text_${secondIsRight ? 'right' : 'error'}` : '', secondShake ? 'shake' : '']"
        />
        <p text="xs zinc-400 center" select="none">{{ inputLabel(1) }}</p>
      </div>

      <!-- 下一个 -->
      <div class="switch-btn hover:(text-green-400 translate-x-1)" v-if="processVisible" @click="handleNext">
        <ChevronRight :size="40"/>
      </div>
    </div>
    
    <p text="white" select="none">
      请写出如题所示
      <strong text="green-400" cursor="pointer" @click="handleTypeSwitch('question')">{{ PATTERN[qTIndex].name }}</strong>
      相对应的
      <strong text="green-400" cursor="pointer" @click="handleTypeSwitch('answer')">{{ aTypes[aTIndex].name }}</strong>
    </p>
    <p text="zinc-500 xs" mt="2" mb="6">
      Tips: 可通过按下键盘的 <span border="rounded" p="1" bg="zinc-900" text="xs green-400">Enter</span> 键切换下一个；点击上述内容中的 <strong text="green-400">绿色字体</strong> 可以切换练习模式哦~
    </p>
    
    <template v-if="!processVisible">
      <div class="flex-center flex-col cursor-pointer" @click="handleNext">
        <span text="zinc-400 xs" border="b-1 b-zinc-500 rounded-sm" mb="2" bg="zinc-700" p="1">ENTER</span>
        <p class="flex-center" text="xl white center" hover="text-green-400" select="none">下一个 <ArrowRight class="ml-2" /></p>
      </div>
    </template>
  </div>
</template>

handleQTSwitch<script lang="ts" setup>
import { computed, ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import type { Ref } from 'vue'
import type { Kana } from '@/constants'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next'
import { KANA, DULL, AO, AO_DULL, PATTERN } from '@/constants'

onBeforeMount(() => {
  // 初始化 currentIndex 的值
  if (!processVisible.value) {
    currentIndex.value = getRandomNum(kanas.length)
  }
  // 添加键盘监听事件
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  // 卸载监听事件
  document.removeEventListener('keydown', handleKeyDown)
})

// 定义抽取的个数
const count:Ref<number> = ref(0)
// 所有的假名
const kanas = [...KANA, ...DULL, ...AO, ...AO_DULL]
// 当前是第几个
const currentIndex: Ref<number> = ref(0)
// 是否点击
// 第一个答案
const firstAnswer: Ref<string> = ref('')
const firstAnswerInput: Ref<HTMLInputElement | null> = ref(null)
// 第二个答案
const secondAnswer: Ref<string> = ref('')
const secondAnswerInput: Ref<HTMLInputElement | null> = ref(null)
// shake
const firstShake = ref(false)
const secondShake = ref(false)
// 题目类型索引
const qTIndex = ref(0)
// 答案类型索引
const aTIndex = ref(0)
// TODO: 计时
const startTime = dayjs()
/**
 * TODO 模式设定 设置当前模式
 * havefun 练习模式
 * challenge 挑战模式
 */
const mode: Ref<string> = ref('havefun')

// 随机抽取
const randomKanas = computed(() => {
  if (count.value) {
    const map = new Map()
    let i = 0
    while ( i < count.value ) {
      const indexNum = getRandomNum(count.value)
      if (!map.has(indexNum)) {
        map.set(indexNum, indexNum)
        i++
      }
    }
    return Array.from(new Set(map)).map(keys => kanas[keys[0]])
  }
  return []
})
// 计算进度条的宽度
const processWidth = computed(() => ({
  width: `${(currentIndex.value + 1) / count.value * 100}%`
}))
// 是否显示进度条
const processVisible = computed(() => mode.value !== 'havefun')
// 当前显示的假名题目
const currentKana = computed(() => (processVisible.value ? randomKanas.value : kanas)[currentIndex.value])
// 验证答案是否正确
const isFix = computed(() => currentAType.value.type.includes('/'))
const firstIsRight = computed(() => validation(firstAnswer.value))
const secondIsRight = computed(() => validation(secondAnswer.value, 1))
const answerValidation = computed(() => !isFix.value ? firstIsRight.value : firstIsRight.value && secondIsRight.value)
// 答案类型
const aTypes = computed(() => {
  const types = PATTERN.filter((p, index) => index !== qTIndex.value)
  return [...types, {
    type: `${types[0].type}/${types[1].type}`,
    name: `${types[0].name}/${types[1].name}`
  }]
})
// 当前题目类型
const currentQuestion = computed(() => currentKana.value[PATTERN[qTIndex.value].type as keyof Kana])
// 当前答案类型
const currentAType = computed(() => aTypes.value[aTIndex.value])
// 是否显示第二个输入框
const secondInputVisible = computed(() => isFix.value)
// 输入框label
const inputLabel = computed(() => (index: number) => currentAType.value.name.split('/')[index])

// 监听类型变化
watch([qTIndex, aTIndex], () => {
  // 清空输入框
  firstAnswer.value = secondAnswer.value = ''
})

// 下一个
const handleNext = () => {
  // 校验
  if (answerValidation.value) {
    // 清空输入框
    firstAnswer.value = secondAnswer.value = ''
    // 第一个输入框focus
    firstAnswerInput.value && firstAnswerInput.value.focus()
    currentIndex.value = processVisible.value ? currentIndex.value + 1 : getRandomNum(kanas.length)
  } else {
    firstShake.value = !firstIsRight.value
    secondShake.value = !secondIsRight.value
    const timer = setTimeout(() => {
      firstShake.value = secondShake.value = false
      clearTimeout(timer)
    }, 300)
  }
}
// 获取随机数
const getRandomNum = (baseNum: number): number => Math.ceil(Math.random() * baseNum)
// 监听 enter 按键事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e && e.keyCode === 13) handleNext()
}
// 切换题目类型
const handleTypeSwitch = (type: 'question' | 'answer') => {
  const indexRef = type === 'question' ? qTIndex : aTIndex
  indexRef.value = indexRef.value > 1 ? 0 : indexRef.value + 1
}
// 答案校验
const validation = (val: string, typeIndex = 0) => {
  let _val = val || ''
  const type = currentAType.value.type.split('/')[typeIndex]
  const targetVal = currentKana.value[type as keyof Kana]
  if (type === 'roma') {
    _val = _val.toLowerCase()
    return typeof(targetVal) === 'string' ? _val === targetVal : targetVal.includes(_val)
  }
  return targetVal === _val
}
</script>

<!-- TODO 样式合并 -->
<style scoped>
.p_progress::before {
  content: '';
  display: block;
  width: 100%;
  height: 4px;
  background: #3F3F46;
  border-radius: 2px;
}
</style>