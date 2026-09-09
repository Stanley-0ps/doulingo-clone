/**
 * Centralized font registration for expo-font.
 *
 * Family names here are the exact keys used by `fontFamily` in styles and by
 * the typography tokens in `theme/typography.ts` (`fonts.regular` → "Poppins").
 *
 * Loaded once in `src/app/_layout.tsx`.
 */

export const appFonts = {
  Poppins: require("@/assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
} as const;
