import { Stack } from "expo-router";

/**
 * Auth route group. The screens draw their own header (back chevron + title),
 * so the navigator header is hidden.
 */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
