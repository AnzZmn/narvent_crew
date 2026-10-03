import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Card from "./components/Card";
import CompletionCard from "./components/CompletionCard";
import FieldGrid from "./components/FieldGrid";
import IdentityCard from "./components/IdentityCard";
import ManageRow from "./components/ManageRow";
import PageHeader, { HEADER_H } from "./components/PageHeader";
import Segmented from "./components/Segmented";
import SkillsSection from "./components/SkillsSection";
import SoftPill from "./components/SoftPill";
import { Icon, PATHS } from "./components/icons";
import { C, font } from "./components/theme";
import {
  PROFILE_TABS,
  addressRows,
  bankSummary,
  docSummary,
  educationRows,
  idRows,
  personalRows,
} from "./profileRows";
import { EditDraft, ProfileData } from "./types";

export type ProfileScreenProps = {
  profile: ProfileData;
  /** non-null while Edit is on */
  draft: EditDraft | null;
  onDraftChange: (d: EditDraft) => void;
  tab: number;
  onTabChange: (i: number) => void;
  onToggleEdit: () => void;
  onCopyId: () => void;
  onEditPhoto?: () => void;
  onShowQr: () => void;
  onAddMissing: (id: string) => void;
  onOpenSkills: () => void;
  onOpenBank: () => void;
  onOpenDocuments: () => void;
  /** shows a back arrow in the header (leave undefined on a tab root) */
  onBack?: () => void;
  /** bottom padding so the floating tab bar doesn't cover the last card */
  bottomSpace: number;
};

/** The scrolling My Profile screen. Stateless: ProfileFlow owns the state. */
export default function ProfileScreen(p: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const { profile, draft, tab } = p;
  const editing = !!draft;
  const src: EditDraft = draft ?? {
    personal: profile.personal,
    address: profile.address,
    education: profile.education,
  };

  const rows = [
    personalRows(src.personal),
    addressRows(src.address),
    educationRows(src.education),
    idRows(profile),
  ][tab];

  const onChange = (key: string, value: string) => {
    if (!draft) return;
    if (tab === 0)
      p.onDraftChange({
        ...draft,
        personal: { ...draft.personal, [key]: value },
      });
    if (tab === 1)
      p.onDraftChange({
        ...draft,
        address: { ...draft.address, [key]: value },
      });
    if (tab === 2)
      p.onDraftChange({
        ...draft,
        education: { ...draft.education, [key]: value },
      });
  };
  const onToggle = (key: string) => {
    if (draft && key === "studying")
      p.onDraftChange({
        ...draft,
        education: { ...draft.education, studying: !draft.education.studying },
      });
  };

  const docs = docSummary(profile.documents);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + HEADER_H,
          paddingBottom: p.bottomSpace,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <IdentityCard
          name={profile.name}
          initials={profile.initials}
          photoUri={profile.photoUri}
          nuId={profile.nuId}
          verified={profile.verified}
          workDone={profile.workDone}
          stats={[
            {
              value: `${Math.round(profile.workDone * 100)}%`,
              label: "Work done",
            },
            { value: profile.rating.toFixed(1), label: "Rating" },
            { value: String(profile.jobs), label: "Jobs" },
          ]}
          onCopyId={p.onCopyId}
          onEditPhoto={p.onEditPhoto}
          onShowQr={p.onShowQr}
        />
        <CompletionCard
          total={profile.completion.total}
          missing={profile.completion.missing}
          onAdd={p.onAddMissing}
        />

        <Segmented
          options={PROFILE_TABS}
          index={tab}
          onChange={p.onTabChange}
          style={styles.tabs}
        />
        <FieldGrid
          rows={rows}
          editing={editing}
          onChange={onChange}
          onToggle={onToggle}
        />

        {tab === 3 ? (
          <Card style={styles.manage}>
            <ManageRow
              first
              icon={PATHS.bank}
              label="Bank details"
              sub={bankSummary(profile.bank)}
              onPress={p.onOpenBank}
            />
            <ManageRow
              icon={PATHS.doc}
              label="Documents"
              sub={docs.sub}
              badge={docs.requiredLeft}
              onPress={p.onOpenDocuments}
            />
          </Card>
        ) : null}

        {editing ? (
          <Text style={styles.note}>
            ID and bank details are updated from their own pages, below the ID &
            Bank tab.
          </Text>
        ) : null}

        <SkillsSection skills={profile.skills} onEdit={p.onOpenSkills} />
      </ScrollView>

      <PageHeader
        title="My Profile"
        onBack={p.onBack}
        right={
          <SoftPill
            height={36}
            onPress={p.onToggleEdit}
            accessibilityLabel={editing ? "Done editing" : "Edit profile"}
            style={editing ? styles.done : styles.edit}
          >
            {editing ? (
              <Text style={styles.doneText}>Done</Text>
            ) : (
              <Icon d={PATHS.pencil} size={15} strokeWidth={1.8} />
            )}
          </SoftPill>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabs: { marginTop: 18, marginHorizontal: 14 },
  manage: { marginTop: 10, marginHorizontal: 14, paddingHorizontal: 14 },
  note: {
    marginTop: 12,
    marginHorizontal: 18,
    ...font("400", 11, C.muted, 16),
  },
  edit: { width: 36, paddingHorizontal: 0 },
  done: { paddingHorizontal: 14 },
  doneText: font("500", 12, C.violet),
});
