import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SummaryTile from './SummaryTile';
import {Star} from './icons';
import {C} from './theme';

type Props = {width: number; height: number; rating: number; subtitle: string; onPress?: () => void};

export default function RatingCard({width, height, rating, subtitle, onPress}: Props) {
  const full = Math.floor(rating);
  return (
    <SummaryTile
      width={width}
      height={height}
      gradient={{to: '#FFEB9B', angleStop: 0.5}}
      onPress={onPress}
      accessibilityLabel={`Rating ${rating} out of 5, ${subtitle}`}>
      <Text style={styles.title}>Rating</Text>
      <Text style={styles.sub}>{subtitle}</Text>
      <View style={styles.bottom}>
        <View style={styles.scoreRow}>
          <Star size={22} on />
          <Text style={styles.score}>{rating.toFixed(1)}</Text>
        </View>
        <View style={styles.stars}>
          {Array.from({length: 5}, (_, i) => (
            <Star key={i} size={18} on={i < full} />
          ))}
        </View>
      </View>
    </SummaryTile>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 13, lineHeight: 16, fontWeight: '700', color: C.ink2, letterSpacing: -0.13},
  sub: {marginTop: 5, fontSize: 10, color: C.body},
  bottom: {flex: 1, minHeight: 0, justifyContent: 'flex-end', rowGap: 10, paddingBottom: 4},
  scoreRow: {flexDirection: 'row', alignItems: 'center', columnGap: 9},
  score: {fontSize: 24, lineHeight: 28, fontWeight: '700', color: C.ink2, letterSpacing: -0.48},
  stars: {flexDirection: 'row', columnGap: 6},
});
