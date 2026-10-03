import React, {useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text} from 'react-native';
import DetailScreen from '../components/DetailScreen';
import ChatBubble from '../components/ChatBubble';
import QuickReplies from '../components/QuickReplies';
import ChatComposer from '../components/ChatComposer';
import {C, Variant} from '../components/theme';
import type {ChatItem} from '../types';

export type ChatbotDetailProps = {
  initial: ChatItem[];
  onBack: () => void;
  /** return a reply string to append it as a bot message */
  onSend?: (text: string) => Promise<string | void> | string | void;
  variant?: Variant;
};

let seq = 0;
const nextId = () => `local-${Date.now()}-${seq++}`;

export default function ChatbotDetail({initial, onBack, onSend, variant}: ChatbotDetailProps) {
  const [items, setItems] = useState<ChatItem[]>(initial);
  const scrollRef = useRef<ScrollView>(null);

  const send = async (text: string) => {
    setItems(list => [...list, {id: nextId(), kind: 'message', from: 'me', text}]);
    try {
      const reply = await onSend?.(text);
      if (typeof reply === 'string' && reply) {
        setItems(list => [...list, {id: nextId(), kind: 'message', from: 'bot', text: reply}]);
      }
    } catch (err) {
      console.error('[Chatbot] onSend failed', err);
    }
  };

  return (
    <DetailScreen title="Chatbot" onBack={onBack} variant={variant} scroll={false}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({animated: true})}>
          {items.map(it =>
            it.kind === 'day' ? (
              <Text key={it.id} style={styles.day}>{it.text}</Text>
            ) : it.kind === 'replies' ? (
              <QuickReplies key={it.id} options={it.options} onPick={send} />
            ) : (
              <ChatBubble key={it.id} from={it.from} text={it.text} />
            ),
          )}
        </ScrollView>
        <ChatComposer onSend={send} />
      </KeyboardAvoidingView>
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  thread: {paddingTop: 10, paddingHorizontal: 16, rowGap: 10},
  day: {textAlign: 'center', fontSize: 10.5, fontWeight: '500', color: C.muted},
});
