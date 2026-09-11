/**
 * Supported languages.
 *
 * Order matters: the array is sorted by learner count, which is the order the
 * language selection screen shows them in under the "Popular" heading.
 *
 * Learner counts are the display strings from the `04-language-selection-screen`
 * design (Duolingo's public numbers) — they are content, not a live count.
 */

import type { Language, LanguageId } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "spanish",
    name: "Spanish",
    nativeName: "Español",
    flag: "https://flagcdn.com/w320/es.png",
    speechCode: "es-ES",
    learners: "28.4M learners",
    teacherVoice: "alloy",
  },
  {
    id: "french",
    name: "French",
    nativeName: "Français",
    flag: "https://flagcdn.com/w320/fr.png",
    speechCode: "fr-FR",
    learners: "19.4M learners",
    teacherVoice: "shimmer",
  },
  {
    id: "japanese",
    name: "Japanese",
    nativeName: "日本語",
    flag: "https://flagcdn.com/w320/jp.png",
    speechCode: "ja-JP",
    learners: "12.7M learners",
    teacherVoice: "coral",
  },
  {
    id: "korean",
    name: "Korean",
    nativeName: "한국어",
    flag: "https://flagcdn.com/w320/kr.png",
    speechCode: "ko-KR",
    learners: "9.3M learners",
    teacherVoice: "alloy",
  },
  {
    id: "german",
    name: "German",
    nativeName: "Deutsch",
    flag: "https://flagcdn.com/w320/de.png",
    speechCode: "de-DE",
    learners: "8.1M learners",
    teacherVoice: "shimmer",
  },
  {
    id: "chinese",
    name: "Chinese",
    nativeName: "中文",
    flag: "https://flagcdn.com/w320/cn.png",
    speechCode: "zh-CN",
    learners: "7.4M learners",
    teacherVoice: "coral",
  },
];

/** Language selected when the learner has not chosen one yet. */
export const defaultLanguageId: LanguageId = "spanish";

/** Look up one language, or `undefined` if the id is unknown. */
export function getLanguageById(id: LanguageId): Language | undefined {
  return languages.find((language) => language.id === id);
}
