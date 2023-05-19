<!--
 * @Author: haifeng.lu haifeng.lu@ly.com
 * @Date: 2023-02-27 17:32:54
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2023-02-27 17:53:42
 * @Description: 
-->
<template>
  <div
    border="rounded"
    bg="zinc-900"
    display="flex"
    items="center"
    justify="center"
    w="12"
    h="12"
    text="white sm"
    position="fixed"
    right="10"
    bottom="20"
    flex="col"
    cursor="pointer"
    hover:bg="green-400"
    select="none"
    @click="handleScrollTop"
  >
    <ChevronUp :size="15" />TOP
  </div>
</template>

<script lang="ts" setup>
import { ChevronUp } from "lucide-vue-next";
const emits = defineEmits(["scroll"]);

const handleScrollTop = () => {
  emits("scroll");
};
</script>
