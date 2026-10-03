import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Background from '../expo-worker-home/components/Background';
import Surface from '../expo-worker-home/components/Surface';
import {C, Variant, VariantContext} from '../expo-worker-home/components/theme';
import {Bone, ShimmerProvider} from './Shimmer';

const TAB_H = 58;
const BARS = [70, 52, 44, 90, 58, 36, 20, 30];

/**
 * Worker Home while data loads. Real chrome (header pill, menu icon, section titles) renders
 * as-is; only data is bones, sized like the real content so nothing shifts on arrival.
 * No tab bar: the layout owns it.
 */
export default function HomeSkeleton({variant}: {variant?: Variant}) {
  const look: Variant = variant ?? (Platform.OS === 'ios' ? 'glass' : 'flat');
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const kpiW = Math.min(width * 0.497, 179);
  const tabBottom = Math.max(insets.bottom, 10) + 14;

  const inner = [styles.inner, look === 'glass' ? styles.innerGlass : styles.innerFlat];

  return (
    <VariantContext.Provider value={look}>
      <ShimmerProvider glass={look === 'glass'}>
        <View style={styles.root} accessible accessibilityLabel="Loading home" accessibilityState={{busy: true}}>
          <Background />
          <ScrollView
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingTop: insets.top + 10, paddingBottom: tabBottom + TAB_H + 26}}>
            <Surface radius={26} style={styles.pill}>
              <Bone width={110} height={14} radius={7} />
              <View style={styles.menu}>
                {[18, 18, 12].map((w, i) => (
                  <View key={i} style={[styles.menuLine, {width: w}]} />
                ))}
              </View>
            </Surface>

            <View style={styles.kpiRow}>
              {[0, 1, 2].map(i => (
                <Surface key={i} radius={8} style={[styles.kpi, {width: kpiW}]}>
                  <Bone width="62%" height={12} />
                  <Bone width="38%" height={9} radius={5} />
                  <View style={styles.flex} />
                  {i === 0 && <Bone width="56%" aspectRatio={2} radius={74} style={styles.center} />}
                  {i === 1 && (
                    <View style={styles.bars}>
                      {BARS.map((h, j) => (
                        <Bone key={j} width={undefined} height={undefined} radius={2} style={{flex: 1, height: `${h}%`}} />
                      ))}
                    </View>
                  )}
                  {i === 2 && <Bone width="54%" height={22} />}
                </Surface>
              ))}
            </View>

            <Surface style={styles.card}>
              <Text style={styles.title}>Statistics</Text>
              <View style={styles.grid}>
                {[0, 1, 2, 3].map(i => (
                  <View key={i} style={[inner, styles.tile]}>
                    <Bone width="58%" height={15} />
                    <Bone width="42%" height={9} radius={5} />
                  </View>
                ))}
              </View>
            </Surface>

            <Surface style={styles.card}>
              <Text style={styles.title}>Ongoing Work</Text>
              <View style={[inner, styles.item]}>
                <View style={styles.between}>
                  <Bone width="46%" height={13} />
                  <Bone width="18%" height={13} />
                </View>
                <Bone width="64%" height={10} radius={5} />
                <Bone width="30%" height={11} radius={5} />
                <Bone height={46} radius={23} style={{marginTop: 4}} />
              </View>
            </Surface>

            <Surface tone="tint" style={styles.card}>
              <Text style={styles.title}>Payments</Text>
              {[0, 1].map(i => (
                <View key={i} style={[inner, styles.item, {gap: 9}]}>
                  <View style={styles.between}>
                    <Bone width="44%" height={13} />
                    <Bone width="16%" height={13} />
                  </View>
                  <Bone width="28%" height={10} radius={5} />
                </View>
              ))}
            </Surface>
          </ScrollView>
        </View>
      </ShimmerProvider>
    </VariantContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, overflow: 'hidden'},
  flex: {flex: 1},
  center: {alignSelf: 'center'},
  pill: {marginHorizontal: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 22, paddingRight: 12},
  menu: {width: 44, height: 44, justifyContent: 'center', alignItems: 'center', gap: 4},
  menuLine: {height: 2, borderRadius: 1, backgroundColor: C.ink, alignSelf: 'center'},
  kpiRow: {flexDirection: 'row', gap: 9, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 4, overflow: 'hidden'},
  kpi: {aspectRatio: 179 / 155, paddingVertical: 14, paddingHorizontal: 16, gap: 7},
  bars: {flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: '42%'},
  card: {marginHorizontal: 14, marginTop: 14, padding: 18, gap: 10},
  title: {fontSize: 16, lineHeight: 19, fontWeight: '700', color: C.ink, letterSpacing: -0.16, marginBottom: 4},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  tile: {width: '47%', flexGrow: 1, paddingVertical: 12, paddingHorizontal: 14, gap: 7, borderRadius: 12},
  inner: {borderRadius: 14},
  innerGlass: {backgroundColor: 'rgba(255,255,255,0.42)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)'},
  innerFlat: {backgroundColor: '#F6F5FC'},
  item: {padding: 14, gap: 10},
  between: {flexDirection: 'row', justifyContent: 'space-between', gap: 10},
});
