import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Number of digits in the emailed verification code. */
const CODE_LENGTH = 6;

/** How long the last digit stays on screen before we navigate away. */
const SUCCESS_DELAY_MS = 220;

type VerificationModalProps = {
  /** Address the code was sent to, shown in the copy. */
  email: string;
  /** Dismissed without completing verification. */
  onClose: () => void;
  /** All six digits entered — the caller navigates to the home route. */
  onVerified: () => void;
  /** Verifies the completed code and only allows onVerified after success. */
  onVerifyCode?: (code: string) => Promise<boolean> | boolean;
  /** Requests a replacement verification code when supported by the caller. */
  onResend?: () => void;
  /** Shown under the boxes when the last code was rejected. */
  errorMessage?: string | null;
};

/**
 * Bottom sheet asking for the 6-digit code emailed to the user.
 *
 * Mount it only while it should be on screen — that way the code always starts
 * empty and there is no state to reset when it reopens.
 *
 * The six boxes are display only — a single invisible `TextInput` laid over
 * them owns the value and raises the number pad, which keeps the whole row
 * tappable and backspace behaving the way people expect. `KeyboardAvoidingView`
 * lifts the sheet so it always sits above the keyboard.
 */
export default function VerificationModal({
  email,
  onClose,
  onVerified,
  onVerifyCode,
  onResend,
  errorMessage,
}: VerificationModalProps) {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleResend = () => {
    setCode("");
    onResend?.();
  };

  useEffect(
    () => () => {
      if (successTimer.current) {
        clearTimeout(successTimer.current);
      }
    },
    [],
  );

  const handleChange = async (next: string) => {
    const digits = next.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    if (digits.length === CODE_LENGTH) {
      const isVerified = await onVerifyCode?.(digits);
      if (isVerified === false) {
        // Rejected — clear the boxes so the next attempt starts from scratch.
        setCode("");
        return;
      }

      // Hold for a beat so the final digit is visible before we leave.
      successTimer.current = setTimeout(onVerified, SUCCESS_DELAY_MS);
    }
  };

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* `behavior` is a KeyboardAvoidingView prop, so it stays out of className. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close verification"
            onPress={onClose}
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)]"
          />

          <View
            className="rounded-t-[28px] bg-white px-[30px] pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}
          >
            <View className="mb-6 h-1 w-10 self-center rounded-full bg-[#E8E9EE]" />

            <Text className="text-[22px] font-poppins-semibold text-[#17172B]">
              Check your email
            </Text>
            <Text className="mt-2 font-poppins text-[14px] leading-[1.5] text-[#6E6E80]">
              We sent a 6-digit verification code to{" "}
              <Text className="font-poppins-medium text-[#17172B]">{email}</Text>.
              Enter it below to verify your account.
            </Text>

            <View className="relative mt-7">
              <View className="flex-row justify-between">
                {Array.from({ length: CODE_LENGTH }, (_, index) => {
                  const digit = code[index] ?? "";
                  const isFilled = index < code.length;
                  const isActive = index === code.length;

                  return (
                    <View
                      key={index}
                      className={`h-[56px] w-[46px] items-center justify-center rounded-[14px] border bg-white ${
                        isFilled || isActive
                          ? "border-[#5841EC]"
                          : "border-[#ECEDF0]"
                      }`}
                    >
                      <Text className="text-[22px] font-poppins-semibold text-[#17172B]">
                        {digit}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Invisible input that owns the value and raises the number pad. */}
              <TextInput
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={CODE_LENGTH}
                autoFocus
                caretHidden
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  opacity: 0,
                }}
              />
            </View>

            {errorMessage ? (
              <Text className="mt-4 text-center font-poppins text-[13px] leading-[1.5] text-[#FF4D4F]">
                {errorMessage}
              </Text>
            ) : null}

            <Text className="mt-6 text-center font-poppins text-[13px] text-[#6E6E80]">
              Didn&apos;t get the code?{" "}
              <Text
                onPress={handleResend}
                className="font-poppins-semibold text-[#5841EC]"
              >
                Clear code
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
