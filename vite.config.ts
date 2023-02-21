/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-21 09:54:05
 * @Description: 
 */
import { fileURLToPath, URL } from 'node:url'
import WindiCSS from 'vite-plugin-windicss'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
