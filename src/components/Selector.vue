<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-05-15 16:48:30
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-05-16 11:43:04
 * @Description: 
-->
<template>
  <div
    text="green-400"
    border="b-1 b-zinc-500 rounded"
    bg="zinc-900"
    mx="2"
    py="2"
    w="16"
    class="relative cursor-pointer"
    @click="toggleOptionsVisible"
  >
    {{ props.selectedOption }}
    <ul border="rounded" top="12" left="-4" w="24" text="white" bg="zinc-900" class="absolute selector-options" v-show="optionsVisible">
      <li
        py="2"
        mx="2"
        hover:text="green-400"
        v-for="option in props.data"
        :class="option === props.selectedOption ? 'text-green-400' : ''"
        :key="option"
        @click="handleSelect(option)"
      >{{ option }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineEmits, defineProps, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'

type OptionItem = string | number

onMounted(() => {
  document.addEventListener('click', handleEvent, true)
})

onBeforeUnmount(() => document.removeEventListener('click', handleEvent))

const props = withDefaults(defineProps<{ // generic
  isMultiple?: boolean
  data: OptionItem[]
  selectedOption: OptionItem
}>(), {
  isMultiple: false,
  data: () => []
})

const emits = defineEmits(['select'])

const optionsVisible: Ref<boolean> = ref(false)

const handleSelect = (option: OptionItem) => {
  toggleOptionsVisible()
  emits('select', option)
}

const toggleOptionsVisible = () => optionsVisible.value = !optionsVisible.value

const handleEvent = (e: Event) => {
  if (optionsVisible.value) optionsVisible.value = false
}
</script>
