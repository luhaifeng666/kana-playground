<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-21 11:21:35
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-28 16:22:01
 * @Description: 
-->
<template>
  <div overflow="scroll" w="full" id="kana_view" ref="kanaViewEl">
    <kana-container v-for="(content, index) in tableData" :left-title="content.mainTitle" :right-title="content.subTitle" :key="index">
      <div display="flex" items="end" flex="col" growth="0" pb="8" v-if="content.mainContent && content.mainContent.length">
        <div v-for="(line, lineNum) in content.mainContent" :key="lineNum" display="flex">
          <div
            v-for="({ name, roma, upperCase, lowerCase }, index) in line"
            :key="`${name || roma || ''}_${index}`"
            :class="['flex-center', content.heightLightLines?.includes(lineNum) && 'bg-green-900']" text="center" w="70px" h="55px" border="1 zinc-500"
          >
            <p text="white sm" v-if="name">{{ name }}</p>
            <p v-else-if="lowerCase && upperCase && roma" text="white">
              <p text="sm"><span mr="1">{{ lowerCase }}</span><span text="green-400">{{ upperCase }}</span></p>
              <p
                v-bind="{
                  ...(Array.isArray(roma) ? {
                    bg: 'green-400',
                    text: 'xs white'
                  } : { text: 'xs zinc-400', bg: 'zinc-900' })
                }" mt="1" border="rounded"
              >{{ getRoma(roma) }}</p>
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <div text="white sm justify" leading="relaxed" pb="8" v-if="content.subContent && content.subContent.length">
          <p display="flex" items="start" justify="start" v-for="(sub, index) in content.subContent" :key="index">
            <span mr="2">{{ index + 1 }}.</span>
            <span v-html="sub"></span>
          </p>
        </div>
      </template>
    </kana-container>
  </div>

  <SlideTop @scroll="handleScrollTop" v-show="arrowVisible"/>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import KanaContainer from './components/KanaContainer.vue'
import SlideTop from '@/components/SlideTop.vue'
import { KANA_FIFTY, COLS, DULL, AO, AO_DULL } from '@/constants'
import type { Kana } from '@/types'

const kanaViewEl: Ref<HTMLElement|null> = ref(null)
const arrowVisible: Ref<boolean> = ref(false)

onMounted(() => {
  kanaViewEl.value && kanaViewEl.value.addEventListener('scroll', scrollHandler)
})

onBeforeUnmount(() => {
  kanaViewEl.value && kanaViewEl.value.removeEventListener('scroll', scrollHandler)
})

// 格式化段数
const cols = computed(() => [{}, ...COLS])

// 数据分组
const groupBy = (arr: Array<Kana>, num: number) => {
  const res: Array<Array<Kana>> = []
  for(let i = 0, len = arr.length; i < Math.ceil(len / num); i++) {
    const group = arr.slice(i * num, (i + 1) * num)
    res.push(group.length < num ? [...group, ...new Array(num - group.length).fill({})] : group)
  }
  return res
}

// 添加标签
const addTag = (content: string, needCircle?: boolean) => `<strong text="green-400 xs" p="1" border="rounded" bg="zinc-900">${needCircle ? `<span leading="4" display="inline-block" border="rounded-1 green-400 1" w="4" text="xs center">${content}</span>` : content}</strong>`

// 添加说明标签
const addExplainTag = (arr: Array<string>) => arr.map(item => `${item.split('|')[0]}(${addTag(item.split('|')[1])})`).join('、')

// 添加相同读音标签
const addSameSpeakTag = (arr: Array<string>) => arr.map(item => {
  const [pre, aft, sound] = item.split('|')
  return `${addTag(pre)} 与 ${addTag(aft)} 的读音一样，都读 "${addTag(sound)}" 的音`
}).join('、') + `，但是在输入的时候，注意${addTag('不要输错罗马音')}！！`

// 添加长音标注
const addLongTag = (arr: Array<string>) => arr.map(item => `${addTag(`${item.split('|')[0]}段`)} 后接 ${addTag(item.split('|')[1])}`).join('、')

// 定义所有需要渲染的内容
const tableData = [
  {
    mainTitle: '清音表',
    subTitle: '清音注意点',
    mainContent: [cols.value, ...KANA_FIFTY] as Array<Array<Kana>>,
    subContent: [
      `${addTag('あ行')} 所对应的5个音为元音；`,
      `在使用罗马音输入时，有三个假名存在两种输入方式，分别是: ${addExplainTag(['し|si/shi', 'ち|ti/chi', 'つ|tu/tsu'])}；`,
      `清音可以按照拼读的方式去记忆，但是其中有几个假名的读音比较特殊，分别是：${addExplainTag(['し|xi', 'す|si', 'ち|qi', 'つ|ci', 'ふ|fu', 'ゆ|you', 'を|o'])}、ら行所有的假名读音可以使用 ${addTag('L + 对应段的元音')} 进行拼读。`
    ],
    heightLightLines: [1]
  },
  {
    mainTitle: '浊音表',
    subTitle: '浊音注意点',
    mainContent: groupBy(DULL, 5),
    subContent: [
      `浊音也可以按照拼读的方式去记忆，需要注意的是：${addSameSpeakTag(['じ|ぢ|ji', 'ず|づ|zi'])}`,
      `在使用罗马音输入时，有一个浊音存在两种输入方式: ${addExplainTag(['ぢ|di/ji'])}。`,
    ]
  },
  {
    mainTitle: '拗音表',
    subTitle: '拗音 && 拗浊音注意点',
    mainContent: groupBy(AO, 6),
    subContent: [
      `拗音的构成：${addTag('一大一小')} 两个假名，书写的时候需要注意 ${addTag('第二个假名的大小以及书写位置')}；`,
      `罗马音：大假名的 ${addTag('辅音')} + ${addTag('ya/yu/yo')}；`,
      `发音：两个假名直接拼读。在拼读时需要注意：${addSameSpeakTag(['じゃ|ぢゃ|jia', 'じゅ|ぢゅ|jyu', 'じょ|ぢょ|jyo'])}`,
      `在使用罗马音输入时，有三个拗浊音存在两种输入方式，分别是: ${addExplainTag(['じゃ|zya/jia', 'じゅ|zyu/jyu', 'じょ|zyo/jyo'])}。`
    ]
  },
  {
    mainTitle: '拗浊音表',
    subTitle: '',
    mainContent: groupBy(AO_DULL, 6)
  },
  {
    mainTitle: `拨音: ん/${addTag('ン')}/${addTag('nn')}`,
    subTitle: '拨音注意点',
    subContent: [
      `通过鼻腔进行共鸣，前一个假名读完后 "${addTag('n')}" 一下；`,
      '读高低音时，ん占一拍。'
    ]
  },
  {
    mainTitle: '长音',
    subTitle: '长音注意点',
    subContent: [
      `将前一个假名 ${addTag('拖长一拍')}；`,
      `判断长音的规律：平假名后，${addLongTag(['あ|あ', 'い|い', 'う|う', 'え|い/え', 'お|う/お'])}，但是${addTag('无论是哪一段片假名的长音，后面统一使用 "-"(对应键盘上的减号) 来表示长音')}；`,
      `平假名的长音按照正常的罗马音输入即可，片假名的长音统一输入 ${addTag('"-"(对应键盘上的减号)')}。`
    ]
  },
  {
    mainTitle: `促音: っ/${addTag('ッ')}/${addTag('xtu')}`,
    subTitle: '促音注意点',
    subContent: [
      `${addTag('停顿一拍')}，后一个音发音要有力；`,
      `输入促音主要有两种方式：第一种是直接输入 ${addTag('xtu')}，例如：とっても ${addTag('to xtu te mo')}；而第二种比较便捷，${addTag('输入两次后面假名的辅音即可')}，例如：とっても ${addTag('to tte mo')}。`
    ]
  },
  {
    mainTitle: '音调',
    subTitle: '',
    subContent: [
      `0号音：标记为 ${addTag('0', true)}，第 ${addTag('1')} 个假名读 ${addTag('低音')}，其他的假名读 ${addTag('高音')}；`,
      `1号音：标记为 ${addTag('①')}，第 ${addTag('1')} 个假名读 ${addTag('高音')}，其他的假名读 ${addTag('低音')}；`,
      `2号音：标记为 ${addTag('②')}，第 ${addTag('2')} 个假名读 ${addTag('高音')}，其他的假名读 ${addTag('低音')}；`,
      `3号音：标记为 ${addTag('③')}，第 ${addTag('2 到 3')} 个假名读 ${addTag('高音')}，其他的假名读 ${addTag('低音')}；`,
      '......',
      `n号音：标记为 ${addTag('n', true)}，第 ${addTag('2 到 n')} 个假名读 ${addTag('高音')}，其他的假名读 ${addTag('低音')}。`,
    ]
  }
]

// 格式化罗马音
const getRoma = (roma: string | Array<string>) => Array.isArray(roma) ? roma.join('/') : roma

// 滚动到顶部
const handleScrollTop = () => {
  kanaViewEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动
const scrollHandler = () => {
  if (kanaViewEl.value) arrowVisible.value = kanaViewEl.value.scrollTop > 0
}
</script>

<style scoped>
#kana_view::-webkit-scrollbar {
  display: none;
}
</style>