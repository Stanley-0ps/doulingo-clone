/**
 * Learning content types.
 *
 * These describe the hardcoded course data in `src/data/`:
 *
 *   Language → Unit → Lesson → { vocabulary, phrases, goals, activities, aiTeacher }
 *
 * Everything is plain data so it can be typed, imported anywhere, and extended
 * by adding another object to the arrays in `src/data/lessons.ts`.
 */

import type { ImageName } from "@/constants/images";
import type { ColorToken } from "@/theme";

/** Ids of the languages the app ships with. */
export type LanguageId = "spanish" | "french" | "japanese" | "german";

/**
 * Ids below are stable slugs (`"es-unit-1"`, `"es-greetings"`, `"es-greetings-v1"`)
 * rather than unions: new content should only mean adding objects to the data
 * files, never editing these types.
 */
export type UnitId = string;
export type LessonId = string;
export type VocabularyId = string;
export type PhraseId = string;
export type ActivityId = string;

/** CEFR level of a unit. */
export type CefrLevel = "A1" | "A2" | "B1" | "B2";

/** How forgiving the pronunciation check is for a repeat-after-me activity. */
export type PronunciationAccuracy = "relaxed" | "normal" | "strict";

/** Word class shown on flashcards and vocabulary lists. */
export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "expression";

/* -------------------------------------------------------------------------- */
/* Languages                                                                   */
/* -------------------------------------------------------------------------- */

/** A language the learner can study. Shown on the language selection screen. */
export interface Language {
  id: LanguageId;
  /** English name, e.g. "Spanish". */
  name: string;
  /** Name in the language itself, e.g. "Español". */
  nativeName: string;
  /** Flag image URL used as the list icon on the language selection screen. */
  flag: string;
  /**
   * BCP-47 tag for speech recognition and text-to-speech
   * (`es-ES`, `fr-FR`, `ja-JP`). Never show this to the learner.
   */
  speechCode: string;
  /** Preformatted learner count exactly as the design shows it. */
  learners: string;
  /**
   * Voice hint for the audio AI teacher (see `AiTeacherPrompt`). Picked from
   * the OpenAI Realtime voice list server-side.
   */
  teacherVoice: string;
}

/* -------------------------------------------------------------------------- */
/* Units                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A themed group of lessons inside one language ("Getting Started",
 * "Everyday Life"). Shown as the unit header on the Learn screen.
 */
export interface Unit {
  id: UnitId;
  languageId: LanguageId;
  /** 1-based position inside the language. Rendered as "Unit 3". */
  order: number;
  title: string;
  description: string;
  /** Decorates the unit card in the lesson list. */
  emoji: string;
  level: CefrLevel;
  /** Design-system color token used to tint the unit's artwork and progress. */
  color: ColorToken;
}

/* -------------------------------------------------------------------------- */
/* Vocabulary & phrases                                                        */
/* -------------------------------------------------------------------------- */

/** A single word or short expression taught in a lesson. */
export interface VocabularyItem {
  id: VocabularyId;
  /** The word in the language being learned. */
  term: string;
  /** English meaning. */
  translation: string;
  /** Pronunciation help written for English speakers, e.g. "OH-lah". */
  pronunciation: string;
  partOfSpeech: PartOfSpeech;
  /** The word used in a sentence, with its English translation. */
  example: {
    term: string;
    translation: string;
  };
  /** Emoji hint used on flashcards so the UI stays illustration-free. */
  emoji: string;
}

/** A full sentence the learner should be able to say by the end of a lesson. */
export interface Phrase {
  id: PhraseId;
  /** The phrase in the language being learned. */
  text: string;
  /** English translation shown underneath. */
  translation: string;
  pronunciation: string;
  /** When a learner would use this — shown as helper text. */
  usage: string;
}

/* -------------------------------------------------------------------------- */
/* Lesson goals                                                                */
/* -------------------------------------------------------------------------- */

/** What the learner walks away with. Drives the lesson card and the AI teacher. */
export interface LessonGoal {
  /** One-line "you will be able to…" summary shown on the lesson card. */
  summary: string;
  /** Concrete, checkable things the learner can do after the lesson. */
  outcomes: string[];
  /** Vocabulary the learner needs to reach the goal (ids from this lesson). */
  vocabularyIds: VocabularyId[];
  /** Phrases the learner should be able to say (ids from this lesson). */
  phraseIds: PhraseId[];
}

/* -------------------------------------------------------------------------- */
/* Activities                                                                  */
/* -------------------------------------------------------------------------- */

/** Pick the right translation out of four options. */
export interface MultipleChoiceActivity {
  id: ActivityId;
  type: "multiple-choice";
  /** Instruction shown at the top of the activity. */
  instruction: string;
  /** The prompt being asked about, in the language being learned. */
  question: string;
  options: string[];
  /** Index into `options`. */
  correctIndex: number;
  /** English feedback shown after the learner answers. */
  explanation: string;
}

/** Build the target-language sentence from a word bank. */
export interface TranslateActivity {
  id: ActivityId;
  type: "translate";
  instruction: string;
  /** English sentence the learner has to produce in the target language. */
  sourceText: string;
  /** The expected answer. */
  answerText: string;
  /** Tappable words — includes the answer's words plus a couple of decoys. */
  wordBank: string[];
  explanation: string;
}

/** Listen to a native phrase, then repeat it out loud. */
export interface ListenAndRepeatActivity {
  id: ActivityId;
  type: "listen-and-repeat";
  instruction: string;
  /** Phrase being practised (id from this lesson). */
  phraseId: PhraseId;
  /** Text sent to text-to-speech. */
  audioText: string;
  /** English meaning shown under the phrase. */
  translation: string;
  accuracy: PronunciationAccuracy;
}

/** A spoken turn with the AI teacher — the conversational part of the lesson. */
export interface SpeakWithTeacherActivity {
  id: ActivityId;
  type: "speak-with-teacher";
  instruction: string;
  /** What the learner should say out loud. */
  learnerTask: string;
  /** Answers the teacher should accept as correct. */
  exampleAnswers: string[];
  /** Vocabulary the learner is expected to use (ids from this lesson). */
  vocabularyIds: VocabularyId[];
  /** Phrases the learner is expected to use (ids from this lesson). */
  phraseIds: PhraseId[];
}

/** Discriminated union — switch on `activity.type` to render one. */
export type LessonActivity =
  | MultipleChoiceActivity
  | TranslateActivity
  | ListenAndRepeatActivity
  | SpeakWithTeacherActivity;

export type LessonActivityType = LessonActivity["type"];

/* -------------------------------------------------------------------------- */
/* AI teacher                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Seed prompt for the audio AI teacher (Stream Vision Agent) session.
 *
 * The agent always explains in English and teaches the target language through
 * English — only the words and phrases being practised are in the target
 * language. These fields are sent server-side; secrets never live here.
 */
export interface AiTeacherPrompt {
  /** Role and tone, e.g. "You are Luna, a patient Spanish teacher for beginners." */
  persona: string;
  /** What the spoken session must accomplish, written in English. */
  objective: string;
  /** Conversation beats the teacher moves through, in order. */
  conversationPlan: string[];
  /** The first thing the teacher says — mixes English with target-language words. */
  openingLine: string;
  /** How the teacher wraps up and praises the learner. */
  closingLine: string;
  /** How to handle mistakes, pacing, and encouragement. */
  correctionStyle: string;
  /** Vocabulary to weave into the conversation (ids from this lesson). */
  vocabularyIds: VocabularyId[];
  /** Phrases to teach and get the learner to say (ids from this lesson). */
  phraseIds: PhraseId[];
}

/* -------------------------------------------------------------------------- */
/* Lessons                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Lesson artwork: an image from `constants/images.ts`, or a remote placeholder
 * while the real illustration is missing.
 */
export type LessonArtwork =
  | { kind: "asset"; name: ImageName }
  | { kind: "remote"; uri: string };

/** One lesson inside a unit. */
export interface Lesson {
  id: LessonId;
  unitId: UnitId;
  languageId: LanguageId;
  /** 1-based position inside the unit. Rendered as "Lesson 3". */
  order: number;
  title: string;
  /** Short line under the title on the lesson card. */
  description: string;
  estimatedMinutes: number;
  xpReward: number;
  artwork: LessonArtwork;
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  goals: LessonGoal;
  activities: LessonActivity[];
  aiTeacher: AiTeacherPrompt;
}
