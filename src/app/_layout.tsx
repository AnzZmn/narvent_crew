import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StartupAnimation from "@/components/startup/Splash";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [startupFinished, setStartupFinished] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initializeApp() {
      try {
        // Future initialization:
        //
        // await restoreSession();
        // await loadFonts();
        // await initializeStorage();

        if (isMounted) {
          setIsAppReady(true);
        }
      } catch (error) {
        console.error("App initialization failed:", error);

        if (isMounted) {
          setIsAppReady(true);
        }
      }
    }

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    SplashScreen.hideAsync().catch(() => {});
  }, [isAppReady]);

  const handleStartupFinished = useCallback(() => {
    setStartupFinished(true);
  }, []);

  if (!isAppReady) {
    return null;
  }

  if (!startupFinished) {
    return <StartupAnimation onComplete={handleStartupFinished} />;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}
