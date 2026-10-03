import React, {useEffect} from 'react';
import {BackHandler, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Background from './Background';
import DetailHeader from './DetailHeader';
import {Variant, VariantContext} from './theme';

type Props = {
  title: string;
  onBack: () => void;
  variant?: Variant;
  /** false = fixed layout (chat); children manage their own scroll */
  scroll?: boolean;
  children: React.ReactNode;
};

/** Shell for every detail screen: ground, safe area, header, scroll, Android hardware back. */
export default function DetailScreen({title, onBack, variant, scroll = true, children}: Props) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const body = (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Background />
      <DetailHeader title={title} onBack={onBack} />
      {scroll ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: insets.bottom + 30}}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fixed, {paddingBottom: insets.bottom}]}>{children}</View>
      )}
    </View>
  );

  return variant ? <VariantContext.Provider value={variant}>{body}</VariantContext.Provider> : body;
}

const styles = StyleSheet.create({
  root: {flex: 1, overflow: 'hidden'},
  fixed: {flex: 1, minHeight: 0},
});
