import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Card from "../components/Card";
import DashedChip from "../components/DashedChip";
import HeaderAction from "../components/HeaderAction";
import PageHeader, { HEADER_H } from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SectionTitle from "../components/SectionTitle";
import Segmented from "../components/Segmented";
import SelectChip from "../components/SelectChip";
import SkillTag from "../components/SkillTag";
import Stepper from "../components/Stepper";
import TextField from "../components/TextField";
import WorkCard from "../components/WorkCard";
import WorkForm from "../components/WorkForm";
import { C, font } from "../components/theme";
import {
  EMPTY_SKILLS,
  LANGUAGES,
  SUGGESTIONS,
  TOOLS,
  TRADES,
} from "../catalog";
import { SkillsData } from "../types";
import { useTabOverlay } from "@/components/tabs/TabOverlay";

export type SkillsPageProps = {
  initial: SkillsData | null;
  onBack: () => void;
  onSave: (s: SkillsData) => void;
};

/** Trade, years, skills (+ suggestions), work history, languages, own tools. */
export default function SkillsPage({
  initial,
  onBack,
  onSave,
}: SkillsPageProps) {
  const insets = useSafeAreaInsets();
  const [ed, setEd] = useState<SkillsData>(() =>
    JSON.parse(JSON.stringify(initial ?? EMPTY_SKILLS)),
  );
  const [newSkill, setNewSkill] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const set = (p: Partial<SkillsData>) => setEd((e) => ({ ...e, ...p }));
  const addSkill = (v: string) => {
    const t = v.trim();
    if (t)
      setEd((e) =>
        e.skills.includes(t) ? e : { ...e, skills: [...e.skills, t] },
      );
  };
  const addTyped = () => {
    addSkill(newSkill);
    setNewSkill("");
  };
  const suggestions = (SUGGESTIONS[ed.trade] ?? [])
    .filter((s) => !ed.skills.includes(s))
    .slice(0, 6);
  const canSave = !!ed.trade;
  const save = () => canSave && onSave(ed);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + HEADER_H,
          paddingBottom: insets.bottom + 40,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle>Primary trade</SectionTitle>
        <View style={styles.wrap}>
          {TRADES.map((t) => (
            <SelectChip
              key={t}
              label={t}
              selected={t === ed.trade}
              onPress={() => set({ trade: t })}
            />
          ))}
        </View>

        <SectionTitle>Years of experience</SectionTitle>
        <Stepper value={ed.years} onChange={(years) => set({ years })} />

        <SectionTitle>Skills</SectionTitle>
        <Card style={styles.skillsCard}>
          <View style={styles.tags}>
            {ed.skills.map((s) => (
              <SkillTag
                key={s}
                label={s}
                onRemove={() =>
                  set({ skills: ed.skills.filter((x) => x !== s) })
                }
              />
            ))}
            {!ed.skills.length ? (
              <Text style={styles.muted}>No skills yet. Add one below.</Text>
            ) : null}
          </View>
          <View style={styles.addRow}>
            <TextField
              containerStyle={styles.grow}
              height={40}
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Type a skill"
              returnKeyType="done"
              onSubmitEditing={addTyped}
            />
            <PrimaryButton
              label="Add"
              height={40}
              fontSize={12.5}
              onPress={addTyped}
              disabled={!newSkill.trim()}
            />
          </View>
          {ed.trade && suggestions.length ? (
            <View style={styles.suggest}>
              <Text style={styles.suggestLabel}>Suggested for {ed.trade}</Text>
              <View style={styles.tags}>
                {suggestions.map((s) => (
                  <DashedChip key={s} label={s} onPress={() => addSkill(s)} />
                ))}
              </View>
            </View>
          ) : null}
        </Card>

        <SectionTitle>Work history</SectionTitle>
        {ed.history.map((w, i) => (
          <WorkCard
            key={`${w.role}-${w.from}-${i}`}
            entry={w}
            onRemove={() =>
              set({ history: ed.history.filter((_, j) => j !== i) })
            }
          />
        ))}
        {formOpen ? (
          <WorkForm
            onCancel={() => setFormOpen(false)}
            onAdd={(w) => {
              set({ history: [w, ...ed.history] });
              setFormOpen(false);
            }}
          />
        ) : (
          <DashedChip
            label="Add work experience"
            height={46}
            radius={14}
            fontSize={13}
            style={styles.mx}
            onPress={() => setFormOpen(true)}
          />
        )}

        <SectionTitle>Languages you speak</SectionTitle>
        <View style={styles.wrap}>
          {LANGUAGES.map((l) => {
            const on = ed.languages.includes(l);
            return (
              <SelectChip
                key={l}
                multi
                label={l}
                selected={on}
                onPress={() =>
                  set({
                    languages: on
                      ? ed.languages.filter((x) => x !== l)
                      : [...ed.languages, l],
                  })
                }
              />
            );
          })}
        </View>

        <SectionTitle>Do you bring your own tools?</SectionTitle>
        <Segmented
          options={TOOLS}
          index={Math.max(0, TOOLS.indexOf(ed.tools))}
          onChange={(i) => set({ tools: TOOLS[i] })}
          style={styles.mx}
        />

        <PrimaryButton
          label="Save skills & experience"
          disabled={!canSave}
          onPress={save}
          style={styles.save}
        />
      </ScrollView>
      <PageHeader
        title="Skills & experience"
        onBack={onBack}
        right={<HeaderAction label="Save" disabled={!canSave} onPress={save} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wrap: {
    marginHorizontal: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  mx: { marginHorizontal: 14 },
  skillsCard: { marginHorizontal: 14, padding: 14 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  muted: font("400", 11.5, C.muted),
  addRow: { marginTop: 12, flexDirection: "row", gap: 8 },
  grow: { flex: 1, minWidth: 0 },
  suggest: { marginTop: 14 },
  suggestLabel: { marginBottom: 6, ...font("400", 10.5, C.muted) },
  save: { marginTop: 26, marginHorizontal: 14 },
});
