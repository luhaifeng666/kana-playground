/*
 * @Author: haifeng.lu haifeng.lu@ly.com
 * @Date: 2023-02-21 16:08:49
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-24 16:47:30
 * @Description: 
 */

//  定义菜单项
export const MENU_ITEMS = [
  { text: '练习', link: '/playground', isNormal: false, name: 'playground' },
  { text: '音图', link: '/kana', isNormal: false, name: 'kana' },
  { text: '记录', link: '/record', isNormal: false, name: 'record' },
  { text: '', link: 'https://github.com/luhaifeng666/kana-playground', isNormal: true, name: '' }
]

export interface Kana {
  upperCase?: string
  lowerCase?: string
  roma?: Array<string> | string
  name?: string // 用于标注是哪一行
}

//  平假名
const KANA_LOWER_STR = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや&ゆ&よらりるれろわ&&&をん'
const DULL_KANA_LOWER_STR = 'がぎごげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ'
const AO_KANA_LOWER_STR = 'きゃ,きゅ,きょ,しゃ,しゅ,しょ,ちゃ,ちゅ,ちょ,にゃ,にゅ,にょ,ひゃ,ひゅ,ひょ,みゃ,みゅ,みょ,りゃ,りゅ,りょ'
const AO_DULL_KANA_LOWER_STR = 'ぎゃ,ぎゅ,ぎょ,じゃ,じゅ,じょ,ぢゃ,ぢゅ,ぢょ,びゃ,びゅ,びょ,ぴゃ,ぴゅ,ぴょ'
//  片假名
const KANA_UPPER_STR = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤ&ユ&ヨラリルレロワ&&&ヲン'
const DULL_KANA_UPPER_STR = 'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ'
const AO_KANA_UPPER_STR = 'キャ,キュ,キョ,シャ,シュ,ショ,チャ,チュ,チョ,ニャ,ニュ,ニョ,ヒャ,ヒュ,ヒョ,ミャ,ミュ,ミョ,リャ,リュ,リョ'
const AO_DULL_KANA_UPPER_STR = 'ギャ,ギュ,ギョ,ジャ,ジュ,ジョ,ヂャ,ヂュ,ヂョ,ビャ,ビュ,ビョ,ピャ,ピュ,ピョ'
//  罗马音
const KANA_ROMA_STR = 'a,i,u,e,o,ka,ki,ku,ke,ko,sa,si/shi,su,se,so,ta,ti,tu/tsu,te,to,na,ni,nu,ne,no,ha,hi,hu,he,ho,ma,mi,mu,me,mo,ya,&,yu,&,yo,ra,ri,ru,re,ro,wa,&,&,&,wo,nn'
const DULL_KANA_ROMA_STR = 'ga,gi,gu,ge,go,za,zi,zu,ze,zo,da,di,du,de,do,ba,bi,bu,be,bo,pa,pi,pu,pe,po'
const AO_KANA_ROMA_STR = 'kya,kyu,kyo,sya,syu,syo,tya,tyu,tyo,nya,nyu,nyo,hya,hyu,hyo,mya,myu,myo,rya,ryu,ryo'
const AO_DULL_KANA_ROMA_STR = 'gya,gyu,gyo,zya,zyu,zyo,dya,dyu,dyo,bya,byu,byo,pya,pyu,pyo'

// 生成音图
const kanaGenerator = (lower:string, upper:string, roma:string, splitor = '') => lower.split(splitor).reduce((res: Array<Kana>, item, index) => {
  const upperList = upper.split(splitor)
  const romaList = roma.split(',')
  // 如果有占位符 & ，插入空对象
  return [...res, item === '&' ? {} : {
    upperCase: upperList[index],
    lowerCase: item,
    roma: romaList[index].includes('/') ? romaList[index].split('/') : romaList[index]
  }]
}, [])

//  定义清音
export const KANA: Array<Kana> = kanaGenerator(KANA_LOWER_STR, KANA_UPPER_STR, KANA_ROMA_STR)

//  定义浊音
export const DULL: Array<Kana> = kanaGenerator(DULL_KANA_LOWER_STR, DULL_KANA_UPPER_STR, DULL_KANA_ROMA_STR)

//  定义拗音
export const AO: Array<Kana> = kanaGenerator(AO_KANA_LOWER_STR, AO_KANA_UPPER_STR, AO_KANA_ROMA_STR, ',')

//  定义拗浊音
export const AO_DULL: Array<Kana> = kanaGenerator(AO_DULL_KANA_LOWER_STR, AO_DULL_KANA_UPPER_STR, AO_DULL_KANA_ROMA_STR, ',')

// 五十音图
export const KANA_FIFTY: Array<Array<Kana>> = KANA_LOWER_STR.slice(0, KANA_LOWER_STR.length - 1).split('').filter(
  (char, index) => !(index % 5)
).map((vowel: string, index: number) => [
  { name: `${vowel}行` },
  ...KANA.slice(index * 5, (index + 1) * 5)
])

// 定义段数
export const COLS: Array<Kana> = KANA.slice(0, 5).map(item => ({ name: `${item.lowerCase}段` }))

// 定义模式
export const PATTERN: Array<{ name: string, type: string }> = [
  { name: '平假名', type: 'lowerCase' },
  { name: '片假名', type: 'upperCase' },
  { name: '罗马音', type: 'roma' }
]