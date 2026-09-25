import { Redirect, Slot } from "expo-router";

import { useCourseGate } from "@/hooks/useCourseGate";

/**
 * The lesson player sits *outside* the tab group, so it covers the whole screen
 * — the tab bar is not rendered under it and the swipe back is the way out.
 *
 * Everything that should take over the screen like this belongs here rather
 * than inside `(tabs)`: a lesson today, a live teacher session later.
 *
 * `Slot` rather than `Stack`: this layout is a gate, not a navigator. A nested
 * navigator would put a second back gesture between the lesson and the tabs,
 * and a single-screen stack cannot pop — the swipe would find nothing to do.
 */
export default function LessonLayout() {
  const { ready, redirectTo } = useCourseGate();

  if (!ready) {
    return null;
  }

  // A deep link into a lesson is still a deep link: it cannot skip sign-in or
  // the language picker just because it did not come from the tab bar.
  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }

  return <Slot />;
}
