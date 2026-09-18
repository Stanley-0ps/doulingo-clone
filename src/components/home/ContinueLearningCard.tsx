import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";
import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — same reference frame as the rest of the home screen:
 * S = 520px / 390pt = 1.3333.
 * ------------------------------------------------------------------------ */
const CARD_HEIGHT = 160; // 214px
const PADDING_LEFT = 20; // 25px — every line starts here
const PADDING_TOP = 18; // card top → "Continue learning"
const NAME_GAP = 10; // "Continue learning" → the language name
const LEVEL_GAP = 4; // language name → "A1 • Unit 1"
const BUTTON_GAP = 13; // "A1 • Unit 1" → the button
const BUTTON_WIDTH = 92; // 123px
const BUTTON_HEIGHT = 35; // 47px

/**
 * The church is drawn inside a square asset with transparent bands around it.
 * 157pt is the square that lands the visible building at the design's size,
 * sitting off the card's bottom-right corner — the card clips what overhangs,
 * which is what puts the grass on its bottom edge.
 */
const PALACE_SIZE = 157;
const PALACE_TOP = 8;
const PALACE_RIGHT = -7;

const CARD_COLOR = "#5742EB"; // The design's deeper purple, not the `primary` token

type ContinueLearningCardProps = {
  /** Name of the course — "Spanish". */
  languageName: string;
  /** CEFR level of the current unit — "A1". */
  level: string;
  /** 1-based position of the current unit — rendered as "Unit 1". */
  unitOrder: number;
  onPress: () => void;
};

/**
 * The hero card: where the learner is in their course, and the way back into
 * it. Purple, because it is the one thing on the screen that moves them
 * forward.
 */
export default function ContinueLearningCard({
  languageName,
  level,
  unitOrder,
  onPress,
}: ContinueLearningCardProps) {
  return (
    <View
      className="overflow-hidden rounded-card"
      style={{ height: CARD_HEIGHT, backgroundColor: CARD_COLOR }}
    >
      {/* Artwork first so the text below layers on top of it. */}
      <Image
        source={images.palace}
        contentFit="contain"
        style={{
          position: "absolute",
          top: PALACE_TOP,
          right: PALACE_RIGHT,
          width: PALACE_SIZE,
          height: PALACE_SIZE,
        }}
      />

      <View
        className="flex-1 items-start"
        style={{ paddingLeft: PADDING_LEFT, paddingTop: PADDING_TOP }}
      >
        <Text className="text-[15px] font-poppins-medium leading-[1.4] text-white">
          Continue learning
        </Text>

        <Text
          numberOfLines={1}
          className="text-[21px] font-poppins-bold leading-[1.2] text-white"
          style={{ marginTop: NAME_GAP }}
        >
          {languageName}
        </Text>

        <Text
          className="text-[17px] font-poppins leading-[1.4] text-white"
          style={{ marginTop: LEVEL_GAP }}
        >
          {level} • Unit {unitOrder}
        </Text>

        {/* White on the card, purple label: the card itself is the colour, so
            the button reads as the cut-out the learner presses. */}
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Continue learning ${languageName}`}
          className="items-center justify-center rounded-full bg-white active:opacity-85"
          style={{
            marginTop: BUTTON_GAP,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
          }}
        >
          <Text
            className="text-[14px] font-poppins-semibold"
            style={{ color: colors["primary-deep"] }}
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
