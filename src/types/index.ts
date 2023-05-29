/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-28 13:59:57
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-05-15 23:55:01
 * @Description:
 */
export interface Kana {
  upperCase?: string;
  lowerCase?: string;
  roma?: Array<string> | string;
  name?: string; // 用于标注是哪一行
}

export interface RecordDataItem extends Kana {
  rightTimes: number;
  errorTimes: number;
}

export interface RecordData {
  time?: string;
  data?: {
    [key: string]: RecordDataItem;
  };
}

type WordKeys = "kana" | "from" | "page" | "zh" | "text" | "kind" | "tone";

export type Word = {
  [key in WordKeys]: string;
};

export type WordExtra = {
  degree?: number;
  sentence?: string;
  // example?: Example;
};

export type ExampleSentence = {
  text?: string;
  kana: string;
};

export type Example = {
  sentence: string;
  kana: string;
  translation: string;
  format?: ExampleSentence[];
};

export type Week = Required<ExampleSentence>;

export type Option = {
  key: string | number;
  value: string;
  words?: Array<Word & WordExtra>;
  children?: Option[];
};

export type OptionExtra = {
  selectedChildIndex?: number;
};
