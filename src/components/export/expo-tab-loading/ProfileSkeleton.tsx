import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProfileBackground from '../expo-my-profile/components/ProfileBackground';
import DetailHeader from '../expo-my-profile/components/DetailHeader';
import {C, P, Variant, VariantContext} from '../expo-my-profile/components/theme';
import {VariantContext as HomeVariant} from '../expo-worker-home/components/theme';
import Surface from '../expo-worker-home/components/Surface';
import {Bone, ShimmerProvider} from './Shimmer';

/**
 * My Profile while data loads. Title, back arrow, form labels and field shells are real;
 * the values, avatar, ID details and QR are bones. No tab bar: the layout owns it.
 */
export default function ProfileSkeleton({variant, onBack}: {variant?: Variant; onBack?: () => void}) {
  const look: Variant = variant ?? (Platform.OS === 'ios' ? 'glass' : 'flat');
  const glass = look === 'glass';
  const insets = useSafeAreaInsets();

  const field = (label: string, w: `${number}%`) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, glass ? styles.boxGlass : styles.boxFlat]}>
        <Bone width={w} height={10} radius={5} />
      </View>
    </View>
  );

  return (
    <VariantContext.Provider value={look}>
      <HomeVariant.Provider value={look}>
        <ShimmerProvider glass={glass}>
          <View style={[styles.root, {paddingTop: insets.top}]} accessible accessibilityLabel="Loading profile" accessibilityState={{busy: true}}>
            <ProfileBackground />
            <DetailHeader title="My Profile" onBack={onBack ?? (() => {})} />
            <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>
              <Surface radius={14} style={[styles.card, styles.idRow]}>
                <Bone width="29%" aspectRatio={1} radius={999} style={styles.avatar} />
                <View style={styles.idText}>
                  <Bone width="78%" height={15} radius={7} />
                  <Bone width="52%" height={9} radius={5} />
                  <Bone width="46%" height={9} radius={5} />
                  <Bone height={32} radius={9} style={{marginTop: 4}} />
                </View>
              </Surface>

              <Surface radius={14} style={[styles.card, styles.qr]}>
                <Bone width="68%" aspectRatio={1} radius={12} style={styles.qrBone} />
                <Bone width={84} height={12} />
              </Surface>

              <View style={styles.fields}>
                {field('Full Name', '58%')}
                <View style={styles.pair}>
                  {field('DOB', '62%')}
                  {field('Gender', '38%')}
                </View>
                {field('Phone No:', '40%')}
                {field('Email address', '70%')}
                {field('Aadhar No:', '46%')}
              </View>

              <View style={[styles.section, glass ? styles.sectionGlass : styles.sectionFlat]}>
                <Text style={styles.sectionText}>Current Address</Text>
              </View>
              <View style={styles.fields}>{field('Address', '66%')}</View>
            </ScrollView>
          </View>
        </ShimmerProvider>
      </HomeVariant.Provider>
    </VariantContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, overflow: 'hidden'},
  card: {marginHorizontal: 14, marginTop: 14, padding: 16},
  idRow: {flexDirection: 'row', gap: 14},
  avatar: {maxWidth: 96, alignSelf: 'flex-start'},
  idText: {flex: 1, minWidth: 0, alignItems: 'flex-end', gap: 7, paddingTop: 4},
  qr: {alignItems: 'center', gap: 12, padding: 18},
  qrBone: {maxWidth: 200},
  fields: {marginHorizontal: 14, marginTop: 18, gap: 10},
  pair: {flexDirection: 'row', gap: 10},
  fieldWrap: {flex: 1, minWidth: 0},
  label: {fontSize: 11, color: C.ink, marginBottom: 5},
  box: {height: 40, borderWidth: 1, justifyContent: 'center', paddingHorizontal: 12},
  boxGlass: {borderRadius: 9, borderColor: 'rgba(255,255,255,0.72)', backgroundColor: 'rgba(255,255,255,0.5)'},
  boxFlat: {borderRadius: 8, borderColor: P.inputBorder, backgroundColor: P.inputBg},
  section: {marginHorizontal: 14, marginTop: 16, height: 26, borderRadius: 13, justifyContent: 'center', paddingHorizontal: 14},
  sectionGlass: {backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.72)'},
  sectionFlat: {backgroundColor: P.tint},
  sectionText: {fontSize: 11, fontWeight: '500', color: P.violet},
});
