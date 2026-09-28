const appJson = require("./app.json");

/**
 * Expo Router needs the app's own origin to resolve API routes and
 * server-rendered pages in a production build. In development the dev server
 * supplies it, so this is only applied when the origin is configured — which
 * also keeps `app.json` free of environment-specific values.
 */
function withRouterOrigin(plugins = []) {
  const origin = process.env.EXPO_PUBLIC_API_ORIGIN;

  if (!origin) {
    return plugins;
  }

  return plugins.map((plugin) =>
    plugin === "expo-router" ? ["expo-router", { origin }] : plugin,
  );
}

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    plugins: withRouterOrigin(appJson.expo.plugins),
    extra: {
      ...appJson.expo.extra,
      posthogProjectToken: process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    },
  },
};
