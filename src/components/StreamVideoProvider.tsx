import { useAuth } from "@clerk/expo";
import type {
  StreamVideoClient as StreamVideoClientType,
  User,
} from "@stream-io/video-react-native-sdk";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createStreamTokenProvider, fetchStreamSession } from "@/lib/stream";
import { getStreamSdk } from "@/lib/stream-native";

/**
 * The connected Stream client, or `undefined` when there isn't one yet.
 *
 * Screens read this instead of calling `useStreamVideoClient()` directly,
 * because that hook throws when no provider is mounted — and the provider is
 * deliberately absent while the connection is being established, or after it
 * failed. This way a lesson renders a clear "can't reach the classroom" state
 * instead of crashing the whole app.
 */
type StreamClientState = {
  client: StreamVideoClientType | undefined;
  /** Set when connecting failed, so the UI can explain why and offer a retry. */
  error: Error | undefined;
  /** Try to connect again after a failure. */
  reconnect: () => void;
};

const StreamClientContext = createContext<StreamClientState>({
  client: undefined,
  error: undefined,
  reconnect: () => undefined,
});

/** Read the app's Stream client. Safe to call anywhere — it never throws. */
export function useStreamClient(): StreamClientState {
  return useContext(StreamClientContext);
}

/**
 * Connects the app to Stream once the user is signed in, and keeps that
 * connection for the whole session.
 *
 * One client, mounted once, above the navigator — that is the shape the SDK
 * expects. Creating a client per screen would open a new websocket every time
 * you enter a lesson, and the old ones would keep running in the background.
 *
 * The client is built from a token minted by `/api/stream/session`, which
 * verifies the Clerk session before handing anything out. When that token
 * expires the SDK calls `tokenProvider`, which hits the same endpoint again —
 * so a long lesson never drops.
 */
export default function StreamVideoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [client, setClient] = useState<StreamVideoClientType>();
  const [error, setError] = useState<Error>();
  const [attempt, setAttempt] = useState(0);
  const insets = useSafeAreaInsets();

  // `null` on a build without the native WebRTC module — Expo Go. Read once,
  // here, so the value is fixed before any branching below.
  const sdk = getStreamSdk();

  // Clerk does not promise that `getToken` keeps its identity between renders,
  // so we read it through a ref. That keeps the effect below keyed on *who is
  // signed in* rather than on a function that may be recreated at any moment.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    // Signed out: nothing to connect. The sign-in screens don't need Stream.
    // No SDK: nothing we *can* connect with — the lesson screen says so.
    if (!isLoaded || !isSignedIn || !userId || !sdk) {
      return;
    }

    let cancelled = false;
    let connected: StreamVideoClientType | undefined;
    // Narrowed copy: TypeScript cannot carry the `!sdk` check above into the
    // async function below, and this is the value the closure actually needs.
    const streamSdk = sdk;

    async function connect() {
      try {
        const session = await fetchStreamSession(await getTokenRef.current());

        if (cancelled) {
          return;
        }

        const user: User = {
          id: session.userId,
          name: session.userName,
          image: session.userImage,
        };
        const tokenProvider = createStreamTokenProvider(() =>
          getTokenRef.current(),
        );

        // `getOrCreateInstance` keeps one client per user alive across
        // re-renders and remounts instead of stacking up connections.
        const instance = streamSdk.StreamVideoClient.getOrCreateInstance({
          apiKey: session.apiKey,
          user,
          token: session.token,
          tokenProvider,
        });

        // Connecting explicitly covers the retry path: the registry still holds
        // the client a previous attempt disconnected, and reusing it without
        // this call would leave us holding a client that is not connected.
        // Reconnecting an already-connected user is a no-op inside the SDK.
        await instance.connectUser(user, tokenProvider);
        connected = instance;

        if (cancelled) {
          return;
        }

        setClient(instance);
        setError(undefined);
      } catch (cause) {
        if (cancelled) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error("Could not connect to the lesson classroom."),
        );
      }
    }

    void connect();

    return () => {
      cancelled = true;
      setClient(undefined);
      // Disconnect on sign-out so the next account starts from a clean client.
      connected?.disconnectUser().catch(() => undefined);
    };
  }, [attempt, isLoaded, isSignedIn, sdk, userId]);

  const reconnect = () => {
    setError(undefined);
    setAttempt((value) => value + 1);
  };

  const state: StreamClientState = { client, error, reconnect };

  // No SDK in this build (Expo Go). There is nothing to connect and no spinner
  // worth showing — the app runs, and the lesson screen explains what is
  // missing. This is checked first so the loading state below can't trap us.
  if (!sdk) {
    return (
      <StreamClientContext.Provider value={state}>
        {children}
      </StreamClientContext.Provider>
    );
  }

  // Still connecting. This renders above the navigator, so keep it to a quiet
  // loading state rather than a full screen with its own branding.
  if (isSignedIn && !client && !error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#6C4EF5" />
      </View>
    );
  }

  // Connecting failed. Let the app run anyway: everything except a live lesson
  // works without Stream, and the lesson screen explains the problem when you
  // get there. Blocking the whole app on one third-party service would be worse.
  if (!client) {
    return (
      <StreamClientContext.Provider value={state}>
        {children}
      </StreamClientContext.Provider>
    );
  }

  return (
    <StreamClientContext.Provider value={state}>
      {/* The SDK needs the device's safe-area insets to place its own overlays
          correctly. Expo Router already mounts `SafeAreaProvider` at the root,
          so the insets are available here. */}
      <sdk.StreamVideo client={client} style={{ variants: { insets } }}>
        {children}
      </sdk.StreamVideo>
    </StreamClientContext.Provider>
  );
}
