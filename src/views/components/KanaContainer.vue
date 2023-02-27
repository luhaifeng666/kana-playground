<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-24 14:12:39
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2023-02-27 17:30:10
 * @Description: 
-->
<template>
  <div display="flex" w="full" flex="shrink-0" divide="x zinc-400 dashed">
    <div basis="1/2" pr="4">
      <p text="white right" mb="4" position="relative" v-html="leftTitle" class="container_title"></p>
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

<style scoped>
.container_title::after {
  content: '';
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 100%;
  background: #34d399;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-right: -1.28rem;
}
</style>