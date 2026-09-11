import { Image } from "expo-image";
import { Pressable, Text } from "react-native";

import { images } from "@/constants/images";

/** Square canvas every provider mark is drawn into, in points. */
const ICON_SIZE = 30;

type SocialAuthButtonProps = {
  provider: "google" | "facebook" | "apple";
  label: string;
  onPress: () => void;
};

/**
 * One row of the "or continue with" list.
 *
 * In the `03-auth-screen` design the icon column and the text column are fixed
 * rather than centred, so every row lines up: the brand mark starts 35pt in
 * from the card edge and the label 28pt after it.
 */
export default function SocialAuthButton({
  provider,
  label,
  onPress,
}: SocialAuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="h-[53px] flex-row items-center rounded-[16px] border border-[#F1F2F5] bg-white pl-[35px] active:opacity-70"
    >
      {/* expo-image is not a `react-native` import, so NativeWind's className
          polyfill never reaches it — size it with `style` or it collapses to
          nothing on native (see the note in AGENTS.md about StyleSheet
          exceptions). */}
      <Image
        source={images[provider]}
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
        contentFit="contain"
      />
      <Text className="ml-[28px] font-poppins text-[15px] text-[#17172B]">{label}</Text>
    </Pressable>
  );
}
