<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-21 11:21:46
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2023-02-21 20:03:24
 * @Description: 
-->
<template>
  <!-- 进度条 -->
  <div class="text-white">
    <div class="w-40 relative mb-1 p_progress">
      <div :class="`bg-green-400 h-2 absolute -top-0.5 left-0 rounded w-${currentIndex + 1}/${count}`"></div>
    </div>
    <p class="text-center">
      <span class="text-green-400">{{ currentIndex + 1 }}</span><span class="mx-1">/</span><span>{{ count }}</span>
    </p>
  </div>
  <!-- 题目 -->
  <div class="flex items-center justify-center flex-col">
    <p class="text-white text-4xl">{{ randomKanas[currentIndex].lowerCase }}</p>
    <!-- 输入框 -->
    <div class="my-4 flex items-center justify-center">
      <div class="w-18 mr-4">
        <input maxlength="3" type="text" class="w-full h-18 rounded-lg bg-zinc-900 outline-none text-center text-white text-xl mb-2 border-b-3 border-b-zinc-700" />
        <p class="text-xs text-zinc-400 text-center">片假名</p>
      </div>
      <div class="w-18">
        <input maxlength="3" type="text" class="w-full h-18 rounded-lg bg-zinc-900 outline-none text-center text-white text-xl mb-2 border-b-3 border-b-zinc-700" />
        <p class="text-xs text-zinc-400 text-center">罗马音</p>
      </div>
    </div>
    <p class="text-white mb-4">请写出题目相对应的 <strong class="text-green-400">假名/罗马音</strong></p>
  </div>
  <!-- 前后选择 -->
  <div class="w-full flex justify-between items-center">
    <button class="text-white text-sm mb-2 border-b-3 border-b-zinc-500 bg-zinc-700 px-4 py-1 rounded-sm">上一个</button>
    <button class="text-white text-sm mb-2 border-b-3 border-b-zinc-500 bg-zinc-700 px-4 py-1 rounded-sm">下一个</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import dayjs from 'dayjs'
import { KANA, DULL, AO, AO_DULL } from '@/constants'

console.table(KANA)
console.table(DULL)
console.table(AO)
console.table(AO_DULL)

//  定义抽取的个数
const count:Ref<number> = ref(10)
//  TODO: 计时
const startTime = dayjs()
//  所有的假名
const kanas = [...KANA, ...DULL, ...AO, ...AO_DULL]
//  当前是第几个
const currentIndex: Ref<number> = ref(0)
//  随机抽取
const randomKanas = computed(() => {
  // const kanaMap = new WeakMap()
  // const total = kanas.length
  // for (let i = 0; i < count.value; i++) {

  // }
  return kanas
})
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