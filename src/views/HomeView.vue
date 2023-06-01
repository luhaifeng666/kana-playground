<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-28 09:55:12
 * @Description: 
-->
<template>
  <main class="text-center text-white">
    <p class="text-4xl mb-4">
      <span class="home-card mr-4">カ</span
      ><span class="home-card text-green-400">ナ</span>
    </p>
    <p v-html="$t('home.desc')"></p>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
