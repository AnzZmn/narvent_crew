import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Card from "../components/Card";
import DocProgress from "../components/DocProgress";
import DocumentRow from "../components/DocumentRow";
import PageHeader, { HEADER_H } from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import UploadSheet from "../components/UploadSheet";
import { C, font } from "../components/theme";
import { ProfileServices } from "../services/profileServices";
import { DocumentItem, DocumentUpload } from "../types";

export type DocumentsPageProps = {
  documents: DocumentItem[];
  onBack: () => void;
  /** Upload the photos, then resolve. Throw to keep the sheet open. */
  onSubmit: (u: DocumentUpload) => Promise<void> | void;
  services: Pick<ProfileServices, "pickDocumentPhoto">;
};

/** Required and optional documents. Upload / Replace opens the upload sheet. */
export default function DocumentsPage({
  documents,
  onBack,
  onSubmit,
  services,
}: DocumentsPageProps) {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<string | null>(null);
  const doc = documents.find((d) => d.id === active) ?? null;
  const groups = [
    { title: "Required", items: documents.filter((d) => d.required) },
    { title: "Optional", items: documents.filter((d) => !d.required) },
  ].filter((g) => g.items.length);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + HEADER_H,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DocProgress documents={documents} />
        {groups.map((g) => (
          <View key={g.title}>
            <SectionTitle>{g.title}</SectionTitle>
            <Card style={styles.group}>
              {g.items.map((d, i) => (
                <DocumentRow
                  key={d.id}
                  doc={d}
                  first={i === 0}
                  onAction={() => setActive(d.id)}
                />
              ))}
            </Card>
          </View>
        ))}
        <Text style={styles.foot}>
          Clear photos or PDFs, under 5 MB. Documents are reviewed within 24
          hours and only shared with Narvent’s verification team.
        </Text>
      </ScrollView>
      <PageHeader title="Documents" onBack={onBack} />
      <UploadSheet
        doc={doc}
        onClose={() => setActive(null)}
        pickPhoto={services.pickDocumentPhoto}
        onSubmit={async (u) => {
          await onSubmit(u);
          setActive(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  group: { marginHorizontal: 14, paddingHorizontal: 14 },
  foot: {
    marginTop: 16,
    marginHorizontal: 18,
    ...font("400", 11, C.muted, 16),
  },
});
