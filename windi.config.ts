/*
 * @Author: haifeng.lu haifeng.lu@ly.com
 * @Date: 2023-02-21 09:55:51
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-28 09:54:48
 * @Description:
 */
import { defineConfig } from "windicss/helpers";

export default defineConfig({
  shortcuts: {
    "switch-btn":
      "w-30 -mt-4 text-center text-white cursor-pointer transform transition", // 上一个/下一个切换按钮样式
    "signle-inputbox":
      "w-full h-18 rounded-lg bg-zinc-900 outline-none text-center text-white text-xl mb-2 border-b-3 border-b-zinc-700", // 单个输入框样式
    "flex-center": "flex items-center justify-center",
    "home-card":
      "w-18 h-18 inline-flex items-center justify-center bg-zinc-900 rounded-lg border-b-3 border-b-zinc-700",
  },
  attributify: true,
});
