<template>
  <div display="flex" w="full" flex="shrink-0">
    <div basis="1/2" pr="4">
      <p text="white lg right" mb="4">{{ leftTitle }}</p>
      <slot></slot>
    </div>
    <div basis="1/2" pl="4">
      <p text="white lg" mb="4">{{ rightTitle }}</p>
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