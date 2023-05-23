<!--
 * @Author: haifeng.lu haifeng.lu@ly.com
 * @Date: 2023-05-16 22:21:56
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2023-05-23 00:57:52
 * @Description: 结果弹窗
-->
<template>
  <Transition>
    <div class="fixed" w="full" h="full" bg="gray-900/80" v-if="visible">
      <div
        border="rounded-lg"
        bg="zinc-800"
        p="4"
        min-w="100"
        top="1/2"
        left="1/2"
        class="absolute transform -translate-y-1/2 -translate-x-1/2"
      >
        <div text="center white" class="flex" items="center" justify="between">
          <p>
            <ruby text="xl"
              >{{ title.text }}<rt>{{ title.kana }}</rt></ruby
            >
            <span text="sm" ml="2">{{ date }}</span>
          </p>
          <x-circle cursor="pointer" @click="handleClose"></x-circle>
        </div>

        <div text="green-400 center" mt="4">
          <file-edit :size="45" />
          <p text="sm gray-500" mt="1">你做的很棒！ 再接再励哟~</p>
        </div>

        <div bg="zinc-900" border="rounded" mt="8" mb="2" text="white middle">
          <p class="flex" justify="start" items="center" p="4">
            <check-circle :size="18" /> 完成单词数
            <span ml="2" text="green-400 right" flex="grow shrink basis-full">{{
              count
            }}</span>
          </p>
          <p class="flex" justify="start" items="center" p="4">
            <pie-chart :size="18" /> 正确率
            <span ml="2" text="green-400 right" flex="grow shrink basis-full"
              >{{ rightRate }}%</span
            >
          </p>
        </div>

        <div bg="zinc-900" border="rounded" mb="8" text="white middle">
          <p class="flex" justify="start" items="center" p="4">
            <alarm-clock :size="18" /> 总耗时
            <span ml="2" text="green-400 right" flex="grow shrink basis-full">{{
              time
            }}</span>
          </p>
        </div>

        <p
          w="100%"
          text="zinc-400 center"
          border="b-1 b-zinc-500 rounded"
          bg="zinc-700"
          p="2"
          cursor="pointer"
          hover="bg-green-400 text-white"
          @click="handleClose"
        >
          继续卷
        </p>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { ComputedRef } from "vue";
import dayjs from "dayjs";
import {
  XCircle,
  CheckCircle,
  AlarmClock,
  FileEdit,
  PieChart,
} from "lucide-vue-next";
import { WEEK_NAMES } from "@/constants";
import type { Week } from "@/types";

const props = defineProps({
  count: Number,
  rightRate: String,
  time: String,
  visible: Boolean,
});

const emits = defineEmits(["update:visible"]);

const date: ComputedRef<string> = computed(() => dayjs().format("MM/DD"));
const title: ComputedRef<Week> = computed(
  () => WEEK_NAMES[new Date().getDay()]
);

const handleClose = () => {
  emits("update:visible");
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
