/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-28 13:59:57
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-28 15:21:00
 * @Description: 
 */
export interface Kana {
  upperCase?: string
  lowerCase?: string
  roma?: Array<string> | string
  name?: string // 用于标注是哪一行
}

export interface RecordDataItem extends Kana {
  rightTimes: number
  errorTimes: number
}

export interface RecordData {
  time?: string
  data?: {
    [key: string]: RecordDataItem
  }
}