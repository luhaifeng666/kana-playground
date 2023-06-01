<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-03-10 22:20:13
 * @Description: 
-->

<template>
  <div
    class="container w-screen-lg h-screen mx-auto font-mono flex items-center justify-between flex-col"
  >
    <header
      class="flex items-center justify-between text-white py-8 flex-shrink-0 w-full"
    >
      <RouterLink to="/" class="text-2xl">
        Ka<span class="text-green-400">na</span>
      </RouterLink>
      <nav class="flex items-center text-sm">
        <component
          v-for="(item, index) in links"
          :key="index"
          :class="[
            ...LINK_STYLE,
            item.name === route.name ? 'text-green-400' : '',
          ]"
          :is="item.isNormal ? 'a' : RouterLink"
          v-bind="{
            [item.isNormal ? 'href' : 'to']: item.link,
            ...(item.isNormal ? { target: '_blank' } : {}),
          }"
        >
          <template v-if="!item.isNormal">
            <span>{{ $t(item.lang) }}</span>
          </template>

          <Github :size="20" v-else></Github>
        </component>
      </nav>
    </header>

    <RouterView class="flex-shrink-1 flex-grow-1 basis-auto"></RouterView>

    <Footer class="text-white flex-shrink-0 py-8 w-full"></Footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import dayjs from "dayjs";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { Github } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import Footer from "@/components/Footer.vue";
import { MENU_ITEMS } from "@/constants";

const route = useRoute();
const { t } = useI18n();
//  链接样式
const LINK_STYLE = ["ml-4", "hover:text-green-400"];
//  链接定义
const links = MENU_ITEMS;

onBeforeMount(() => {
  const recordData = localStorage.getItem("kanaRecord") || "{}";
  const { time = "" } = JSON.parse(recordData);
  // 如果本地日期是昨天，需要清空数据
  if (time && dayjs().isAfter(dayjs(time), "day")) {
    localStorage.setItem(
      "kanaRecord",
      JSON.stringify({
        time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        data: {},
      })
    );
  }
});
</script>
