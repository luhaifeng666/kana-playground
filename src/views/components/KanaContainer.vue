<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-24 14:12:39
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-27 14:05:43
 * @Description: 
-->
<template>
  <div display="flex" w="full" flex="shrink-0" mb="8">
    <div basis="1/2" pr="4">
      <p text="white right" mb="4" v-html="leftTitle"></p>
      <slot></slot>
    </div>
    <div basis="1/2" pl="4">
      <p text="white" mb="4" v-if="rightTitle">{{ rightTitle }}</p>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  leftTitle: { type: String, default: '' },
  rightTitle: { type: String, default: '' }
})
</script>