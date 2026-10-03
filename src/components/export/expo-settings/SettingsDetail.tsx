import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenBackground from "./components/ScreenBackground";
import DetailHeader from "./components/DetailHeader";
import BlockView from "./components/BlockView";
import type { SettingsPage, SettingsPageId } from "./types";

type Props = {
  id: SettingsPageId;
  page: SettingsPage;
  onBack: () => void;
  /** fired by the page's button with the edited field values (profile / payment) */
  onSave?: (id: SettingsPageId, values: Record<string, string>) => void;
  logo?: { mark: any; wordmark: any };
};

export default function SettingsDetail({
  id,
  page,
  onBack,
  onSave,
  logo,
}: Props) {
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState<Record<string, string>>({});
  const onChange = (k: string, v: string) =>
    setValues((s) => ({ ...s, [k]: v }));
  const onButton = () => {
    const all: Record<string, string> = {};
    page.blocks.forEach((b) => {
      if (b.type === "field") all[b.key] = values[b.key] ?? b.value;
    });
    onSave?.(id, all);
    onBack();
  };

  // count consecutive 'row' blocks so they get grouped corner radii
  const rowPos: { i: number; n: number }[] = [];
  for (let i = 0; i < page.blocks.length; i++) {
    if (page.blocks[i].type !== "row") continue;
    let s = i;
    while (s > 0 && page.blocks[s - 1].type === "row") s--;
    let e = i;
    while (e < page.blocks.length - 1 && page.blocks[e + 1].type === "row") e++;
    rowPos[i] = { i: i - s, n: e - s + 1 };
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScreenBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ paddingTop: insets.top }}>
          <DetailHeader title={page.title} onBack={onBack} />
        </View>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={{ paddingBottom: insets.bottom + 34 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {page.blocks.map((b, i) => (
            <BlockView
              key={i}
              block={b}
              rowIndex={rowPos[i]?.i}
              rowCount={rowPos[i]?.n}
              values={values}
              onChange={onChange}
              onButton={onButton}
              logo={logo}
            />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
