import { Image } from "expo-image";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

/**
 * Exact colors sampled from the `02-onboarding-screen` design.
 * Sized in dp for a typical phone (design is 546×1388, scale ≈ 0.714).
 */
const COLORS = {
  ink: "#17172B", // near-black headline / greeting text
  purple: "#5841EC", // accent word + primary button
  muted: "#6E6E80", // subtitle gray
  helloBg: "#EAF1FA", // "Hello!" bubble fill
  holaBg: "#E9EAFB", // "¡Hola!" bubble fill
  nihaoBg: "#FCEDE8", // "你好!" bubble fill
  nihaoText: "#EA3C2A", // "你好!" text (red-orange)
  groundShadow: "rgba(0, 0, 0, 0.08)",
} as const;

/**
 * A small greeting speech bubble with a pointer tail.
 * Kept local to this screen because it is only used here.
 */
function SpeechBubble({
  text,
  backgroundColor,
  textColor,
  tail,
  bubbleStyle,
}: {
  text: string;
  backgroundColor: string;
  textColor: string;
  /** Which edge the pointer tail hangs off of. */
  tail: "top-left" | "top-right" | "left";
  bubbleStyle?: object;
}) {
  const tailByEdge = {
    "top-left": { bottom: -5, left: 18 },
    "top-right": { bottom: -5, right: 18 },
    left: { left: -5, top: 14 },
  }[tail];

  return (
    <View style={bubbleStyle}>
      <View
        className="rounded-2xl px-3.5 py-1.5"
        style={{ backgroundColor }}
      >
        <Text
          className="text-[16px] font-poppins-medium"
          style={{ color: textColor }}
        >
          {text}
        </Text>
      </View>
      {/* Pointer tail = a small rotated square of the bubble color. */}
      <View
        className="absolute h-2.5 w-2.5 rotate-45"
        style={{ backgroundColor, ...tailByEdge }}
      />
    </View>
  );
}

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();

  // Keep the mascot comfortably inside the vertical space between the
  // copy block and the button on any screen size.
  const mascotSize = Math.min(width * 0.88, height * 0.42, 360);

  const onGetStarted = () => {
    // Placeholder for feature 04: this will navigate to the sign-up screen.
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header lockup: mascot-logo mark + app name */}
        <View className="flex-row items-center justify-center gap-2.5 px-10 pt-2">
          <Image
            source={images.mascotLogo}
            style={{ width: 56, height: 56 }}
            contentFit="contain"
          />
          <Text className="text-[30px] font-poppins-bold tracking-tight text-[#17172B]">
            Domingo
          </Text>
        </View>

        {/* Headline (left aligned, matching the design) */}
        <View className="px-10 pt-8">
          <Text className="text-[30px] font-poppins-bold leading-[1.15] text-[#17172B]">
            Your AI language{"\n"}
            <Text className="text-[#5841EC]">teacher</Text>.
          </Text>
        </View>

        {/* Sub-headline */}
        <View className="px-10 pt-3">
          <Text className="text-[15px] leading-[1.5] text-[#6E6E80]">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Illustration: waving fox mascot + floating greetings */}
        <View className="flex-1 items-center justify-center px-6">
          <View style={{ width: mascotSize, height: mascotSize }}>
            {/* Soft contact shadow under the mascot's feet */}
            <View
              className="absolute bottom-[2%] h-2 w-1/2 rounded-full"
              style={{ backgroundColor: COLORS.groundShadow }}
            />
            <Image
              source={images.mascotWelcome}
              className="h-full w-full"
              contentFit="contain"
            />

            <SpeechBubble
              text="Hello!"
              backgroundColor={COLORS.helloBg}
              textColor={COLORS.ink}
              tail="top-left"
              bubbleStyle={{ position: "absolute", top: "1%", left: 0 }}
            />
            <SpeechBubble
              text="¡Hola!"
              backgroundColor={COLORS.holaBg}
              textColor={COLORS.purple}
              tail="top-right"
              bubbleStyle={{ position: "absolute", top: "6%", right: 0 }}
            />
            <SpeechBubble
              text="你好!"
              backgroundColor={COLORS.nihaoBg}
              textColor={COLORS.nihaoText}
              tail="left"
              bubbleStyle={{ position: "absolute", top: "52%", right: 2 }}
            />
          </View>
        </View>

        {/* Primary CTA */}
        <View className="px-7 pb-5 pt-4">
          <Pressable
            onPress={onGetStarted}
            className="flex-row items-center rounded-[22px] bg-[#5841EC] px-6 py-[18px] active:opacity-85"
          >
            <View className="flex-1 items-center">
              <Text className="text-[19px] font-poppins-bold text-white">
                Get Started
              </Text>
            </View>
            <Text className="text-[28px] font-bold leading-none text-white">
              ›
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
