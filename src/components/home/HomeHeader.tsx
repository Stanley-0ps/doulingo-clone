import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

import { images } from "@/constants/images";
import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid
 *
 * Measured off `prompt_material/05-home-and-tab-navigation.png`, converted to
 * points at the reference scale S = 520px / 390pt = 1.3333. Values ride in
 * `style` rather than as arbitrary Tailwind classes because a class name has to
 * be a static string — NativeWind cannot read a value out of a constant.
 * ------------------------------------------------------------------------ */
const FLAG_SIZE = 33; // 44px — flag disc at the far left
const GREETING_GAP = 13; // flag → "Hola, Alex!"
const WAVE_GAP = 6; // greeting → the waving hand
const STREAK_GAP = 11; // flame → the day count
const BELL_GAP = 26; // day count → the bell

/**
 * The streak icon ships as a 1024px square holding a campfire *and* the patch
 * of grass it burns on; the design shows only the flame. These fractions locate
 * the flame inside that square, so a clipping box of the design's size can show
 * it on its own.
 */
const FLAME_ASSET = 42; // square the asset is drawn at, in points
const FLAME_LEFT = 0.2598; // flame's left edge, as a fraction of the square
const FLAME_TOP = 0.1768; // flame's top edge
const FLAME_WIDTH = 21.4; // 29px — what the clip shows
const FLAME_HEIGHT = 24.5; // 33px

/** Ionicons draws to roughly the design's 27 × 30px bell at this size. */
const BELL_SIZE = 24;

type HomeHeaderProps = {
  /** "Hola" — the greeting in the language the learner is studying. */
  greeting: string;
  /** The learner's first name, from Clerk. */
  firstName: string;
  /** Country flag of the active course. */
  flagUri: string;
  /** Consecutive days practised. */
  streakDays: number;
};

/**
 * Home screen header: who the learner is, what they are learning, and the two
 * things worth glancing at — their streak and their notifications.
 */
export default function HomeHeader({
  greeting,
  firstName,
  flagUri,
  streakDays,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center">
      {/* expo-image is not a `react-native` import, so NativeWind's className
          polyfill never reaches it — it is sized with `style`. */}
      <Image
        source={{ uri: flagUri }}
        contentFit="cover"
        style={{
          width: FLAG_SIZE,
          height: FLAG_SIZE,
          borderRadius: FLAG_SIZE / 2,
        }}
      />

      {/* Greeting and streak both size themselves, so the greeting gives way
          first when a name runs long. */}
      <Text
        numberOfLines={1}
        className="shrink text-[16px] font-poppins-semibold leading-[1.4] text-ink"
        style={{ marginLeft: GREETING_GAP }}
      >
        {greeting}, {firstName}!
      </Text>
      <Text className="text-[18px]" style={{ marginLeft: WAVE_GAP }}>
        👋
      </Text>

      <View className="flex-1" />

      <FlameIcon />
      <Text
        className="text-[16px] font-poppins-medium leading-[1.4] text-ink"
        style={{ marginLeft: STREAK_GAP }}
      >
        {streakDays}
      </Text>

      {/* No notifications screen yet, so this is a target the layout needs
          rather than a control that goes anywhere. It is a plain `View` for
          that reason: a `Pressable` with no `onPress` still announces itself as
          a button to a screen reader, promising an action that never comes. */}
      <View style={{ marginLeft: BELL_GAP }}>
        <Ionicons
          name="notifications-outline"
          size={BELL_SIZE}
          color={colors.ink}
        />
      </View>
    </View>
  );
}

/** The streak count's flame, clipped out of the campfire artwork. */
function FlameIcon() {
  return (
    <View
      className="overflow-hidden"
      style={{ width: FLAME_WIDTH, height: FLAME_HEIGHT }}
    >
      <Image
        source={images.streakFire}
        contentFit="contain"
        style={{
          position: "absolute",
          left: -FLAME_ASSET * FLAME_LEFT,
          top: -FLAME_ASSET * FLAME_TOP,
          width: FLAME_ASSET,
          height: FLAME_ASSET,
        }}
      />
    </View>
  );
}
