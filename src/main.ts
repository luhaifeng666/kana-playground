/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-21 10:37:42
 * @Description:
 */
import { createApp } from "vue";
import "virtual:windi.css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
