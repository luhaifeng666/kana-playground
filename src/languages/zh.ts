const COMMON = {
  hiragana: "平假名",
  katakana: "片假名",
  romanym: "罗马音",
  words: "单词",
  enter: "回车键",
  next: "下一个",
  font: "字体",
  colors: {
    green: "绿色",
  },
};

export const zh = {
  menu: {
    kana: "卷假名",
    tango: "卷单词",
    map: "音图",
    record: "记录",
  },
  home: {
    desc: `一个练习<span class="text-green-400 font-bold mx-1">${COMMON.hiragana}/${COMMON.katakana}/${COMMON.romanym}/${COMMON.words}</span>的地儿`,
  },
  kanaPlayground: {
    desc: ``,
    tips: `Tips: 可通过按下键盘的
    <span border="rounded" p="1" bg="zinc-900" text="xs green-400"
      >${COMMON.enter}</span
    >
    键切换下一个；点击上述内容中的
    <strong text="green-400">${COMMON.colors.green}${COMMON.font}</strong> 可以切换练习模式哦~`,
  },
};
