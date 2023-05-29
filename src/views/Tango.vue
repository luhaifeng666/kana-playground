<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-04-04 14:04:55
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2023-05-23 00:47:16
 * @Description: 
-->
<template>
  <!-- 前置选择界面 -->
  <template v-if="!showPlayground">
    <div text="center white">
      <div class="flex-center">
        请选择练习范围：
        <Selector
          @select="handleSelect"
          :options="booksOption"
          :selected-option="currentBook"
        ></Selector>
        <Selector
          v-if="currentBook.key !== 'all'"
          @select="handleClassAndUnitSelect"
          :options="classesAndUnits"
          :selected-option="currentClassAndUnit"
          tree
        ></Selector>
        <Selector
          @select="handleAccountSelect"
          :options="exerciseSize"
          :selected-option="account"
        ></Selector>
      </div>
      <p
        w="26"
        text="zinc-400"
        border="b-1 b-zinc-500 rounded"
        mt="12"
        mx="auto"
        bg="zinc-700"
        p="1"
        cursor="pointer"
        hover="bg-green-400 text-white"
        @click="toggleStart"
      >
        卷起来 👻
      </p>
    </div>
  </template>

  <template v-else>
    <!-- 进度条 -->
    <div text="white">
      <div w="40" mb="1" position="relative" class="p_progress">
        <div
          bg="green-400"
          h="2"
          position="absolute"
          top="-0.5"
          left="0"
          border="rounded"
          :style="processStyle"
        ></div>
      </div>
      <p text="center">
        <span text="green-400">{{ processCurrent }}</span
        ><span mx="1">/</span><span>{{ account.key }}</span>
      </p>
    </div>

    <div class="flex-center" flex="col">
      <p text="white center 2xl">{{ currentQuestion.zh }}</p>
      <input
        type="text"
        autofocus
        ref="input"
        class="signle-inputbox"
        my="4"
        min-w="18"
        v-model="answers[processCurrent - 1]"
        :placeholder="errorTimes >= 3 ? currentQuestion.kana : ''"
        :style="inputStyle"
        :class="[
          !!answers[processCurrent - 1]
            ? `text_${isRight ? 'right' : 'error'}`
            : '',
          shake ? 'shake' : '',
        ]"
      />

      <p flex="center" text="md zinc-400 center" select="none">
        音型: {{ currentQuestion.tone }} | 词性: {{ currentQuestion.kind }} |
        熟练度:
        <span
          v-for="index in 3"
          h="1"
          w="4"
          border="rounded"
          ml="1"
          :class="[
            'inline-block',
            index > (currentQuestion.degree || 0)
              ? 'bg-gray-500'
              : 'bg-green-400',
          ]"
          :key="index"
        ></span>
      </p>
      <!-- TODO 添加例句，试试 chatGpt ？ -->
      <!-- <div
        v-if="!exampleIsNotEmpty"
        flex="center"
        text="md green-400 center bold"
        select="none"
        mt="2"
        cursor="pointer"
        @click="getSentence"
      >
        点我看个栗子 <Loader v-if="loading" :size="18" animate="spin" ml="1" />
      </div> -->

      <!-- <div text="md zinc-400 center" mt="2" v-if="currentQuestion.format">
        <p> -->
      <!-- <ruby v-for="(item, index) in currentQuestion.format" :key="index">
            {{ item.text || item.kana }}
            <rt v-if="item.text" text="green-400">{{ item.kana }}</rt>
          </ruby> -->
      <!-- {{ example.sentence }} -->
      <!-- {{ currentQuestion.translation }} -->
      <!-- </p>
      </div> -->

      <div
        mt="4"
        text="xs gray-500"
        class="cursor-pointer"
        v-if="nextVisible"
        @click="handleNext"
      >
        按下<span
          text="green-400 xs"
          border="b-1 b-zinc-500 rounded-sm"
          mx="2"
          bg="zinc-700"
          p="1"
          >ENTER</span
        >键切换下一个
      </div>
    </div>

    <p
      w="26"
      text="zinc-400 center"
      border="b-1 b-zinc-500 rounded"
      mt="12"
      mx="auto"
      bg="zinc-700"
      p="1"
      cursor="pointer"
      hover="bg-green-400 text-white"
      @click="toggleStart"
    >
      返回
    </p>
  </template>

  <!-- 结果弹窗 -->
  <Modal
    v-if="visible"
    :count="questionCount"
    :right-rate="rightRate"
    :time="time"
    v-model:visible="visible"
  ></Modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import dayjs from "dayjs/esm";
import type { QUnitType, OpUnitType } from "dayjs/esm";
import type { Ref, ComputedRef, StyleValue } from "vue";
import { WORDS, EXERCISE_SIZE } from "@/constants";
import type { Word, WordExtra, Option, OptionExtra } from "@/types";
import { getClassesAndUnits, getBooks } from "@/utils";
import Selector from "@/components/Selector.vue";
import Modal from "../components/Modal.vue";

const booksOption: Option[] = getBooks();

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

const processStyle = computed(() =>
  isInfinite.value
    ? {
        width: "100%",
      }
    : {
        width: `${(
          (processCurrent.value / (account.value.key as number)) *
          100
        ).toFixed(2)}%`,
      }
);
// 题海
const allWords: ComputedRef<Word[]> = computed(() =>
  currentBook.value.key === "all"
    ? Object.entries(WORDS).reduce(
        (arr: Word[], [, word]: [string, { name: string; words: Word[] }]) => [
          ...arr,
          ...word.words,
        ],
        []
      )
    : (currentClassAndUnit.value?.children || [])[
        currentClassAndUnit.value?.selectedChildIndex || 0
      ]?.words || []
);
const exerciseSize = computed(() =>
  EXERCISE_SIZE.map((number) => ({
    key: number,
    value: `随机的${number}个单词`,
  }))
);
// 课程列表
const classesAndUnits = computed(() => getClassesAndUnits(currentBook.value));
// 当前问题的索引值
const currentQuestionIndex: ComputedRef<number> = computed(() =>
  isInfinite.value
    ? currentIndex.value
    : questions.value[processCurrent.value - 1]
);
// 当前显示的题目信息
const currentQuestion: ComputedRef<Word & WordExtra> = computed(() => {
  const word = allWords.value[currentQuestionIndex.value];
  return { ...word, degree: degreeData.value[word.kana] || 0 };
});
const inputStyle: ComputedRef<StyleValue> = computed(() => ({
  width: `${currentQuestion.value.kana.length * 1.25 + 2}rem`,
}));
// 是否是无限模式
const isInfinite: ComputedRef<boolean> = computed(
  () => account.value.key === "∞"
);
// 是否显示下一个按钮
const nextVisible: ComputedRef<boolean> = computed(
  () => isInfinite.value || processCurrent.value < questions.value.length
);
// 正确校验
const isRight: ComputedRef<boolean> = computed(() => {
  const { kana, text } = currentQuestion.value;
  const res = [kana, text];
  const answer = answers.value[processCurrent.value - 1];
  return !!answer && res.includes(answer);
});
// 完成所有题数计算
const questionCount: ComputedRef<number> = computed(() => answers.value.length);
// 正确率计算
const rightRate: ComputedRef<string> = computed(() => {
  const answers = Array.from(answersDegree.value.values());
  return questionCount.value
    ? (
        (answers.filter((answer) => answer > 0).length / questionCount.value) *
        100
      ).toFixed(2)
    : "0.00";
});
// 计算用时
const time: ComputedRef<string> = computed(() => {
  const keys: (QUnitType | OpUnitType)[] = ["hour", "minute", "second"];
  const diffTime = keys
    .map((key) => dayjs().diff(beginTime.value, key))
    .join(":");
  return dayjs(`${dayjs().format("YYYY-MM-DD")} ${diffTime}`).format(
    "HH小时mm分ss秒"
  );
});

const beginTime = ref(dayjs());
const showPlayground: Ref<boolean> = ref(false); // 是否显示练习界面
const account: Ref<Option> = ref(exerciseSize.value[0]);
const currentBook: Ref<Option> = ref(booksOption[0]); // 练习的课本
const currentClassAndUnit: Ref<Partial<Option & OptionExtra>> = ref({});
const processCurrent: Ref<number> = ref(1); // 当前进度条显示的已练习的单词个数
const questions: Ref<number[]> = ref([]); // 所有随机筛出来的题目索引
const answers: Ref<string[]> = ref([]);
const input: Ref<HTMLInputElement | null> = ref(null);
const currentIndex: Ref<number> = ref(0);
const shake: Ref<boolean> = ref(false);
const errorTimes: Ref<number> = ref(0); // 错误三次给提示
const answersDegree = ref(new Map()); // 答案收集
const degreeData: Ref<{ [key: string]: number }> = ref({});
const visible: Ref<boolean> = ref(false);

watch(showPlayground, (val) => {
  if (val) {
    // 初始化熟练度
    initDegreeData();

    if (!isInfinite.value) {
      let count = account.value.key as number;
      const map: number[] = [];
      while (count > 0) {
        const number = getRandomNum();
        if (
          account.value.key > allWords.value.length ||
          !map.includes(number)
        ) {
          map.push(number);
          count--;
        }
      }

      questions.value = map;
    } else {
      questions.value = [];
      currentIndex.value = getRandomNum();
    }
  } else {
    if (isInfinite.value) {
      // 无限模式下，返回选择界面需要保存熟练度
      setDegree();
      visible.value = !!questionCount.value; // 如果一题都没练，就别显示了，夺丢人呐
    }
  }
});

watch(visible, (val) => {
  if (!val) {
    toggleStart();
    handleRest();
  }
});

watch(
  () => currentBook.value.key,
  (val) => {
    if (val !== "all") {
      currentClassAndUnit.value = {
        ...classesAndUnits.value[0],
        selectedChildIndex: 0,
      };
    }
    account.value = exerciseSize.value[0];
  }
);

watch(
  [currentClassAndUnit.value.key, currentClassAndUnit.value.selectedChildIndex],
  () => {
    account.value = exerciseSize.value[0];
  }
);

// 监听 enter 按键事件
const initDegreeData = () => {
  degreeData.value = JSON.parse(localStorage.getItem("degree_records") || "{}");
};
const handleKeyDown = (e: KeyboardEvent) => {
  if (e && e.keyCode === 13) handleNext();
};
const handleSelect = (option: Option) => {
  currentBook.value = option;
};
const handleClassAndUnitSelect = (option: Option & OptionExtra) => {
  currentClassAndUnit.value = option;
};
const handleAccountSelect = (option: Option) => {
  account.value = option;
};
const toggleStart = () => {
  showPlayground.value = !showPlayground.value;
};
const getRandomNum = () =>
  Math.ceil(Math.random() * (allWords.value.length - 1));
const handleNext = () => {
  if (showPlayground.value) {
    if (!isRight.value) {
      shake.value = true;
      const timer = setTimeout(() => {
        shake.value = false;
        clearTimeout(timer);
      }, 300);
      errorTimes.value += 1;
      return;
    }
    answersDegree.value.set(
      currentQuestion.value.kana,
      (answersDegree.value.get(currentQuestion.value.kana) || 0) +
        (errorTimes.value ? -1 : 1)
    );

    if (!isInfinite.value) {
      if (processCurrent.value < (account.value.key as number)) {
        processCurrent.value += 1;
      } else {
        // 写入熟练度
        setDegree();
        // 弹出结果弹窗
        visible.value = true;
      }
    } else {
      processCurrent.value += 1;
      currentIndex.value = getRandomNum();
    }

    input.value?.focus();
    errorTimes.value = 0;
  }
};
const setDegree = () => {
  const degreeRecords: { [key: string]: number } = { ...degreeData.value };

  Array.from(answersDegree.value.entries()).forEach(([kana, degree]) => {
    if (!(kana in degreeRecords)) degreeRecords[kana] = 0;
    const degreeRes = degreeRecords[kana] + degree;
    degreeRecords[kana] = degreeRes < 0 ? 0 : degreeRes > 3 ? 3 : degreeRes;
  });

  localStorage.setItem("degree_records", JSON.stringify(degreeRecords));
};
const handleRest = () => {
  processCurrent.value = 1;
  questions.value = [];
  answers.value = [];
  errorTimes.value = 0;
  answersDegree.value.clear();
  beginTime.value = dayjs();
  account.value = exerciseSize.value[0];
};
</script>
