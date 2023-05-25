import { Configuration, OpenAIApi } from "openai";
import type { Word, WordExtra } from "@/types";
const configuration = new Configuration({
  organization: "org-zFJWJqkAsf32H10uVW5JSYJ3",
  apiKey: import.meta.env.VITE_OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export const getExampleSentence = async (
  kanaQuestion: Word & WordExtra,
  type = "Simplified Chinese"
) =>
  await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Return a json value, its sentence property's value is a sentence written in Japanese includes ${
      kanaQuestion.text || kanaQuestion.kana
    }, its translation property's value is to translate the sentence into ${type}. And it's kana property's value is the sentence's with kana.`,
    max_tokens: 1024,
    temperature: 0,
    n: 1,
  });
