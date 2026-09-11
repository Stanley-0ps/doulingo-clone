import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import type { Language } from "@/types/learning";

/* ---------------------------------------------------------------------------
 * Design grid
 *
 * Every number below is measured off
 * `prompt_material/04-language-selection-screen.png`, converted to points at
 * the reference scale S = 574px / 390pt = 1.4718.
 *
 * The list is a stack of 80pt slots. An unselected row fills its slot; the
 * selected one becomes a 76pt card inset by 2pt, so the rows below it never
 * move when the selection changes.
 * ------------------------------------------------------------------------ */
const ROW_HEIGHT = 80; // 118px
const CARD_HEIGHT = 76; // 112px
const CARD_MARGIN = 2; // (ROW_HEIGHT - CARD_HEIGHT) / 2
const FLAG_SIZE = 36; // 53px circle
const SIDE_PADDING = 12; // flag and chevron inset from the list's edge
const TEXT_GAP = 18; // flag edge → language name (98px from the list's edge)
const CHECK_SIZE = 24; // 36px purple disc on the selected row
const DIVIDER_INSET = 15; // 22px — the hairline stops short of both edges

type LanguageRowProps = {
  language: Language;
  selected: boolean;
  onPress: () => void;
};

/**
 * One row of the language list.
 *
 * The row behaves like a radio: tapping it selects the language, and the
 * selected row turns into the tinted, purple-bordered card from the design
 * with a check badge in place of the chevron.
 */
export default function LanguageRow({
  language,
  selected,
  onPress,
}: LanguageRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${language.name}, ${language.learners}`}
      className={`flex-row items-center ${
        selected
          ? "rounded-card border-[1.5px] border-primary bg-[#F8F8FD]"
          : "active:opacity-60"
      }`}
      // Height and padding are measured values, so they ride in `style` next
      // to the class names (see the StyleSheet exceptions in AGENTS.md).
      style={{
        height: selected ? CARD_HEIGHT : ROW_HEIGHT,
        marginVertical: selected ? CARD_MARGIN : 0,
        paddingHorizontal: SIDE_PADDING,
      }}
    >
      {/* expo-image is not a `react-native` import, so NativeWind's className
          polyfill never reaches it — it has to be sized with `style`. */}
      <Image
        source={{ uri: language.flag }}
        style={{
          width: FLAG_SIZE,
          height: FLAG_SIZE,
          borderRadius: FLAG_SIZE / 2,
        }}
        contentFit="cover"
      />

      <View className="flex-1" style={{ marginLeft: TEXT_GAP }}>
        {/* Line heights are set explicitly rather than through the `text-h4` /
            `text-body` utilities: the design stacks these two lines 5.5pt
            apart, which the type scale's 1.6 leading cannot express. */}
        <Text
          numberOfLines={1}
          className="text-[16px] font-poppins-semibold leading-[1.4] text-ink"
        >
          {language.name}
        </Text>
        <Text
          numberOfLines={1}
          className="mt-[5.5px] text-[14px] font-poppins leading-[1.4] text-muted"
        >
          {language.learners}
        </Text>
      </View>

      {selected ? <CheckBadge /> : <RowChevron />}

      {/* Rows are separated by a hairline that stops 15pt short of each edge;
          the selected card draws its own border instead. */}
      {selected ? null : (
        <View
          className="absolute bottom-0 h-px bg-[#F0F0F2]"
          style={{ left: DIVIDER_INSET, right: DIVIDER_INSET }}
        />
      )}
    </Pressable>
  );
}

/**
 * Purple disc with a white tick, shown on the selected row.
 *
 * The tick is an "L" of two borders rotated 45° rather than an icon font or a
 * new asset — the same trick the auth screen uses for its chevron.
 */
function CheckBadge() {
  return (
    <View
      className="mr-[6px] items-center justify-center rounded-full bg-primary"
      style={{ width: CHECK_SIZE, height: CHECK_SIZE }}
    >
      <View className="h-[7px] w-[12px] rotate-[-45deg] border-b-[2.5px] border-l-[2.5px] border-white" />
    </View>
  );
}

/**
 * Chevron on an unselected row: two rounded bars sharing a corner, pointing
 * right (the mirror of the header's back chevron). The design's glyph is
 * 12 × 19px — taller than it is wide, which one rotated square of border
 * cannot express.
 */
function RowChevron() {
  return (
    <View className="h-[24px] w-[24px] items-center justify-center">
      <View className="relative h-[10.3px] w-[6.6px]">
        <View className="absolute left-[2.7px] top-[-1.5px] h-[8.2px] w-[1.5px] rotate-[-51deg] rounded-full bg-muted" />
        <View className="absolute left-[2.7px] top-[3.6px] h-[8.2px] w-[1.5px] rotate-[51deg] rounded-full bg-muted" />
      </View>
    </View>
  );
}
