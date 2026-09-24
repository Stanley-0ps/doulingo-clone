import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Tabs } from "expo-router/js-tabs";

import TabBar from "@/components/navigation/TabBar";
import { getLanguageById } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";

/**
 * The signed-in part of the app: five tabs behind a custom bar.
 *
 * The gates live here rather than on each screen so every tab is covered by
 * one set of checks — a learner who is signed out, or signed in without a
 * course, is redirected before any tab can render.
 *
 * `expo-router/js-tabs` is the JavaScript tabs navigator. The newer
 * `expo-router/unstable-native-tabs` renders a real platform tab bar, which
 * cannot host the custom sliding indicator this design calls for.
 */
export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  // Clerk restores the session from the keychain asynchronously, so wait for
  // `isLoaded` before deciding — otherwise every cold start flashes the
  // signed-out branch.
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  // The stored language comes from AsyncStorage, which is also asynchronous.
  // Waiting keeps a learner who already has a course from bouncing through the
  // language screen on every launch.
  if (!hasHydrated) {
    return null;
  }

  // No course yet — or one whose language has since been dropped from
  // `data/languages.ts`, which the persisted id outlives. Either way, picking a
  // language is the only way forward.
  const language = selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  if (!language) {
    return <Redirect href="/languages" />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Titles are the tab labels the custom bar draws underneath each icon. */}
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
