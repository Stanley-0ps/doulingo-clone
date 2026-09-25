import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/06-lesson-screen.png`, converted
 * to points at the reference scale S = 546px / 390pt = 1.4.
 * ------------------------------------------------------------------------ */
const TOP_GAP = 20; // safe area → the title's first letter
/**
 * The chevron glyph is only 0.375em wide, so its box is pulled left until the
 * *ink* — not the box — starts on the page gutter. Same trick on the ribbon.
 */
const CHEVRON_INSET = -10;
const CHEVRON_SIZE = 30; // 42px glyph box, 12px of ink
const CHEVRON_TOP = 4; // the chevron centres on the title line, not the block
const TITLE_GAP = 18; // chevron box → "At the Café"
const TITLE_LINE = 22;
const SUBTITLE_GAP = 6;
const SUBTITLE_LINE = 18;
const RIBBON_SIZE = 30; // 42px box, 19×24px of ribbon
const RIBBON_TOP = 5;
const RIBBON_INSET = -3;
const RIBBON_BAND = 10; // the orange slice at the top of the ribbon

/** Ribbon colours, sampled from the design's bookmark. */
const RIBBON_ORANGE = "#F3AE3F";
const RIBBON_NAVY = "#2B3A66";

/**
 * The violet-leaning slate every secondary line in the design uses. Noticeably
 * bluer than the design system's neutral `muted`, so it keeps its own constant
 * — the same call `PlanRow` and the tab bar make.
 */
const SLATE = "#585E86";

type LessonHeaderProps = {
  /** Title of the lesson the learner has selected. */
  title: string;
  unitOrder: number;
  /** 1-based position of the lesson they are on — the "3" in "3 / 6 lessons". */
  reachedCount: number;
  totalLessons: number;
  onBack: () => void;
};

/**
 * The lesson screen's header: the way back, which lesson is open, and how far
 * into the unit the learner is.
 */
export default function LessonHeader({
  title,
  unitOrder,
  reachedCount,
  totalLessons,
  onBack,
}: LessonHeaderProps) {
  return (
    <View style={{ paddingTop: TOP_GAP }}>
      <View className="flex-row items-start">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          className="active:opacity-60"
          style={{ marginLeft: CHEVRON_INSET, marginTop: CHEVRON_TOP }}
        >
          <Ionicons name="chevron-back" size={CHEVRON_SIZE} color={colors.ink} />
        </Pressable>

        <View className="flex-1" style={{ marginLeft: TITLE_GAP }}>
          <Text
            numberOfLines={1}
            className="text-[17px] font-poppins-bold text-ink"
            style={{ lineHeight: TITLE_LINE }}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            className="text-[14px] font-poppins"
            style={{
              marginTop: SUBTITLE_GAP,
              lineHeight: SUBTITLE_LINE,
              color: SLATE,
            }}
          >
            Unit {unitOrder} • {reachedCount} / {totalLessons} lessons
          </Text>
        </View>

        <View style={{ marginRight: RIBBON_INSET, marginTop: RIBBON_TOP }}>
          <RibbonButton />
        </View>
      </View>
    </View>
  );
}

/**
 * The ribbon at the top right. It reads as one bookmark with an orange slice
 * across the top: an orange ribbon, and a white one clipped to everything below
 * the slice.
 *
 * Saving is local for now — there is no saved-lessons store to read from yet,
 * so tapping only proves the control is wired up.
 */
function RibbonButton() {
  const [saved, setSaved] = useState(false);

  return (
    <Pressable
      onPress={() => setSaved((current) => !current)}
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from saved" : "Save lesson"}
      accessibilityState={{ selected: saved }}
      className="active:opacity-70"
      style={{ width: RIBBON_SIZE, height: RIBBON_SIZE }}
    >
      <Ionicons
        name="bookmark"
        size={RIBBON_SIZE}
        color={RIBBON_ORANGE}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* Clipping is what turns two full ribbons into one two-tone ribbon. */}
      <View
        style={{
          position: "absolute",
          top: RIBBON_BAND,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <Ionicons
          name="bookmark"
          size={RIBBON_SIZE}
          color={saved ? RIBBON_ORANGE : "#FFFFFF"}
          style={{ position: "absolute", top: -RIBBON_BAND, left: 0 }}
        />
        <Ionicons
          name="bookmark-outline"
          size={RIBBON_SIZE}
          color={RIBBON_NAVY}
          style={{ position: "absolute", top: -RIBBON_BAND, left: 0 }}
        />
      </View>
    </Pressable>
  );
}
