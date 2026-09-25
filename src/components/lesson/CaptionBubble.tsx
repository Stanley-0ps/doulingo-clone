import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/07-audio-lesson-screen.png`,
 * converted to points at the reference scale S = 652px / 390pt = 1.6718.
 * ------------------------------------------------------------------------ */
const MIN_WIDTH = 241; // 403px — the bubble the design draws, text and icon
/** Wide enough for the longest line a teacher realistically says in one turn. */
const MAX_WIDTH = 270;
const RADIUS = 15;
const PADDING_LEFT = 17;
const PADDING_RIGHT = 18;
const PADDING_V = 15;
const LINE_HEIGHT = 29; // both lines sit on the same generous leading
const SPEAKER_GAP = 16;
/** The purple speaker the learner taps to hear the line again. */
const SPEAKER_SIZE = 22;
const TAIL_SIZE = 20; // 24px square, rotated — only its tip shows
const TAIL_BOTTOM = -10;
const TAIL_RIGHT = 14;

type CaptionBubbleProps = {
  /** What the teacher just said, in the language being learned. */
  line: string;
  /** The same line in English. */
  translation: string;
};

/**
 * The teacher's line, captioned under her as she says it.
 *
 * This is the session's live transcript: a real agent session will feed the
 * same two lines from the audio stream, so nothing about the bubble changes
 * when Stream is wired up — only where the text comes from.
 */
export default function CaptionBubble({
  line,
  translation,
}: CaptionBubbleProps) {
  return (
    <View className="items-center" style={{ marginHorizontal: 50 }}>
      <View
        className="flex-row items-center justify-between"
        style={{
          minWidth: MIN_WIDTH,
          maxWidth: MAX_WIDTH,
          paddingLeft: PADDING_LEFT,
          paddingRight: PADDING_RIGHT,
          paddingVertical: PADDING_V,
          borderRadius: RADIUS,
          backgroundColor: colors.background,
        }}
      >
        {/* A rotated square: the bubble covers all but its bottom corner. */}
        <View
          style={{
            position: "absolute",
            bottom: TAIL_BOTTOM,
            right: TAIL_RIGHT,
            width: TAIL_SIZE,
            height: TAIL_SIZE,
            backgroundColor: colors.background,
            transform: [{ rotate: "45deg" }],
          }}
        />

        {/* Shrinks rather than grows: a short line keeps the design's bubble
            and a long one widens it, up to the cap, then wraps. */}
        <View style={{ flexShrink: 1 }}>
          <Text
            className="text-[17px] font-poppins text-ink"
            style={{ lineHeight: LINE_HEIGHT }}
          >
            {line}
          </Text>
          <Text
            className="text-[17px] font-poppins text-ink"
            style={{ lineHeight: LINE_HEIGHT }}
          >
            {translation}
          </Text>
        </View>

        <Ionicons
          name="volume-high"
          size={SPEAKER_SIZE}
          color={colors["primary-deep"]}
          accessibilityLabel="Replay the line"
          style={{ marginLeft: SPEAKER_GAP }}
        />
      </View>
    </View>
  );
}
