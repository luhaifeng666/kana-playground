import { Configuration, OpenAIApi } from "openai";
import type { Word, WordExtra, Example } from "@/types";
import { WORDS } from "@/constants";

const configuration = new Configuration({
  organization: "org-zFJWJqkAsf32H10uVW5JSYJ3",
  apiKey: import.meta.env.VITE_OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const allPrompts = (type = "Simplified Chinese") =>
  Object.entries(WORDS)
    .reduce(
      (arr: Word[], [, word]: [string, { name: string; words: Word[] }]) => [
        ...arr,
        ...word.words,
      ],
      []
    )
    .map((word) => ({
      word,
      prompt: `Return a json value, its sentence property's value is a sentence written in Japanese includes ${
        word.text || word.kana
      }, its translation property's value is to translate the sentence into ${type}. And it's kana property's value is the sentence's with kana.`,
    }));

export const getExampleSentence = async (prompt: string) =>
  await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 2048,
    temperature: 0,
    n: 1,
  });

const dictionary: Array<Word & WordExtra> = [];
for (const obj of allPrompts()) {
  const res = await getExampleSentence(obj.prompt);
  const { status, data } = res;
  let example: Partial<Example> = {};
  if (status === 200) {
    const { choices = [] } = data || {};
    if (choices && choices.length) {
      const sentenceObj = JSON.parse(
        choices[0].text?.replace(/\n/g, "") || "{}"
      );
      const { sentence, kana } = sentenceObj;
      const nonKanaRegex = /[^\u3040-\u309F\u30A0-\u30FFー]/g;
      const kanas: string[] = sentence.split(nonKanaRegex);
      const kanaRegex = new RegExp(
        `${kanas.filter((kana) => !!kana).join("|")}`,
        "g"
      );
      const kanjiWords: string[] = sentence
        .split(kanaRegex)
        .filter((text: string) => !!text);
      const kanaWords: string[] = kana
        .split(kanaRegex)
        .filter((text: string) => !!text);
      const otherKanaWords: string[] = sentence.match(kanaRegex);
      example = {
        ...sentenceObj,
        format: kanjiWords.reduce(
          (arr, kanji, index) => [
            ...arr,
            {
              kana: kanaWords[index],
              text: kanji,
            },
            {
              kana: otherKanaWords[index],
            },
          ],
          []
        ),
      };
    }
    dictionary.push({
      ...obj.word,
      example,
    });
    console.log(JSON.stringify(dictionary));
  } else {
    console.log(JSON.stringify(dictionary));
  }
}

console.log(JSON.stringify(dictionary));
