<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2023-02-21 20:00:32
 * @Description: 
-->
<template>
  <main class="text-center text-white">
    <p class="text-4xl mb-4">
      <span :class="[...CARD_CLASSNAMES, 'mr-4']">カ</span><span :class="[...CARD_CLASSNAMES, 'text-green-400']">ナ</span>
    </p>
    <p>一个练习<span class="text-green-400 font-bold mx-1">平假名/片假名/罗马音</span>的地儿</p>
  </main>
</template>

<script setup lang="ts">
const CARD_CLASSNAMES = ['w-18', 'h-18', 'inline-flex', 'items-center', 'justify-center', 'bg-zinc-900', 'rounded-lg', 'border-b-3', 'border-b-zinc-700']
</script>
