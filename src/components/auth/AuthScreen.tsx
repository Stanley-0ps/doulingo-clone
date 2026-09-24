import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import type { OAuthStrategy, SetActiveNavigate } from "@clerk/expo/types";
import { Image } from "expo-image";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
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

/** Which Clerk flow this screen drives. */
type AuthMode = "sign-up" | "sign-in";

/** The social providers the design offers. */
type SocialProvider = "google" | "facebook" | "apple";

/** Each button maps to the Clerk strategy that starts its OAuth flow. */
const SSO_STRATEGY = {
  google: "oauth_google",
  facebook: "oauth_facebook",
  apple: "oauth_apple",
} as const satisfies Record<SocialProvider, OAuthStrategy>;

/** Provider names as they read in user-facing copy. */
const PROVIDER_LABEL = {
  google: "Google",
  facebook: "Facebook",
  apple: "Apple",
} as const satisfies Record<SocialProvider, string>;

type AuthScreenProps = {
  title: string;
  /** Supporting line under the title, e.g. "Start your language journey today ✨". */
  subtitle: string;
  submitLabel: string;
  /** Sign Up collects a password; Sign In is email-code only. */
  mode: AuthMode;
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
  mode,
  footerQuestion,
  footerLinkLabel,
  footerHref,
}: AuthScreenProps) {
  const router = useRouter();
  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const posthog = usePostHog();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  /** Rendered on the form, directly above the submit button. */
  const [formError, setFormError] = useState<string | null>(null);
  /** Rendered inside the code sheet, under the six boxes. */
  const [codeError, setCodeError] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";
  const showPasswordField = isSignUp;
  const isSubmitting = (isSignUp ? signUpStatus : signInStatus) === "fetching";

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/onboarding");
  };

  /**
   * Clerk's errors carry a developer-facing `message` and an optional
   * user-facing `longMessage`; prefer the readable one when Clerk supplies it.
   */
  const readable = (error: { message: string; longMessage?: string }) =>
    error.longMessage ?? error.message;

  /**
   * Shared ending for both flows. `finalize` hands back the new session and a
   * `decorateUrl` helper (which rewrites the URL when Safari ITP cookies need
   * refreshing), so route through that rather than hard-coding the path.
   */
  const navigateAfterAuth: SetActiveNavigate = ({ session, decorateUrl }) => {
    // A session task (forced MFA enrolment, organization selection, …) has to be
    // resolved before the user can reach the app. Nothing on this instance sets
    // one, so stay put rather than routing into a half-signed-in state.
    if (session?.currentTask) {
      return;
    }
    router.replace(decorateUrl("/") as Href);
  };

  /** Step 1 of both flows: start the attempt and email the user a code. */
  const onSubmit = async () => {
    setFormError(null);
    const emailAddress = email.trim();

    if (isSignUp) {
      const { error } = await signUp.password({ emailAddress, password });
      if (error) {
        posthog.captureException(error, {
          auth_mode: mode,
          auth_stage: "password_submission",
        });
        setFormError(readable(error));
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        posthog.captureException(sendError, {
          auth_mode: mode,
          auth_stage: "code_delivery",
        });
        setFormError(readable(sendError));
        return;
      }
    } else {
      // Sign In is email-code only: the design has no password field, and this
      // instance does not allow password as a first factor. `sendCode` creates
      // the sign-in attempt and sends the email in one call.
      const { error } = await signIn.emailCode.sendCode({ emailAddress });
      if (error) {
        posthog.captureException(error, {
          auth_mode: mode,
          auth_stage: "code_delivery",
        });
        setFormError(
          error.code === "form_identifier_not_found"
            ? "No account found for that email. Sign up instead."
            : readable(error),
        );
        return;
      }
    }

    posthog.capture("auth_code_sent", { auth_mode: mode });
    setCodeError(null);
    setIsVerifying(true);
  };

  /** Step 2: the sheet hands us all six digits, and we finish the flow. */
  const onVerifyCode = async (code: string) => {
    if (isSignUp) {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        posthog.captureException(error, {
          auth_mode: mode,
          auth_stage: "code_verification",
        });
        setCodeError(readable(error));
        return false;
      }

      const { error: finalizeError } = await signUp.finalize({
        navigate: navigateAfterAuth,
      });
      if (finalizeError) {
        posthog.captureException(finalizeError, {
          auth_mode: mode,
          auth_stage: "session_finalization",
        });
        setCodeError(readable(finalizeError));
        return false;
      }
    } else {
      const { error } = await signIn.emailCode.verifyCode({ code });
      if (error) {
        posthog.captureException(error, {
          auth_mode: mode,
          auth_stage: "code_verification",
        });
        setCodeError(readable(error));
        return false;
      }

      const { error: finalizeError } = await signIn.finalize({
        navigate: navigateAfterAuth,
      });
      if (finalizeError) {
        posthog.captureException(finalizeError, {
          auth_mode: mode,
          auth_stage: "session_finalization",
        });
        setCodeError(readable(finalizeError));
        return false;
      }
    }

    posthog.capture("auth_completed", { auth_mode: mode });
    posthog.logger.info("authentication flow completed", {
      auth_mode: mode,
      auth_method: "email_code",
    });
    return true;
  };

  const onResendCode = () => {
    posthog.capture("verification_code_resent", { auth_mode: mode });
    setCodeError(null);
    // Passing no arguments reuses the attempt already in flight.
    if (isSignUp) {
      void signUp.verifications.sendEmailCode();
    } else {
      void signIn.emailCode.sendCode();
    }
  };

  const onCloseVerification = () => {
    setIsVerifying(false);
    setCodeError(null);
    // Drop the half-finished attempt so tapping submit again starts clean
    // instead of resuming one Clerk may no longer accept.
    if (isSignUp) {
      void signUp.reset();
    } else {
      void signIn.reset();
    }
  };

  const onSocialPress = async (provider: SocialProvider) => {
    setFormError(null);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: SSO_STRATEGY[provider],
      });

      // No session id means the user dismissed the browser sheet — not an error.
      if (createdSessionId && setActive) {
        // SSO is the one flow that still activates the session itself rather
        // than going through `finalize()`.
        await setActive({ session: createdSessionId });
        posthog.capture("social_auth_completed", { provider });
        posthog.logger.info("authentication flow completed", {
          auth_mode: mode,
          auth_method: "social",
          provider,
        });
        router.replace("/");
      }
    } catch (error) {
      posthog.captureException(error, {
        auth_mode: mode,
        auth_stage: "social_authentication",
        provider,
      });
      setFormError(
        error instanceof Error
          ? readable(error)
          : `Could not start ${PROVIDER_LABEL[provider]} sign-in. Please try again.`,
      );
    }
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

            {formError ? (
              <Text className="mt-[14px] font-poppins text-[13px] leading-[1.5] text-[#FF4D4F]">
                {formError}
              </Text>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={isSubmitting}
              accessibilityRole="button"
              className={`mt-[15px] h-[58px] items-center justify-center rounded-[12px] bg-[#5841EC] ${
                isSubmitting ? "opacity-60" : "active:opacity-90"
              }`}
            >
              <Text className="text-[17px] font-poppins-bold text-white">
                {submitLabel}
              </Text>
            </Pressable>

            {/* Clerk's bot protection is on by default and needs this mount
                point in every screen that can create an account. It renders
                nothing on iOS and Android — only Expo web shows a challenge. */}
            {isSignUp ? <View nativeID="clerk-captcha" /> : null}

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
                onPress={() => void onSocialPress("google")}
              />
              <SocialAuthButton
                provider="facebook"
                label="Continue with Facebook"
                onPress={() => void onSocialPress("facebook")}
              />
              <SocialAuthButton
                provider="apple"
                label="Continue with Apple"
                onPress={() => void onSocialPress("apple")}
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
          errorMessage={codeError}
          onClose={onCloseVerification}
          onVerifyCode={onVerifyCode}
          onResend={onResendCode}
          // `finalize` already routed on success — this only puts the sheet away
          // in the case where a session task kept us on the auth screen.
          onVerified={() => setIsVerifying(false)}
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
