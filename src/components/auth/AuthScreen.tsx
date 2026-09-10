import { useState } from "react";
import { Image } from "expo-image";
import { Link, useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

import AuthTextField from "./AuthTextField";
import SocialAuthButton from "./SocialAuthButton";
import VerificationModal from "./VerificationModal";

/* ---------------------------------------------------------------------------
 * Design grid
 *
 * Every number below is measured off `prompt_material/03-auth-screen.png`,
 * converted to points at the reference scale S = 558px / 390pt = 1.4308.
 * Read them as "distance from the top of the design frame" and keep the flow
 * order the same as the design's vertical order.
 * ------------------------------------------------------------------------ */
const CONTENT_PADDING = 30; // pt — all content is inset 30pt from each edge
const FOX_SIZE = 192.9; // mascot square canvas
const FOX_OFFSET_X = -6.25; // mascot centre sits just left of screen centre
const FOX_OFFSET_Y = -7.2; // canvas top sits above the band, tucked under the subtitle
const SPARKLES = [
  { left: -94.25, top: 43.45, width: 14, height: 15.4, color: "#F2B000" },
  { left: 90.5, top: 51.15, width: 13.3, height: 14, color: "#6AABF7" },
  { left: 80.5, top: 81.95, width: 13.3, height: 15.4, color: "#F7D648" },
] as const;

type AuthScreenProps = {
  title: string;
  /** Supporting line under the title, e.g. "Start your language journey today ✨". */
  subtitle: string;
  submitLabel: string;
  /** Sign Up collects a password; Sign In is email + social only. */
  showPasswordField: boolean;
  footerQuestion: string;
  footerLinkLabel: string;
  footerHref: Href;
};

/**
 * Shared layout for the Sign Up and Sign In screens.
 *
 * Both routes render this with different copy — the composition, spacing and
 * styling come straight from the `03-auth-screen` design, so keeping them in
 * one place is what stops the two screens from drifting apart.
 */
export default function AuthScreen({
  title,
  subtitle,
  submitLabel,
  showPasswordField,
  footerQuestion,
  footerLinkLabel,
  footerHref,
}: AuthScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/onboarding");
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        {/* The design is taller than a phone viewport, so the whole page scrolls
            and the footer is pushed to the bottom with `mt-auto`. */}
        <ScrollView
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-[13px]" style={{ paddingHorizontal: CONTENT_PADDING }}>
            <BackChevron onPress={goBack} />
          </View>

          <View
            className="mt-[31px]"
            style={{ paddingHorizontal: CONTENT_PADDING }}
          >
            <Text className="text-[24.4px] font-poppins-semibold leading-[1.3] text-[#17172B]">
              {title}
            </Text>
            <Text className="mt-[16.7px] font-poppins text-[15px] leading-[1.5] text-[#6E6E80]">
              {subtitle}
            </Text>
          </View>

          {/* Mascot band — exactly one fox tall, pulled up under the subtitle.
              The form below overlaps its paws, so the fox reads as peeking over
              the top of the card. */}
          <View className="relative w-full" style={{ height: FOX_SIZE }}>
            <View className="absolute left-1/2 top-0 h-full w-0">
              <Image
                source={images.mascotAuth}
                contentFit="contain"
                style={{
                  position: "absolute",
                  left: FOX_OFFSET_X - FOX_SIZE / 2,
                  top: FOX_OFFSET_Y,
                  width: FOX_SIZE,
                  height: FOX_SIZE,
                  // The design mirrors the asset horizontally.
                  transform: [{ scaleX: -1 }],
                }}
              />
              {SPARKLES.map((sparkle) => (
                <Image
                  key={sparkle.color}
                  source={images.sparkle}
                  tintColor={sparkle.color}
                  contentFit="contain"
                  style={{
                    position: "absolute",
                    left: sparkle.left,
                    top: sparkle.top,
                    width: sparkle.width,
                    height: sparkle.height,
                  }}
                />
              ))}
            </View>
          </View>

          <View
            className="z-10 mt-[-49.8px]"
            style={{ paddingHorizontal: CONTENT_PADDING }}
          >
            <AuthTextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />

            {showPasswordField ? (
              <View className="mt-[14px]">
                <AuthTextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                />
              </View>
            ) : null}

            <Pressable
              onPress={() => setIsVerifying(true)}
              accessibilityRole="button"
              className="mt-[15px] h-[58px] items-center justify-center rounded-[12px] bg-[#5841EC] active:opacity-90"
            >
              <Text className="text-[17px] font-poppins-bold text-white">
                {submitLabel}
              </Text>
            </Pressable>

            <View className="mt-[22.5px] flex-row items-center">
              <View className="h-px flex-1 bg-[#E8E9EE]" />
              <Text className="mx-[15px] font-poppins text-[15px] leading-[1.5] text-[#6E6E80]">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-[#E8E9EE]" />
            </View>

            <View className="mt-[13px] gap-[9.5px]">
              <SocialAuthButton
                provider="google"
                label="Continue with Google"
                onPress={() => {}}
              />
              <SocialAuthButton
                provider="facebook"
                label="Continue with Facebook"
                onPress={() => {}}
              />
              <SocialAuthButton
                provider="apple"
                label="Continue with Apple"
                onPress={() => {}}
              />
            </View>
          </View>

          <View className="mt-auto items-center pb-[22px] pt-[74px]">
            <Text className="font-poppins text-[14px] text-[#6E6E80]">
              {footerQuestion}{" "}
              <Link href={footerHref} asChild>
                <Text className="font-poppins-semibold text-[#5841EC]">
                  {footerLinkLabel}
                </Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Mounted only while verifying, so the code always starts empty. */}
      {isVerifying ? (
        <VerificationModal
          email={email.trim() || "your email address"}
          onClose={() => setIsVerifying(false)}
          onVerified={() => {
            setIsVerifying(false);
            router.replace("/");
          }}
        />
      ) : null}
    </View>
  );
}

/**
 * The design's back chevron, drawn from two rounded bars so the app does not
 * need an icon font for a single glyph.
 */
function BackChevron({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={14}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      className="relative ml-[4px] h-[18.2px] w-[11.2px] active:opacity-60"
    >
      <View className="absolute left-[4.3px] top-[-2.7px] h-[14.4px] w-[2.6px] rotate-[51deg] rounded-full bg-[#17172B]" />
      <View className="absolute left-[4.3px] top-[6.4px] h-[14.4px] w-[2.6px] rotate-[-51deg] rounded-full bg-[#17172B]" />
    </Pressable>
  );
}
