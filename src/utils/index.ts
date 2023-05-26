/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-24 15:23:26
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-24 15:31:20
 * @Description:
 */

import { WORDS } from "@/constants";
import type { Option, Word } from "@/types";

/**
 * 判断是否是空对象
 * @param target
 * @returns Boolean
 */
export const isEmpty = (target: any): boolean => {
  // 不是对象类型，返回
  return (
    Object.prototype.toString.call(target) !== "[object Object]" ||
    !Object.keys(target).length
  );
};

/**
 * 获取所有的册/课/单元信息
 */

export const getBooks: () => Option[] = () => [
  { key: "all", value: "所有单词" },
  ...Object.entries(WORDS).map(([key, word]) => ({ key, value: word.name })),
];

export const getClassesAndUnits = (params: Option) => {
  const { key } = params;
  const { words } = WORDS[key as keyof typeof WORDS];
  const classes: string[] = Array.from(
    new Set(words.map((word: Word) => word.from.replace("R", ""))) // 剔除不必要的字符串
  );
  return Array.from(
    classes
      .reduce((map, className) => {
        const [classKey, unitKey] = className.split("-");
        if (!map.has(classKey))
          map.set(classKey, {
            key: `class${classKey}`,
            value: `第${classKey}课`,
            children: [],
          });
        map.get(classKey).children.push({
          key: `unit${unitKey}`,
          value: `第${parseInt(unitKey)}单元`,
          words: words.filter((word) =>
            word.from.includes(`${classKey}-${unitKey}`)
          ),
        });
        return map;
      }, new Map())
      .values()
  );
};
