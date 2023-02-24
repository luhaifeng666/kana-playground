<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-21 11:21:35
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-24 16:46:14
 * @Description: 
-->
<template>
  <div overflow="scroll" w="full">
    <kana-container left-title="清音表" right-title="清音读音注意点">
      <div display="flex" items="end" flex="col" growth="0">
        <div v-for="(line, lineNum) in [cols, ...KANA_FIFTY]" :key="lineNum" display="flex">
          <div
            v-for="({ name, roma, upperCase, lowerCase }, index) in line"
            :key="`${name || roma || ''}_${index}`"
            :class="['flex-center', lineNum === 1 && 'bg-green-900']" text="center" w="70px" h="55px" border="1 zinc-500"
          >
            <p text="white sm" v-if="name">{{ name }}</p>
            <p v-else-if="lowerCase && upperCase && roma" text="white">
              <p text="sm"><span mr="1">{{ lowerCase }}</span><span text="green-400">{{ upperCase }}</span></p>
              <p
                v-bind="{
                  ...(Array.isArray(roma) ? {
                    bg: 'green-400',
                    text: 'xs white'
                  } : { text: 'xs zinc-400', bg: 'zinc-900' })
                }" mt="1" border="rounded"
              >{{ getRoma(roma) }}</p>
            </p>
          </div>
        </div>
      </div>
      <template #right>
      </template>
    </kana-container>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import KanaContainer from './components/KanaContainer.vue'
import { KANA_FIFTY, COLS } from '@/constants'

// 格式化段数
const cols = computed(() => [{}, ...COLS])

// 格式化罗马音
const getRoma = (roma: string | Array<string>) => Array.isArray(roma) ? roma.join('/') : roma
</script>