import Constants from "expo-constants";

type PostHogConfig = {
  projectToken: string;
  host: string;
};

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;

function requireInDevelopment(value: string | undefined, variable: string) {
  if (!value && __DEV__) {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }
}

requireInDevelopment(projectToken, "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN");
requireInDevelopment(host, "EXPO_PUBLIC_POSTHOG_HOST");

export const posthogConfig: PostHogConfig | null =
  projectToken && host ? { projectToken, host } : null;
