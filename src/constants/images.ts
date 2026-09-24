/**
 * Centralized image imports.
 *
 * Import every image used in the app from this object instead of requiring
 * assets directly inside screens/components.
 *
 * Note: the source file for the mascot logo is named `moscot-logo.png` on disk
 * (intentional asset filename) but is exposed here as `mascotLogo`.
 */

import apple from "@/assets/images/apple.png";
import earth from "@/assets/images/earth.png";
import eyeOff from "@/assets/images/eye-off.png";
import eye from "@/assets/images/eye.png";
import facebook from "@/assets/images/facebook.png";
import google from "@/assets/images/google.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotLogo from "@/assets/images/moscot-logo.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import palace from "@/assets/images/palace.png";
import sparkle from "@/assets/images/sparkle.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

export const images = {
  /** Fox-head mark used in the app-wordmark lockup. */
  mascotLogo,
  /** Waving fox mascot used as the onboarding hero illustration. */
  mascotWelcome,
  /** Peeking fox mascot used as the auth screens hero illustration. */
  mascotAuth,
  /**
   * Landmarks standing on a globe, used as the language selection screen's
   * bottom illustration. Transparent bands are baked into the asset — see
   * `EARTH_BAND` in `app/languages.tsx` before sizing it.
   */
  earth,
  /** Brand marks for the social auth buttons. */
  google,
  facebook,
  apple,
  /** Password visibility toggle icons. */
  eye,
  eyeOff,
  /** Solid white 4-point star, tinted at runtime (`tintColor`). */
  sparkle,
  /**
   * Treasure chest on the home screen's daily-goal card. Square with
   * transparent bands baked in — see `TREASURE_SIZE` in
   * `components/home/DailyGoalCard.tsx` before resizing it.
   */
  treasure,
  /**
   * Church on the home screen's "Continue learning" card. Square with
   * transparent bands baked in — see `PALACE_SIZE` in
   * `components/home/ContinueLearningCard.tsx`.
   */
  palace,
  /**
   * Campfire used as the streak icon. The flame the home screen shows is only
   * part of the square (it also contains the grass it burns on) — see the
   * `FLAME_*` constants in `components/home/HomeHeader.tsx`.
   */
  streakFire,
} as const;

export type ImageName = keyof typeof images;
