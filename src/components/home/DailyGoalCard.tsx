import { Image } from "expo-image";
import { Text, View } from "react-native";

import { images } from "@/constants/images";

/* ---------------------------------------------------------------------------
 * Design grid — same reference frame as the rest of the home screen:
 * S = 520px / 390pt = 1.3333.
 * ------------------------------------------------------------------------ */
const CARD_HEIGHT = 118; // 157px
const PADDING_LEFT = 20; // 27px — "Daily goal" and the bar's left edge
const PADDING_RIGHT = 8; // 10px — keeps the chest's glow in from the corner
const LABEL_GAP = 9; // "Daily goal" → "15 / 20 XP"
const BAR_GAP = 16; // XP row → the bar
const BAR_WIDTH = 193; // 257px — the design stops the bar short of the chest
const BAR_HEIGHT = 9; // 12px
/**
 * The chest is drawn inside a square asset with transparent bands around it.
 * 109pt is the square that lands the visible chest at the design's 114 × 106px
 * without cropping it.
 */
const TREASURE_SIZE = 109;

const CARD_COLOR = "#FDF7EF"; // Cream card background
const TRACK_COLOR = "#FBE9D1"; // Unfilled part of the bar
const FILL_COLOR = "#EF8E35"; // Filled part — warmer than the `streak` token
/**
 * "/ 20 XP" is a slate that leans bluer than the design system's `muted`, which
 * is why this is not that token.
 */
const XP_LABEL_COLOR = "#4A5A71";

type DailyGoalCardProps = {
  /** XP earned today. */
  earnedXp: number;
  /** XP the learner is aiming for today. */
  goalXp: number;
  /** Share of the goal already earned, 0–1. */
  progress: number;
};

/**
 * The daily-goal card: today's XP against its target, with a chest that stands
 * for the reward at the end of it.
 */
export default function DailyGoalCard({
  earnedXp,
  goalXp,
  progress,
}: DailyGoalCardProps) {
  return (
    <View
      className="flex-row items-center rounded-card"
      style={{
        height: CARD_HEIGHT,
        paddingLeft: PADDING_LEFT,
        paddingRight: PADDING_RIGHT,
        backgroundColor: CARD_COLOR,
      }}
    >
      <View className="flex-1 justify-center">
        <Text className="text-[14px] font-poppins-medium leading-[1.4] text-ink">
          Daily goal
        </Text>

        {/* Baseline-aligned rather than bottom-aligned: the count and its unit
            sit on the same line of writing, not the same box edge. */}
        <View
          className="flex-row items-baseline"
          style={{ marginTop: LABEL_GAP }}
        >
          <Text className="text-[26px] font-poppins-bold leading-[1.1] text-ink">
            {earnedXp}
          </Text>
          <Text
            className="text-[15px] font-poppins leading-[1.4]"
            style={{ marginLeft: 8, color: XP_LABEL_COLOR }}
          >
            / {goalXp} XP
          </Text>
        </View>

        <View
          className="overflow-hidden rounded-full"
          style={{
            marginTop: BAR_GAP,
            width: BAR_WIDTH,
            height: BAR_HEIGHT,
            backgroundColor: TRACK_COLOR,
          }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: BAR_WIDTH * progress,
              backgroundColor: FILL_COLOR,
            }}
          />
        </View>
      </View>

      <Image
        source={images.treasure}
        contentFit="contain"
        style={{ width: TREASURE_SIZE, height: TREASURE_SIZE }}
      />
    </View>
  );
}
