import { Text, View } from "react-native";

import { colors, shadows } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/07-audio-lesson-screen.png`,
 * converted to points at the reference scale S = 652px / 390pt = 1.6718.
 * ------------------------------------------------------------------------ */
const GUTTER = 23; // the card sits wider than the header, narrower than the stage
const RADIUS = 20; // 35px
const PADDING_V = 26;
/** Every line shares one leading, which is what spaces a label off its value. */
const LINE_HEIGHT = 30;
/**
 * Either side of a rule. The design has room for 24 here because its own face
 * is narrower than Poppins; 16 is what keeps "Pronunciation" on one line on the
 * narrowest phone the app runs on.
 */
const COLUMN_PADDING = 16;
const RULE_WIDTH = 1;
/** Measured off the design's rule — a shade cooler than the neutral border. */
const RULE_COLOR = "#EAECF2";

/**
 * Two of the verdict colours are design-system tokens; "Excellent" is the same
 * yellower green the lesson list ticks a finished lesson with.
 */
const EXCELLENT_GREEN = "#64C039";

type Feedback = {
  label: string;
  verdict: string;
  color: string;
  /**
   * How wide the column is relative to the others. The design hugs every column
   * to its own word — "Pronunciation" is a long one — so these are the measured
   * column widths rather than three equal thirds.
   */
  weight: number;
};

/**
 * What the teacher made of the learner's turn. Stand-in readings until a live
 * session scores them: the design's own three, in the order it shows them.
 */
const FEEDBACK: Feedback[] = [
  {
    label: "Speaking",
    verdict: "Excellent",
    color: EXCELLENT_GREEN,
    weight: 106,
  },
  { label: "Pronunciation", verdict: "Great", color: colors.info, weight: 133 },
  {
    label: "Grammar",
    verdict: "Good",
    color: colors["primary-deep"],
    weight: 104,
  },
];

/**
 * The teacher's read on the session so far: how the learner is speaking, how
 * their pronunciation is landing, and how their grammar is holding up.
 *
 * It sits flush under the stage — the design butts the two together, which is
 * what squares off the stage's bottom corners.
 */
export default function LessonFeedbackCard() {
  return (
    <View
      className="flex-row"
      style={{
        marginHorizontal: GUTTER,
        borderRadius: RADIUS,
        backgroundColor: colors.background,
        ...shadows.card,
      }}
    >
      {FEEDBACK.map((reading, index) => (
        <View
          key={reading.label}
          className="flex-row"
          style={{ flex: reading.weight }}
        >
          {/* A rule rather than a border: the card's own edges stay clean. */}
          {index > 0 ? (
            <View
              style={{
                width: RULE_WIDTH,
                marginVertical: PADDING_V,
                backgroundColor: RULE_COLOR,
              }}
            />
          ) : null}

          <View
            className="flex-1"
            style={{
              paddingHorizontal: COLUMN_PADDING,
              paddingVertical: PADDING_V,
            }}
          >
            <Text
              numberOfLines={1}
              className="text-[12px] font-poppins-semibold text-ink"
              style={{ lineHeight: LINE_HEIGHT }}
            >
              {reading.label}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[12px] font-poppins-medium"
              style={{ lineHeight: LINE_HEIGHT, color: reading.color }}
            >
              {reading.verdict}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
