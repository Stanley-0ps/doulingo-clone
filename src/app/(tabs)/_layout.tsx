import { Redirect } from "expo-router";
import { Tabs } from "expo-router/js-tabs";

import TabBar from "@/components/navigation/TabBar";
import { useCourseGate } from "@/hooks/useCourseGate";

/**
 * The signed-in part of the app: five tabs behind a custom bar.
 *
 * The gates run here rather than on each screen so every tab is covered by one
 * set of checks — a learner who is signed out, or signed in without a course,
 * is redirected before any tab can render. They are shared with the lesson
 * screen, which sits outside this group; see `hooks/useCourseGate`.
 *
 * `expo-router/js-tabs` is the JavaScript tabs navigator. The newer
 * `expo-router/unstable-native-tabs` renders a real platform tab bar, which
 * cannot host the custom sliding indicator this design calls for.
 */
export default function TabsLayout() {
  const { ready, redirectTo } = useCourseGate();

  if (!ready) {
    return null;
  }

  if (redirectTo) {
    return <Redirect href={redirectTo} />;
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
