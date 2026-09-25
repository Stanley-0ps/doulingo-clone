import { useAuth } from "@clerk/expo";
import type { Href } from "expo-router";

import { getLanguageById } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";

type CourseGate = {
  /** Where to send a learner who cannot be here yet, or `null` to let them in. */
  redirectTo: Href | null;
  /**
   * False while Clerk or AsyncStorage is still restoring state. A layout has to
   * render nothing in the meantime rather than flash a redirect it may have to
   * undo — Clerk reads the session from the keychain and the language comes
   * from AsyncStorage, both asynchronously.
   */
  ready: boolean;
};

/**
 * The two checks every course screen sits behind: signed in, and with a
 * language picked.
 *
 * Two navigators need them — the tab bar and the lesson screen — so they live
 * here rather than in either layout. Adding a third (a live teacher session,
 * say) means calling this, not copying it.
 *
 * ```tsx
 * const { ready, redirectTo } = useCourseGate();
 * if (!ready) return null;
 * if (redirectTo) return <Redirect href={redirectTo} />;
 * ```
 */
export function useCourseGate(): CourseGate {
  const { isLoaded, isSignedIn } = useAuth();

  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  if (!isLoaded || !hasHydrated) {
    return { ready: false, redirectTo: null };
  }

  if (!isSignedIn) {
    return { ready: true, redirectTo: "/onboarding" };
  }

  // No course yet — or one whose language has since been dropped from
  // `data/languages.ts`, which the persisted id outlives. Either way, picking a
  // language is the only way forward.
  const language = selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  if (!language) {
    return { ready: true, redirectTo: "/languages" };
  }

  return { ready: true, redirectTo: null };
}
