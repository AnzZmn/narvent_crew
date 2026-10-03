import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar, { Tab } from "../expo-my-profile/components/TabBar";
import * as Clipboard from "expo-clipboard";
import ProfileScreen from "./ProfileScreen";
import BankPage from "./pages/BankPage";
import DocumentsPage from "./pages/DocumentsPage";
import SkillsPage from "./pages/SkillsPage";
import QrSheet from "./components/QrSheet";
import ScreenBackground from "./components/ScreenBackground";
import SlidePage from "./components/SlidePage";
import Toast from "./components/Toast";
import { Variant, VariantContext } from "./components/theme";
import { ProfileServices, defaultServices } from "./services/profileServices";
import { sampleProfile } from "./sampleData";
import {
  BankDetails,
  DocumentUpload,
  EditDraft,
  ProfileData,
  SkillsData,
} from "./types";

type Page = "skills" | "bank" | "documents" | null;
type MaybeAsync<T> = (v: T) => Promise<void> | void;

export type ProfileFlowProps = {
  /** defaults to the mockup data */
  data?: ProfileData;
  /** force 'glass' or 'flat'; default is glass on iOS, flat on Android */
  variant?: Variant;
  /** true when the (tabs) layout draws the tab bar (expo-tabs setup) */
  hideTabBar?: boolean;
  /** true while a page or sheet covers the profile, so the layout can hide its tab bar */
  onOverlayChange?: (open: boolean) => void;
  onTabChange?: (tab: Tab) => void;
  onBack?: () => void;
  /** IFSC lookup, UPI verify, photo picker. Missing keys fall back to defaults/mocks. */
  services?: Partial<ProfileServices>;
  /** Persist. Throw to show "Couldn't save" and keep the local state unchanged. */
  onSaveProfile?: MaybeAsync<EditDraft>;
  onSaveSkills?: MaybeAsync<SkillsData>;
  onSaveBank?: MaybeAsync<BankDetails>;
  onUploadDocument?: MaybeAsync<DocumentUpload>;
  /** "Add" in Profile completion, for ids other than "skills" (photo, emergency…) */
  onAddMissing?: (id: string) => void;
  onEditPhoto?: () => void;
  /** default copies with expo-clipboard */
  onCopyId?: (nuId: string) => void;
  rateQr?: ImageSourcePropType;
};

const TAB_H = 58;

/** Profile + Skills, Bank and Documents pages + QR sheet + toast. No navigation library needed. */
export default function ProfileFlow(props: ProfileFlowProps) {
  const {
    data = sampleProfile,
    variant,
    hideTabBar = false,
    onOverlayChange,
    onTabChange,
  } = props;
  const insets = useSafeAreaInsets();
  const services = useMemo(
    () => ({ ...defaultServices, ...props.services }),
    [props.services],
  );

  const [profile, setProfile] = useState(data);
  useEffect(() => setProfile(data), [data]);

  const [tab, setTab] = useState(0);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [page, setPage] = useState<Page>(null);
  const [qr, setQr] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    onOverlayChange?.(page !== null || qr);
  }, [page, qr, onOverlayChange]);

  /** run the save callback; update local state + toast only if it succeeds */
  const persist = async <T,>(
    fn: MaybeAsync<T> | undefined,
    value: T,
    apply: () => void,
    ok: string,
  ) => {
    try {
      await fn?.(value);
      apply();
      flash(ok);
      return true;
    } catch {
      flash("Couldn’t save. Try again.");
      return false;
    }
  };
  const dropMissing =
    (id: string) =>
    (p: ProfileData): ProfileData => ({
      ...p,
      completion: {
        ...p.completion,
        missing: p.completion.missing.filter((m) => m.id !== id),
      },
    });

  const toggleEdit = async () => {
    if (!draft)
      return setDraft({
        personal: profile.personal,
        address: profile.address,
        education: profile.education,
      });
    const d = draft;
    if (
      await persist(
        props.onSaveProfile,
        d,
        () => setProfile((p) => ({ ...p, ...d })),
        "Profile saved",
      )
    )
      setDraft(null);
  };

  const closePage = useCallback(() => setPage(null), []);
  const closeQr = useCallback(() => setQr(false), []);

  const addMissing = (id: string) => {
    if (id === "skills") return setPage("skills");
    if (props.onAddMissing) return props.onAddMissing(id);
    const item = profile.completion.missing.find((m) => m.id === id);
    setProfile(dropMissing(id));
    flash(`${item?.label ?? "Detail"} added`);
  };

  const copyId = () => {
    {
      /*if (props.onCopyId) props.onCopyId(profile.nuId);
    else Clipboard.setStringAsync(profile.nuId);
    flash("Nu.Id copied");*/
    }
  };

  const tabBottom = Math.max(insets.bottom, 10) + 14;

  const content = (
    <View style={styles.root}>
      <ScreenBackground />
      <ProfileScreen
        profile={profile}
        draft={draft}
        onDraftChange={setDraft}
        tab={tab}
        onTabChange={setTab}
        onToggleEdit={toggleEdit}
        onCopyId={copyId}
        onEditPhoto={props.onEditPhoto}
        onShowQr={() => setQr(true)}
        onAddMissing={addMissing}
        onOpenSkills={() => setPage("skills")}
        onOpenBank={() => setPage("bank")}
        onOpenDocuments={() => setPage("documents")}
        onBack={props.onBack}
        bottomSpace={TAB_H + tabBottom + 24}
      />

      <SlidePage open={page === "skills"} onBack={closePage}>
        <SkillsPage
          initial={profile.skills}
          onBack={closePage}
          onSave={(s) =>
            persist(
              props.onSaveSkills,
              s,
              () =>
                setProfile((p) => dropMissing("skills")({ ...p, skills: s })),
              "Skills & experience saved",
            ).then((ok) => ok && closePage())
          }
        />
      </SlidePage>

      <SlidePage open={page === "bank"} onBack={closePage}>
        <BankPage
          bank={profile.bank}
          services={services}
          onBack={closePage}
          onSave={async (b) => {
            if (
              await persist(
                props.onSaveBank,
                b,
                () => setProfile((p) => ({ ...p, bank: b })),
                "Bank details saved",
              )
            )
              closePage();
          }}
        />
      </SlidePage>

      <SlidePage open={page === "documents"} onBack={closePage}>
        <DocumentsPage
          documents={profile.documents}
          services={services}
          onBack={closePage}
          onSubmit={async (u) => {
            const name =
              profile.documents.find((d) => d.id === u.id)?.name ?? "Document";
            const ok = await persist(
              props.onUploadDocument,
              u,
              () =>
                setProfile((p) => ({
                  ...p,
                  documents: p.documents.map((d) =>
                    d.id === u.id
                      ? {
                          ...d,
                          status: "review",
                          number: u.number,
                          expiry: u.expiry ?? d.expiry,
                        }
                      : d,
                  ),
                })),
              `${name} sent for review`,
            );
            if (!ok) throw new Error("upload failed"); // keeps the sheet open
          }}
        />
      </SlidePage>

      {!hideTabBar && page === null && !qr ? (
        <TabBar
          active="profile"
          onChange={(t) => onTabChange?.(t)}
          bottom={tabBottom}
        />
      ) : null}

      <QrSheet
        open={qr}
        onClose={closeQr}
        nuId={profile.nuId}
        qr={props.rateQr}
      />
      <Toast message={toast} />
    </View>
  );

  return variant ? (
    <VariantContext.Provider value={variant}>{content}</VariantContext.Provider>
  ) : (
    content
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
