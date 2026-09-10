import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from "react-native";

import { images } from "@/constants/images";

type AuthTextFieldProps = {
  /** Small muted caption above the value, e.g. "Email". */
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** Renders the value masked and adds the show/hide eye toggle. */
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "email" | "password" | "off";
  textContentType?: "emailAddress" | "password" | "none";
};

/**
 * Labelled input card used by the Sign Up / Sign In screens.
 *
 * Layout mirrors the `03-auth-screen` design: a rounded card with a 12px muted
 * label and a 15px ink value, 16pt horizontal padding.
 */
export default function AuthTextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete = "off",
  textContentType = "none",
}: AuthTextFieldProps) {
  const [isHidden, setIsHidden] = useState(secureTextEntry);

  return (
    <View className="rounded-[15px] border border-[#ECEDF0] bg-white px-4 pb-[13px] pt-[15px]">
      <Text className="font-poppins text-[12px] leading-[1.4] text-[#6E6E80]">{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B4B7C5"
        secureTextEntry={isHidden}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        textContentType={textContentType}
        autoCorrect={false}
        // A TextInput should not force a single fixed height; allow the
        // platform input to grow from a minimum height while providing
        // small vertical padding so email/password text can expand with
        // accessibility font scaling without changing the shared horizontal
        // layout or the eye icon placement.
        style={{ paddingVertical: 2, minHeight: 22.5, paddingHorizontal: 0 }}
        className={`mt-[8px] font-poppins text-[15px] leading-[1.5] text-[#17172B] ${
          secureTextEntry ? "pr-[38px]" : ""
        }`}
      />

      {secureTextEntry ? (
        <Pressable
          onPress={() => setIsHidden((hidden) => !hidden)}
          accessibilityRole="button"
          accessibilityLabel={isHidden ? "Show password" : "Hide password"}
          className="absolute bottom-0 right-[14px] top-0 justify-center active:opacity-60"
        >
          {/* Sized with `style`: NativeWind's className polyfill only covers
              `react-native` imports, not expo-image. */}
          <Image
            source={isHidden ? images.eye : images.eyeOff}
            style={{ width: 30.5, height: 23 }}
            contentFit="contain"
          />
        </Pressable>
      ) : null}
    </View>
  );
}
