import React, {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';
import {Tabs} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TabBar} from '../../expo-my-profile';
import {TabOverlayContext, TabOverlayOpenContext} from '../../TabOverlay';
import {tabFade, tabTransition} from '../../tabTransition';

/**
 * One TabBar for both tabs. Tab screens stay mounted, so switching doesn't rebuild the
 * page, and the highlight spring runs to completion.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [overlay, setOverlay] = useState(false);
  const bottom = Math.max(insets.bottom, 10) + 14;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  return (
    <TabOverlayContext.Provider value={setOverlay}>
      <TabOverlayOpenContext.Provider value={overlay}>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          lazy: false, // mount Profile up front so the first switch is instant
          ...(reduceMotion ? tabFade : tabTransition),
          sceneStyle: {backgroundColor: 'transparent'},
        }}
        tabBar={({state, navigation}) =>
          overlay ? null : (
            <TabBar
              active={state.routes[state.index].name === 'profile' ? 'profile' : 'home'}
              bottom={bottom}
              onChange={t => {
                const name = t === 'profile' ? 'profile' : 'index';
                if (state.routes[state.index].name !== name) navigation.navigate(name);
              }}
            />
          )
        }>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="profile" />
      </Tabs>
      </TabOverlayOpenContext.Provider>
    </TabOverlayContext.Provider>
  );
}
