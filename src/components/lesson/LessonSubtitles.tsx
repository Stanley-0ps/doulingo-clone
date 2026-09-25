import { Text, View } from "react-native";

import { colors } from "@/theme";
import type { Phrase } from "@/types/learning";

/* ---------------------------------------------------------------------------
 * Design grid — the panel takes the caption bubble's slot in the stage, so it
 * keeps the bubble's width band.
 * ------------------------------------------------------------------------ */
const RADIUS = 15;
const PADDING_H = 18;
const PADDING_V = 16;
const TITLE_GAP = 2;
const GOAL_GAP = 6;
/** One line of target language plus its English, then air before the next. */
const ROW_GAP = 10;
const PHRASE_LINE = 19;
const TRANSLATION_LINE = 17;
/** Three phrases is what stays legible over the stage — and over a lesson. */
const MAX_PHRASES = 3;

const SLATE = "#585E86";

type LessonSubtitlesProps = {
  /** Which lesson this is, e.g. "Spanish · Lesson 1". */
  eyebrow: string;
  /** The lesson's own title. */
  title: string;
  /** What the learner will be able to do by the end. */
  goal: string;
  /** The phrases the teacher is working through, in teaching order. */
  phrases: Phrase[];
};

/**
 * What the teacher is saying and what she wants the learner to say — the
 * written script of the audio lesson.
 *
 * This is what the Subtitles control switches on: the caption bubble shows one
 * line as it is spoken, and this panel lays out the phrases the lesson is
 * built around so the learner can read ahead.
 */
export default function LessonSubtitles({
  eyebrow,
  title,
  goal,
  phrases,
}: LessonSubtitlesProps) {
  return (
    <View
      className="self-center"
      style={{
        marginHorizontal: 50,
        maxWidth: 270,
        paddingHorizontal: PADDING_H,
        paddingVertical: PADDING_V,
        borderRadius: RADIUS,
        backgroundColor: colors.background,
      }}
    >
      <Text
        numberOfLines={1}
        className="text-[11px] font-poppins-semibold"
        style={{ lineHeight: 15, color: SLATE }}
      >
        {eyebrow}
      </Text>

      <Text
        numberOfLines={1}
        className="text-[13px] font-poppins-semibold text-ink"
        style={{ marginTop: TITLE_GAP, lineHeight: 18 }}
      >
        {title}
      </Text>

      <Text
        numberOfLines={2}
        className="text-[13px] font-poppins-medium text-ink"
        style={{ marginTop: GOAL_GAP, lineHeight: 18 }}
      >
        {goal}
      </Text>

      <View style={{ marginTop: GOAL_GAP }}>
        {phrases.slice(0, MAX_PHRASES).map((phrase) => (
          <View key={phrase.id} style={{ marginTop: ROW_GAP }}>
            <Text
              numberOfLines={1}
              className="text-[13px] font-poppins-semibold text-ink"
              style={{ lineHeight: PHRASE_LINE }}
            >
              {phrase.text}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[12px] font-poppins"
              style={{ lineHeight: TRANSLATION_LINE, color: SLATE }}
            >
              {phrase.translation}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
