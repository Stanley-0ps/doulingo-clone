import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLanguageById } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";

/**
 * Home tab.
 *
 * Temporary UI. The real home — daily goal, continue-learning card, today's
 * plan — is a later feature; for now this confirms which course is active and
 * offers the two things a learner can do while nothing else exists yet.
 *
 * Sign-in and course gates live in the tab layout, so this screen can assume
 * both are satisfied.
 */
export default function HomeScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const clearSelectedLanguage = useLanguageStore(
    (state) => state.clearSelectedLanguage,
  );

  const language = selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  // The layout redirects to the language screen when there is no valid course,
  // so this only covers the frame between that redirect and the unmount.
  if (!language) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center text-h1 text-ink">
            Welcome to{"\n"}
            <Text className="font-poppins-bold text-[#5841EC]">Domingo</Text>
          </Text>
          <Text className="mt-3 text-center text-body text-muted">
            Your AI language teacher.
          </Text>

          {/* The course the learner is on. Same flag-disc-and-two-line shape as
              a row on the language screen, so the two read as one idea. */}
          <View className="mt-8 w-full flex-row items-center rounded-card border border-border px-4 py-3">
            {/* expo-image is not a `react-native` import, so NativeWind's
                className polyfill never reaches it — it is sized with `style`. */}
            <Image
              source={{ uri: language.flag }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
              contentFit="cover"
            />
            <View className="ml-4 flex-1">
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
                {language.nativeName}
              </Text>
            </View>
          </View>

          {/* Inset a little from the language card above, so the buttons read as
              controls rather than another card. */}
          <View className="mt-8 w-full gap-3 px-16">
            {/* Language selection — the screen the learner picks their course
                on. Filled purple: it is the step that actually moves the
                learner forward, so it carries the emphasis. */}
            <Pressable
              onPress={() => router.push("/languages")}
              accessibilityRole="button"
              className="w-full items-center rounded-btn bg-[#5841EC] py-4 active:opacity-85"
            >
              <Text className="text-body-lg font-poppins-semibold text-white">
                Choose a language
              </Text>
            </Pressable>

            {/* Dropping the session flips `isSignedIn`, and the tab layout's
                gate sends us back to onboarding — no manual navigation. */}
            <Pressable
              onPress={() => void signOut()}
              accessibilityRole="button"
              className="w-full items-center rounded-btn border border-border py-4 active:opacity-85"
            >
              <Text className="text-body-lg text-muted">Sign Out</Text>
            </Pressable>

            {/* Development helper, stripped from production builds by `__DEV__`.
                It forgets the language choice so the first-run gate can be
                tested without reinstalling. `clearSelectedLanguage` removes
                only the language key, so XP and lesson progress survive. */}
            {__DEV__ ? (
              <Pressable
                onPress={() => void clearSelectedLanguage()}
                accessibilityRole="button"
                className="w-full items-center rounded-btn border border-dashed border-border py-3 active:opacity-85"
              >
                <Text className="text-body text-error">
                  Reset language choice (dev)
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
