import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "@/constants/images";

/**
 * A small greeting speech bubble with a pointer tail.
 * Colors are passed as NativeWind class names (fill + text) so every style
 * value lives in tailwind syntax rather than inline styles. Kept local to
 * this screen because it is only used here.
 */
function SpeechBubble({
  text,
  tail,
  bubbleClassName,
  fillClassName,
  textClassName,
}: {
  text: string;
  /** Which edge the pointer tail hangs off of. */
  tail: "top-left" | "top-right" | "left";
  /** Positioning of the whole bubble, e.g. "absolute top-[1%] left-0". */
  bubbleClassName: string;
  /** Fill color, shared by the bubble body and its tail, e.g. "bg-[#EAF1FA]". */
  fillClassName: string;
  /** Text color, e.g. "text-[#17172B]". */
  textClassName: string;
}) {
  const tailClassName = {
    "top-left": "-bottom-[5px] left-[18px]",
    "top-right": "-bottom-[5px] right-[18px]",
    left: "-left-[5px] top-[14px]",
  }[tail];

  return (
    <View className={bubbleClassName}>
      <View className={`rounded-2xl px-3.5 py-1.5 ${fillClassName}`}>
        <Text className={`text-[16px] font-poppins-medium ${textClassName}`}>
          {text}
        </Text>
      </View>
      {/* Pointer tail = a small rotated square of the bubble color. */}
      <View
        className={`absolute h-2.5 w-2.5 rotate-45 ${fillClassName} ${tailClassName}`}
      />
    </View>
  );
}

export default function OnboardingScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const posthog = usePostHog();

  // Reserve the fixed vertical regions that already exist in the screen's
  // layout: the header lockup, headline/subheadline copy, the bottom CTA,
  // and the top/bottom safe-area insets. That leaves the mascot a height
  // budget derived from the remaining screen area so the CTA remains visible
  // on short screens without forcing a scroll.
  const reservedHeight =
    insets.top +
    insets.bottom +
    56 +
    76 +
    80 +
    74 +
    28;
  const availableMascotHeight = height - insets.top - insets.bottom - reservedHeight;

  // The mascot is the hero of the onboarding screen. In the reference design
  // it is the largest element on screen, so size it primarily from screen
  // width and clamp it against the remaining vertical budget so it always
  // fits between the copy block and the button. Note the square canvas only
  // fills ~61% of its own width with the actual fox, so the container must
  // be generous for the fox to appear large (the extra margin is transparent).
  const mascotSize = Math.min(
    width * 0.88,
    Math.max(availableMascotHeight, 120),
  );

  // Onboarding is the signed-out entry point, so anyone with a live session
  // belongs on the home route instead.
  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  const onGetStarted = () => {
    posthog.capture("onboarding_started", { destination: "sign_up" });
    router.push("/sign-up");
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header lockup: mascot-logo mark + app name */}
        <View className="flex-row items-center justify-center gap-2.5 px-10 pt-2">
          {/* Sized with `style`: NativeWind's className polyfill only covers
              `react-native` imports, not expo-image. */}
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
          {/* Container sized at runtime (mascotSize) so it stays an inline style. */}
          <View style={{ width: mascotSize, height: mascotSize }}>
            {/* Soft contact shadow under the mascot's feet */}
            <View className="absolute bottom-[6%] h-2 w-1/2 rounded-full bg-[rgba(0,0,0,0.08)]" />
            {/* The mascot size is derived from the screen dimensions and the
                fox sits ~3.9% below its square canvas center, so both the size
                and the centering nudge stay as inline styles (AGENTS.md). */}
            <Image
              source={images.mascotWelcome}
              style={{
                width: mascotSize,
                height: mascotSize,
                transform: [{ translateY: -mascotSize * 0.039 }],
              }}
              contentFit="contain"
            />

            {/* Greeting bubbles — colors sampled from the `02-onboarding-screen` design. */}
            <SpeechBubble
              text="Hello!"
              tail="top-left"
              bubbleClassName="absolute top-[1%] left-0"
              fillClassName="bg-[#EAF1FA]"
              textClassName="text-[#17172B]"
            />
            <SpeechBubble
              text="¡Hola!"
              tail="top-right"
              bubbleClassName="absolute top-[6%] right-0"
              fillClassName="bg-[#E9EAFB]"
              textClassName="text-[#5841EC]"
            />
            <SpeechBubble
              text="你好!"
              tail="left"
              bubbleClassName="absolute top-[52%] right-[2px]"
              fillClassName="bg-[#FCEDE8]"
              textClassName="text-[#EA3C2A]"
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
