/**
 * Narvent — Setup Profile, iOS glass (iPhone SE 375×667 / iPhone 15·16 393×852).
 * Expo + StyleSheet.create. No NativeWind.
 *
 *   npx expo install expo-blur react-native-svg react-native-safe-area-context \
 *     expo-image-picker @react-native-community/datetimepicker
 *
 * Wrap the app root in <SafeAreaProvider>.
 *
 * Same four steps as SetupProfileAndroid (photo + name, DOB, Aadhar number,
 * Aadhar card), rebuilt as frosted glass: the card, inputs, drop zone and date
 * sheet are BlurViews with a translucent white fill, a bright hairline border
 * and a top highlight. Offsets are computed from the height left after the
 * safe-area insets, so the SE (home button, no notch) and the 15/16 (Dynamic
 * Island + home indicator) both fit without scrolling. When the keyboard is up
 * the card lifts and the avatar shrinks so Next stays reachable on the SE.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const PURPLE = "#7D69FF";
const INK = "#0E0E14";
const MUTED = "#6F6A92";
const PLACEHOLDER = "#9C98BA";
const TEXTURE = require("./assets/arrow-texture.png");
const TOTAL = 4;

export type ProfileData = {
  photoUri: string | null;
  firstName: string;
  /** ISO yyyy-mm-dd */
  dob: string;
  /** 12 digits, no spaces */
  aadhar: string;
  aadharCardUri: string;
};

/* ------------------------------------------------------------------ icons */

function BackArrow() {
  return (
    <Svg width={20} height={15} viewBox="0 0 22 16" fill="none">
      <Path
        d="M21 8H2M2 8L8.4 1.6M2 8L8.4 14.4"
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function NextArrow() {
  return (
    <Svg width={15} height={11} viewBox="0 0 15 11" fill="none">
      <Path
        d="M1 5.5H13M13 5.5L8.6 1.2M13 5.5L8.6 9.8"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AvatarGlyph({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx={24} cy={16} r={9} fill={PURPLE} />
      <Ellipse cx={24} cy={36} rx={15} ry={9} fill={PURPLE} />
    </Svg>
  );
}

function Pencil({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M1.5 10.5L2 8L8.5 1.5L10.5 3.5L4 10L1.5 10.5Z" fill="#fff" />
    </Svg>
  );
}

function CalendarIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 16 16" fill="none">
      <Rect
        x={1.5}
        y={3}
        width={13}
        height={11.5}
        rx={2.5}
        stroke={PURPLE}
        strokeWidth={1.5}
      />
      <Path
        d="M1.5 6.5H14.5M5 1.5V4M11 1.5V4"
        stroke={PURPLE}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function UploadIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 16V4M12 4L7 9M12 4L17 9"
        stroke={PURPLE}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 16v2a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-2"
        stroke={PURPLE}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** lavender glow blobs behind the glass so the blur has something to pick up */
function GlassGround({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="g1" cx="18%" cy="22%" r="55%">
          <Stop offset="0" stopColor="#B7A8FF" stopOpacity="0.75" />
          <Stop offset="1" stopColor="#B7A8FF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="g2" cx="88%" cy="70%" r="60%">
          <Stop offset="0" stopColor="#9C88FF" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#9C88FF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient
          id="wash"
          cx="50%"
          cy="24%"
          rx="112%"
          ry="62%"
          fx="50%"
          fy="24%"
        >
          <Stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#EFEBFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#g1)" />
      <Rect width={width} height={height} fill="url(#g2)" />
      <Rect width={width} height={height} fill="url(#wash)" />
    </Svg>
  );
}

/* ---------------------------------------------------------------- helpers */

function formatDob(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** DD/MM/YYYY -> ISO date if it is a real date and the person is 18–100 */
function parseDob(text: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!m) return null;
  const [dd, mm, yyyy] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(yyyy, mm - 1, dd);
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  )
    return null;
  const now = new Date();
  let age = now.getFullYear() - yyyy;
  if (
    now.getMonth() < mm - 1 ||
    (now.getMonth() === mm - 1 && now.getDate() < dd)
  )
    age--;
  if (age < 18 || age > 100) return null;
  return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

function toDisplay(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function formatAadhar(raw: string) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 12)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardWillShow", () =>
      setVisible(true),
    );
    const hide = Keyboard.addListener("keyboardWillHide", () =>
      setVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

/* ------------------------------------------------------------- glass bits */

function Glass({
  intensity,
  style,
  fill,
  children,
}: {
  intensity: number;
  style?: any;
  fill?: string;
  children?: React.ReactNode;
}) {
  return (
    <BlurView
      intensity={intensity}
      tint="light"
      style={[styles.glassBase, style]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: fill ?? "rgba(255,255,255,0.45)" },
        ]}
        pointerEvents="none"
      />
      <View style={styles.highlight} pointerEvents="none" />
      {children}
    </BlurView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function StepHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <View>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

/* ----------------------------------------------------------------- screen */

type Props = {
  onBack?: () => void;
  onSubmit?: (data: ProfileData) => void | Promise<void>;
  initial?: Partial<Pick<ProfileData, "firstName" | "photoUri">>;
};

export default function SetupProfileIOS({ onBack, onSubmit, initial }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const kb = useKeyboardVisible();

  const [step, setStep] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(
    initial?.photoUri ?? null,
  );
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [dobText, setDobText] = useState("");
  const [aadharText, setAadharText] = useState("");
  const [cardUri, setCardUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(new Date());

  // Offsets from the usable height, so the SE (20 top / 0 bottom inset) and
  // the 15/16 (59 / 34) both land on the mockup's proportions.
  const usable = height - insets.top - insets.bottom;
  const compact = usable < 640; // iPhone SE
  const headerTop = usable * (compact ? 0.012 : 0.02);
  const side = width * 0.04;
  const cardGap = usable * 0.018;
  const bottom = Math.max(
    usable * (compact ? 0.024 : 0.03),
    insets.bottom ? 8 : 16,
  );
  const padTop = usable * (compact ? 0.036 : 0.046);
  const padBottom = usable * (compact ? 0.028 : 0.034);
  const gap = kb ? 12 : usable * (compact ? 0.022 : 0.026);
  const avatar = kb
    ? 76
    : Math.min(width * (compact ? 0.28 : 0.33), compact ? 104 : 124);
  const dropMin = usable * (compact ? 0.2 : 0.22);

  const dobIso = useMemo(() => parseDob(dobText), [dobText]);
  const aadharDigits = aadharText.replace(/\D/g, "");

  const valid = [
    firstName.trim().length >= 2,
    !!dobIso,
    aadharDigits.length === 12 && !/^[01]/.test(aadharDigits),
    !!cardUri,
  ][step];

  const progress = useRef(new Animated.Value(1 / TOTAL)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step + 1) / TOTAL,
      duration: 300,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [step, progress]);

  const now = new Date();
  const maxDate = new Date(
    now.getFullYear() - 18,
    now.getMonth(),
    now.getDate(),
  );
  const minDate = new Date(now.getFullYear() - 100, 0, 1);

  const pickImage = async (
    aspect: [number, number],
    set: (uri: string) => void,
  ) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect,
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]) set(res.assets[0].uri);
  };

  const openDateSheet = () => {
    Keyboard.dismiss();
    setDraftDate(
      dobIso ? new Date(dobIso) : new Date(now.getFullYear() - 25, 0, 1),
    );
    setSheetOpen(true);
  };

  const back = () => {
    Keyboard.dismiss();
    if (step === 0) onBack?.();
    else setStep((s) => s - 1);
  };

  const next = async () => {
    if (!valid || busy) return;
    Keyboard.dismiss();
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
      return;
    }
    setBusy(true);
    try {
      await onSubmit?.({
        photoUri,
        firstName: firstName.trim(),
        dob: dobIso!,
        aadhar: aadharDigits,
        aadharCardUri: cardUri!,
      });
    } catch (err) {
      console.error("[SetupProfile] onSubmit failed", err);
    } finally {
      setBusy(false);
    }
  };

  const isLast = step === TOTAL - 1;
  const disabled = !valid || busy;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={TEXTURE}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
        imageStyle={styles.texture}
      />
      <GlassGround width={width} height={height} />

      <KeyboardAvoidingView
        behavior="padding"
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: kb ? 0 : insets.bottom },
        ]}
      >
        <View
          style={[
            styles.header,
            { paddingTop: headerTop, paddingHorizontal: side },
          ]}
        >
          <Pressable
            onPress={back}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Glass
              intensity={50}
              style={styles.backBtn}
              fill="rgba(255,255,255,0.5)"
            >
              <BackArrow />
            </Glass>
          </Pressable>
          <Text style={styles.headerTitle}>Setup Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Glass
          intensity={60}
          fill="rgba(255,255,255,0.42)"
          style={[
            styles.card,
            {
              marginTop: cardGap,
              marginHorizontal: side,
              marginBottom: kb ? 10 : bottom,
              paddingTop: kb ? 20 : padTop,
              paddingBottom: kb ? 16 : padBottom,
            },
          ]}
        >
          <View style={styles.progressRow}>
            <View style={styles.track}>
              <Animated.View
                style={[
                  styles.fill,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text
              style={styles.stepLabel}
            >{`Step ${step + 1} of ${TOTAL}`}</Text>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={[styles.bodyContent, { rowGap: gap }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {step === 0 && (
              <>
                <Pressable
                  onPress={() => pickImage([1, 1], setPhotoUri)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    photoUri ? "Change profile photo" : "Add profile photo"
                  }
                  style={[styles.avatarWrap, { width: avatar, height: avatar }]}
                >
                  <View style={[styles.avatar, { borderRadius: avatar / 2 }]}>
                    {photoUri ? (
                      <Image
                        source={{ uri: photoUri }}
                        style={StyleSheet.absoluteFill}
                      />
                    ) : (
                      <AvatarGlyph size={avatar * 0.56} />
                    )}
                  </View>
                  <View
                    style={[
                      styles.avatarBadge,
                      {
                        width: avatar * 0.26,
                        height: avatar * 0.26,
                        borderRadius: avatar * 0.13,
                      },
                    ]}
                  >
                    <Pencil size={avatar * 0.26 * 0.52} />
                  </View>
                </Pressable>
                <Field label="First Name">
                  <Glass
                    intensity={40}
                    fill="rgba(255,255,255,0.5)"
                    style={styles.field}
                  >
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="Aarav"
                      placeholderTextColor={PLACEHOLDER}
                      autoCapitalize="words"
                      autoComplete="name-given"
                      textContentType="givenName"
                      returnKeyType="next"
                      onSubmitEditing={next}
                      style={styles.input}
                    />
                  </Glass>
                </Field>
              </>
            )}

            {step === 1 && (
              <>
                <StepHeading
                  title="When were you born?"
                  hint="Used to confirm your identity."
                />
                <Field label="DOB">
                  <Glass
                    intensity={40}
                    fill="rgba(255,255,255,0.5)"
                    style={[styles.field, styles.fieldRow]}
                  >
                    <TextInput
                      value={dobText}
                      onChangeText={(v) => setDobText(formatDob(v))}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={PLACEHOLDER}
                      keyboardType="number-pad"
                      textContentType="birthdate"
                      maxLength={10}
                      style={[styles.input, styles.inputFlex]}
                    />
                    <Pressable
                      onPress={openDateSheet}
                      hitSlop={14}
                      accessibilityRole="button"
                      accessibilityLabel="Pick date of birth"
                    >
                      <CalendarIcon />
                    </Pressable>
                  </Glass>
                </Field>
                {dobText.length === 10 && !dobIso && (
                  <Text style={styles.error}>
                    Enter a real date. You need to be at least 18.
                  </Text>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <StepHeading
                  title="Aadhar number"
                  hint="Twelve digits, no spaces needed."
                />
                <Field label="Aadhar Number">
                  <Glass
                    intensity={40}
                    fill="rgba(255,255,255,0.5)"
                    style={styles.field}
                  >
                    <TextInput
                      value={aadharText}
                      onChangeText={(v) => setAadharText(formatAadhar(v))}
                      placeholder="0000 0000 0000"
                      placeholderTextColor={PLACEHOLDER}
                      keyboardType="number-pad"
                      maxLength={14}
                      style={[styles.input, styles.inputSpaced]}
                    />
                  </Glass>
                </Field>
                {aadharDigits.length === 12 && /^[01]/.test(aadharDigits) && (
                  <Text style={styles.error}>
                    Aadhar numbers don't start with 0 or 1.
                  </Text>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <StepHeading
                  title="Upload your Aadhar card"
                  hint="JPG or PNG, front side only."
                />
                <Pressable
                  onPress={() => pickImage([85.6, 54], setCardUri)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    cardUri
                      ? "Replace Aadhar card image"
                      : "Upload Aadhar card image"
                  }
                >
                  <Glass
                    intensity={30}
                    fill="rgba(255,255,255,0.32)"
                    style={[styles.drop, { minHeight: dropMin }]}
                  >
                    {cardUri ? (
                      <>
                        <Image
                          source={{ uri: cardUri }}
                          resizeMode="contain"
                          style={styles.dropPreview}
                        />
                        <Text style={styles.dropText}>Tap to replace</Text>
                      </>
                    ) : (
                      <>
                        <UploadIcon />
                        <Text style={styles.dropText}>
                          {"upload your Aadhar ID here\n(File upload)"}
                        </Text>
                      </>
                    )}
                  </Glass>
                </Pressable>
              </>
            )}
          </ScrollView>

          {/* next / submit — fixed footer, never overlapped by the step body */}
          <View style={styles.footer}>
            <Pressable
              onPress={next}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={isLast ? "Submit profile" : "Next step"}
              accessibilityState={{ disabled, busy }}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.button,
                    disabled && styles.buttonDisabled,
                    pressed && !disabled && styles.buttonPressed,
                  ]}
                >
                  <View style={styles.buttonHighlight} pointerEvents="none" />
                  <Text style={styles.buttonText}>
                    {busy ? "Saving…" : isLast ? "Submit" : "Next"}
                  </Text>
                  {!busy && <NextArrow />}
                </View>
              )}
            </Pressable>
          </View>
        </Glass>
      </KeyboardAvoidingView>

      {/* iOS date sheet: frosted bottom sheet with the native spinner */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable
          style={styles.scrim}
          onPress={() => setSheetOpen(false)}
          accessibilityLabel="Close date picker"
        />
        <BlurView
          intensity={80}
          tint="light"
          style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(255,255,255,0.55)" },
            ]}
            pointerEvents="none"
          />
          <View style={styles.sheetBar}>
            <Pressable onPress={() => setSheetOpen(false)} hitSlop={10}>
              <Text style={styles.sheetCancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.sheetTitle}>Date of birth</Text>
            <Pressable
              onPress={() => {
                setDobText(toDisplay(draftDate));
                setSheetOpen(false);
              }}
              hitSlop={10}
            >
              <Text style={styles.sheetDone}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={draftDate}
            mode="date"
            display="spinner"
            maximumDate={maxDate}
            minimumDate={minDate}
            themeVariant="light"
            textColor={INK}
            onValueChange={(_, d) => d && setDraftDate(d)}
            style={styles.spinner}
          />
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EFEBFF", overflow: "hidden" },
  texture: { opacity: 0.9, width: 360, height: 800 },
  content: { flex: 1 },

  glassBase: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  header: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: { width: 40 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    color: INK,
    letterSpacing: -0.41,
  },

  card: {
    flex: 1,
    minHeight: 0,
    borderRadius: 26,
    borderColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: "8%",
    shadowColor: "#3C288C",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },

  progressRow: { flexDirection: "row", alignItems: "center", columnGap: 10 },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(109,92,224,0.16)",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3, backgroundColor: PURPLE },
  stepLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: MUTED,
    fontFamily: "Menlo",
  },

  body: { flex: 1, minHeight: 0, marginTop: 12 },
  bodyContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 4 },
  footer: { flexShrink: 0, paddingTop: 14 },

  heading: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.4,
  },
  hint: { marginTop: 5, fontSize: 13, lineHeight: 18, color: MUTED },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "500",
    color: INK,
    marginBottom: 8,
  },
  error: { marginTop: -4, fontSize: 12, lineHeight: 16, color: "#E5484D" },

  field: { height: 52, borderRadius: 14, justifyContent: "center" },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14,
    columnGap: 10,
  },
  input: { height: "100%", paddingHorizontal: 14, fontSize: 16, color: INK },
  inputFlex: { flex: 1 },
  inputSpaced: { letterSpacing: 0.8 },

  avatarWrap: { alignSelf: "center" },
  avatar: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(232,228,255,0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarBadge: {
    position: "absolute",
    right: "4%",
    bottom: "8%",
    backgroundColor: PURPLE,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },

  drop: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 10,
    borderRadius: 16,
    borderStyle: "dashed",
    borderColor: "rgba(109,92,224,0.45)",
    padding: 18,
  },
  dropPreview: { width: "100%", aspectRatio: 85.6 / 54, borderRadius: 8 },
  dropText: { textAlign: "center", fontSize: 13, lineHeight: 18, color: MUTED },

  button: {
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  buttonHighlight: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  buttonDisabled: {
    backgroundColor: "#C4BBFF",
    borderColor: "rgba(255,255,255,0.6)",
  },
  buttonPressed: { backgroundColor: "#634FE8" },
  buttonText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },

  scrim: { flex: 1, backgroundColor: "rgba(14,14,20,0.25)" },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  sheetBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(60,40,140,0.18)",
  },
  sheetTitle: { fontSize: 15, fontWeight: "600", color: INK },
  sheetCancel: { fontSize: 16, color: MUTED },
  sheetDone: { fontSize: 16, fontWeight: "600", color: PURPLE },
  spinner: { height: 216 },
});
