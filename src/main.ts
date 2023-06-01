/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-21 10:37:42
 * @Description:
 */
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { en, zh } from "./languages";
import "virtual:windi.css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const i18n = createI18n({
  locale: "zh",
  allowComposition: true,
  // fallbackLocale: "en",
  messages: {
    en,
    zh,
  },
});

const app = createApp(App);

app.use(router);
app.use(i18n);

app.mount("#app");
