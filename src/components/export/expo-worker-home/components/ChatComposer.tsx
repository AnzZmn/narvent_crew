import React, {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {BlurView} from 'expo-blur';
import {SendIcon} from './icons';
import {C, useGlass} from './theme';

/** "type your concern" field with send. Send is dimmed until there is text. */
export default function ChatComposer({onSend}: {onSend: (text: string) => void}) {
  const glass = useGlass();
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  const content = (
    <>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="type your concern"
        placeholderTextColor={C.faint}
        returnKeyType="send"
        onSubmitEditing={send}
        blurOnSubmit={false}
        style={styles.input}
        accessibilityLabel="Message"
      />
      <Pressable onPress={send} disabled={!canSend} hitSlop={12} accessibilityRole="button" accessibilityLabel="Send" accessibilityState={{disabled: !canSend}} style={!canSend && styles.dim}>
        <SendIcon />
      </Pressable>
    </>
  );

  return (
    <View style={styles.wrap}>
      {glass ? (
        <BlurView intensity={50} tint="light" style={[styles.field, styles.glass]}>
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.glassFill]} />
          {content}
        </BlurView>
      ) : (
        <View style={[styles.field, styles.flat]}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingTop: 12, paddingHorizontal: 16, paddingBottom: 20},
  field: {height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingHorizontal: 18},
  glass: {overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)'},
  glassFill: {backgroundColor: 'rgba(255,255,255,0.55)'},
  flat: {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.line, elevation: 2},
  input: {flex: 1, height: '100%', fontSize: 16, color: C.ink, padding: 0},
  dim: {opacity: 0.4},
});
