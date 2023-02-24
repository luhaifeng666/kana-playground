<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-24 14:32:07
 * @Description: 
-->

<template>
  <div class="container w-screen-lg h-screen mx-auto font-mono flex items-center justify-between flex-col">
    <header class="flex items-center justify-between text-white py-8 flex-shrink-0 w-full">
      <RouterLink to="/" class="text-2xl">Ka<span class="text-green-400">na</span></RouterLink>
      <nav class="flex items-center text-sm">
        <component
          v-for="(item, index) in links"
          :key="index"
          :class="[...LINK_STYLE, item.name === route.name ? 'text-green-400' : '']"
          :is="item.isNormal ? 'a' : RouterLink"
          v-bind="{
            [item.isNormal ? 'href' : 'to']: item.link,
            ...(item.isNormal ? { target: '_blank' } : {})
          }"
        >
          <template v-if="!item.isNormal">
            {{ item.text }}
          </template>

          <Github :size="20" v-else></Github>
        </component>
      </nav>
    </header>

    <RouterView class="flex-shrink-1 flex-grow-1 basis-auto"></RouterView>

    <Footer class="text-white flex-shrink-0 py-8 w-full" />
  </div>
</template>


<script setup lang="ts">
  import { computed } from "vue"
  import { RouterLink, RouterView, useRoute } from "vue-router"
  import { Github } from 'lucide-vue-next'
  import Footer from '@/components/Footer.vue'
  import { MENU_ITEMS } from '@/constants'

  const route = useRoute()
  //  链接样式
  const LINK_STYLE = ['ml-4', 'hover:text-green-400']
  //  链接定义
  const links = MENU_ITEMS

</script>