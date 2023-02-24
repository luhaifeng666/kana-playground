/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-24 15:23:26
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-24 15:31:20
 * @Description: 
 */

/**
 * 判断是否是空对象
 * @param target
 * @returns Boolean
 */
export const isEmpty = (target: any):boolean => {
  // 不是对象类型，返回
  return Object.prototype.toString.call(target) !== '[object Object]' || !Object.keys(target).length
} 