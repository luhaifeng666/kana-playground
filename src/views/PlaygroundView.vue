<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-21 11:21:46
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-22 20:06:34
 * @Description: 
-->
<template>
  <!-- 进度条 -->
  <div class="text-white" v-if="processVisible">
    <div class="w-40 relative mb-1 p_progress">
      <div class="bg-green-400 h-2 absolute -top-0.5 left-0 rounded" :style="processWidth"></div>
    </div>
    <p class="text-center">
      <span class="text-green-400">{{ currentIndex + 1 }}</span><span class="mx-1">/</span><span>{{ count }}</span>
    </p>
  </div>

  <!-- 题目 -->
  <div class="flex items-center justify-center flex-col">
    <p class="text-white text-4xl">{{ currentKana.lowerCase }}</p>
    <!-- 输入框 -->
    <div class="my-4 flex items-center justify-center">
      <div class="w-30 -mt-4 text-center text-white hover:text-green-400 cursor-pointer transform transition hover:-translate-x-1" v-if="processVisible">
        <ChevronLeft :size="40"/>
      </div>

      <div class="w-18 mr-4">
        <input
          v-model="firstAnswer"
          maxlength="3"
          type="text"
          autofocus
          ref="firstAnswerInput"
          lang="fr"
          class="w-full h-18 rounded-lg bg-zinc-900 outline-none text-center text-white text-xl mb-2 border-b-3 border-b-zinc-700"
          :class="`${!!firstAnswer && `text_${firstIsRight ? 'right' : 'error'}`} ${ firstShake ? 'shake' : '' }`"
        />
        <p class="text-xs text-zinc-400 text-center select-none">片假名</p>
      </div>

      <div class="w-18">
        <input
          v-model="secondAnswer"
          maxlength="3"
          type="text"
          class="w-full h-18 rounded-lg bg-zinc-900 outline-none text-center text-white text-xl mb-2 border-b-3 border-b-zinc-700"
          :class="`${!!secondAnswer && `text_${secondIsRight ? 'right' : 'error'}`} ${ secondShake ? 'shake' : '' }`"
        />
        <p class="text-xs text-zinc-400 text-center select-none">罗马音</p>
      </div>

      <div class="w-30 -mt-4 text-center text-white hover:text-green-400 cursor-pointer transform transition hover:translate-x-1" v-if="processVisible" @click="handleNext">
        <ChevronRight :size="40"/>
      </div>
    </div>
    <p class="text-white select-none">请写出题目相对应的 <strong class="text-green-400">假名/罗马音</strong></p>
    <p class="text-zinc-500 text-xs mt-2 mb-6">Tips: 可通过按下键盘的 <span class="rounded p-1 bg-zinc-900 text-green-400 text-xs">Enter</span> 键切换下一个</p>
    
    <template v-if="!processVisible">
      <div class="flex items-center justify-center flex-col cursor-pointer" @click="handleNext">
        <span class="text-zinc-400 text-xs mb-2 border-b-1 border-b-zinc-500 bg-zinc-700 p-1 rounded-sm">ENTER</span>
        <p class="text-xl text-white text-center select-none flex items-center justify-center hover:text-green-400">下一个 <ArrowRight class="ml-2" /></p>
      </div>
    </template>
  </div>

  <!-- 前后选择 -->
  <!-- <div class="w-full flex justify-between items-center">
    <button v-show="!!currentIndex" class="text-zinc-400 text-sm mb-2 border-b-3 border-b-zinc-500 bg-zinc-700 px-4 py-1 rounded-sm hover:bg-green-400 hover:text-white transition cursor-pointer transform hover:scale-100 hover:-translate-y-1">上一个</button>
    <button v-show="currentIndex < randomKanas.length - 1" @click="handleNext" class="text-zinc-400 text-sm mb-2 border-b-3 border-b-zinc-500 bg-zinc-700 px-4 py-1 rounded-sm hover:bg-green-400 hover:text-white transition cursor-pointer transform hover:scale-100 hover:-translate-y-1">下一个</button>
  </div> -->
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next'
import { KANA, DULL, AO, AO_DULL } from '@/constants'

onBeforeMount(() => {
  //  初始化 currentIndex 的值
  if (!processVisible.value) {
    currentIndex.value = getRandomNum(kanas.length)
  }
  // 添加键盘监听事件
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  //  卸载监听事件
  document.removeEventListener('keydown', handleKeyDown)
})

//  定义抽取的个数
const count:Ref<number> = ref(0)
//  所有的假名
const kanas = [...KANA, ...DULL, ...AO, ...AO_DULL]
//  当前是第几个
const currentIndex: Ref<number> = ref(0)
//  是否点击
//  第一个答案
const firstAnswer: Ref<string> = ref('')
const firstAnswerInput: Ref<HTMLInputElement | null> = ref(null)
//  第二个答案
const secondAnswer: Ref<string> = ref('')
//  shake
const firstShake = ref(false)
const secondShake = ref(false)
//  TODO: 计时
const startTime = dayjs()
/**
 * TODO 模式设定 设置当前模式
 * havefun 练习模式
 * challenge 挑战模式
 */
const mode: Ref<string> = ref('havefun')

//  随机抽取
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
//  当前显示的假名题目
const currentKana = computed(() => (processVisible.value ? randomKanas.value : kanas)[currentIndex.value])
//  验证答案是否正确
const firstIsRight = computed(() => {
  const { upperCase } = currentKana.value
  return firstAnswer.value === upperCase
})
const secondIsRight = computed(() => {
  const { roma } = currentKana.value
  const answer = secondAnswer.value.toLowerCase()
  return typeof(roma) === 'string' ? answer === roma : roma.includes(answer)
})
const answerValidation = computed(() => firstIsRight.value && secondIsRight.value)

//  下一个
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
</script>

<!-- TODO 改成windi的形式 -->
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