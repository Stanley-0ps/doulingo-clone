import Constants from "expo-constants";

type PostHogConfig = {
  projectToken: string;
  host: string;
};

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;

export const posthogConfig: PostHogConfig | null =
  projectToken && host ? { projectToken, host } : null;
