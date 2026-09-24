import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import LanguageRow from "@/components/language/LanguageRow";
import { images } from "@/constants/images";
import { defaultLanguageId, languages } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";
import { colors } from "@/theme";
import type { LanguageId } from "@/types/learning";

/* ---------------------------------------------------------------------------
 * Design grid
 *
 * Every number below is measured off
 * `prompt_material/04-language-selection-screen.png`, converted to points at
 * the reference scale S = 574px / 390pt = 1.4718. They are passed through
 * `style` rather than as arbitrary Tailwind classes because a class name has
 * to be a static string — NativeWind cannot read a value out of a constant.
 * ------------------------------------------------------------------------ */
const SCREEN_PADDING = 26; // 38px — search field and list inset
const HEADER_TOP = 16; // header row sits this far below the safe area
const HEADER_HEIGHT = 24; // back chevron / title row
const SEARCH_GAP = 24; // header → search field
const SEARCH_HEIGHT = 48; // 70px field
const SECTION_GAP = 22; // search field → "Popular"
const LIST_GAP = 14; // "Popular" → first row slot
const BUTTON_HEIGHT = 54; // 79px confirmation button
const BUTTON_GAP = 17; // last row → button
const EARTH_GAP = 20; // button → illustration

/**
 * The illustration ships with transparent bands baked in: 214 of its 1254px
 * are empty above and below the artwork, and the globe itself spans the middle
 * 90% of the asset's width. Clipping those bands is what makes the artwork sit
 * on the bottom edge of the screen at the size the design shows it.
 */
const EARTH_BAND = 214 / 1254; // transparent band, top and bottom
const EARTH_CONTENT = 827 / 1254; // visible height of the artwork

/**
 * Language selection screen.
 *
 * The learner picks one of the hardcoded languages from `data/languages.ts`,
 * then confirms to carry on into the app. Confirming writes the choice to the
 * language store, which the home route reads to decide whether the learner is
 * allowed in yet.
 */
export default function LanguagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const posthog = usePostHog();

  const storedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const selectLanguage = useLanguageStore((state) => state.selectLanguage);

  // A tap highlights a row before the learner commits. It is held as `null`
  // until then rather than seeded from the store, because the store's value
  // arrives from AsyncStorage *after* the first render: a `useState` initializer
  // runs once, so it would capture the empty value and never see the real one.
  // Holding the tap separately also means a tap made before the store hydrates
  // wins rather than being overwritten when it does.
  const [pickedId, setPickedId] = useState<LanguageId | null>(null);
  const [query, setQuery] = useState("");

  // With nothing tapped, the language already on file is the selection —
  // switching courses re-opens the screen on the current one rather than
  // resetting to Spanish.
  const selectedId = pickedId ?? storedLanguageId ?? defaultLanguageId;

  const search = query.trim().toLowerCase();
  const visibleLanguages = search
    ? languages.filter(
        (language) =>
          language.name.toLowerCase().includes(search) ||
          language.nativeName.toLowerCase().includes(search),
      )
    : languages;

  const selectedLanguage =
    languages.find((language) => language.id === selectedId) ?? languages[0];

  const goBack = () => {
    // First run: there is no course yet, so home would only redirect straight
    // back here. Leaving the learner on this screen is the honest behaviour.
    if (!storedLanguageId) {
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        {/* The measured design is taller than a phone viewport (950pt), so the
            page scrolls; `grow` keeps the illustration pinned to the bottom on
            taller screens. */}
        <ScrollView
          contentContainerClassName="grow"
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="relative flex-row items-center"
            style={{
              paddingHorizontal: SCREEN_PADDING,
              paddingTop: HEADER_TOP,
              height: HEADER_TOP + HEADER_HEIGHT,
            }}
          >
            <Pressable
              onPress={goBack}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-[24px] w-[24px] items-center justify-center active:opacity-60"
            >
              <BackChevron />
            </Pressable>

            {/* The title is centred on the screen, not on the padded row — as
                in the design, the chevron sits at the far left edge. It is
                sized explicitly rather than with `text-h3`: the design's title
                is set in a narrower face than Poppins, so matching its 26px
                glyph height lands a step below the 20pt type scale. */}
            <Text
              className="absolute left-0 right-0 text-center text-[17px] font-poppins-semibold leading-[24px] text-ink"
              style={{ top: HEADER_TOP }}
            >
              Choose a language
            </Text>
          </View>

          <View style={{ paddingHorizontal: SCREEN_PADDING }}>
            <View
              className="flex-row items-center rounded-card border border-border px-[16px]"
              style={{ marginTop: SEARCH_GAP, height: SEARCH_HEIGHT }}
            >
              <MagnifierIcon />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search languages"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                className="ml-[16px] flex-1 text-[16px] font-poppins text-ink"
                // Android inputs carry their own vertical padding, which would
                // push the text off the field's centre line.
                style={{ paddingVertical: 0 }}
              />
            </View>

            <Text
              className="text-[16px] font-poppins-semibold leading-[1.4] text-ink"
              style={{ marginTop: SECTION_GAP }}
            >
              Popular
            </Text>

            {visibleLanguages.length > 0 ? (
              <View style={{ marginTop: LIST_GAP }}>
                {visibleLanguages.map((language) => (
                  <LanguageRow
                    key={language.id}
                    language={language}
                    selected={language.id === selectedId}
                    onPress={() => setPickedId(language.id)}
                  />
                ))}
              </View>
            ) : (
              <Text className="text-body text-muted" style={{ marginTop: LIST_GAP }}>
                No languages match “{query.trim()}”.
              </Text>
            )}

            <Pressable
              onPress={() => {
                posthog.capture("language_selected", {
                  language_id: selectedId,
                  is_course_change: storedLanguageId !== null,
                });
                selectLanguage(selectedId);
                posthog.logger.info("language preference persisted", {
                  language_id: selectedId,
                  is_course_change: storedLanguageId !== null,
                });
                router.replace("/");
              }}
              accessibilityRole="button"
              className="flex-row items-center rounded-card bg-primary px-[16px] active:opacity-90"
              style={{ marginTop: BUTTON_GAP, height: BUTTON_HEIGHT }}
            >
              <GlobeIcon />
              <Text className="ml-[16px] text-[16px] font-poppins-semibold text-white">
                Confirm {selectedLanguage.name}
              </Text>
            </Pressable>
          </View>

          {/* Hero illustration, full-bleed along the bottom of the screen. The
              wrapper clips the asset's transparent bands (EARTH_BAND) so the
              globe's flat bottom lands on the screen edge as in the design. */}
          <View className="mt-auto w-full" style={{ paddingTop: EARTH_GAP }}>
            <View
              className="w-full overflow-hidden"
              style={{ height: width * EARTH_CONTENT }}
            >
              <Image
                source={images.earth}
                contentFit="contain"
                style={{
                  position: "absolute",
                  left: 0,
                  top: -width * EARTH_BAND,
                  width,
                  height: width,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/**
 * The design's back chevron: two rounded bars sharing a corner, sized to the
 * 14 × 25px glyph in the language design (9.5 × 17pt).
 */
function BackChevron() {
  return (
    <View className="relative h-[17px] w-[9.5px]">
      <View className="absolute left-[4px] top-[-2.5px] h-[13.4px] w-[2.4px] rotate-[51deg] rounded-full bg-ink" />
      <View className="absolute left-[4px] top-[6px] h-[13.4px] w-[2.4px] rotate-[-51deg] rounded-full bg-ink" />
    </View>
  );
}

/** Magnifier for the search field: a ring plus a handle rotated onto it. */
function MagnifierIcon() {
  return (
    <View className="h-[24px] w-[24px] items-center justify-center">
      <View className="h-[16px] w-[16px] rounded-full border-2 border-muted" />
      <View className="absolute bottom-[2px] right-[4px] h-[7px] w-[2px] rotate-[-45deg] rounded-full bg-muted" />
    </View>
  );
}

/**
 * Globe mark on the confirmation button: a ringed circle with an equator and a
 * meridian, built from three views so no icon font is needed.
 */
function GlobeIcon() {
  return (
    <View className="h-[24px] w-[24px] items-center justify-center">
      <View className="h-[21px] w-[21px] rounded-full border-[1.8px] border-white" />
      <View className="absolute h-[21px] w-[10px] rounded-full border-[1.8px] border-white" />
      <View className="absolute h-[1.8px] w-[21px] bg-white" />
    </View>
  );
}
