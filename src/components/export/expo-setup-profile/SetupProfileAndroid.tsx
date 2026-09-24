/**
 * Narvent — Setup Profile (Android S 360×800 / Android L 412×915, and anything between).
 * Expo + StyleSheet.create. No NativeWind.
 *
 *   npx expo install react-native-svg react-native-safe-area-context \
 *     expo-image-picker @react-native-community/datetimepicker
 *
 * Wrap the app root in <SafeAreaProvider>.
 *
 * Mirrors section 4 of the mockup: the old overflowing form split into four
 * one-question steps inside one white card —
 *   1 photo + first name   2 date of birth   3 Aadhar number   4 Aadhar card upload
 * with a progress bar + "Step n of 4", and a Next → button that becomes Submit
 * on the last step. Nothing scrolls on either device size; offsets use the
 * mockup's container-unit rules through useWindowDimensions().
 *
 * Each step validates before Next is enabled. Back steps backwards, and on
 * step 1 calls onBack.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
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
const MUTED = "#8B87A8";
const PLACEHOLDER = "#A6A3BF";
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
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none">
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
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
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

function Wash({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient
          id="wash"
          cx="50%"
          cy="24%"
          rx="112%"
          ry="62%"
          fx="50%"
          fy="24%"
        >
          <Stop offset="0.38" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#F8F7FF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#wash)" />
    </Svg>
  );
}

/* ---------------------------------------------------------------- helpers */

/** "01052001" -> "01/05/2001" while typing */
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
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

/** "123456789012" -> "1234 5678 9012" */
function formatAadhar(raw: string) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 12)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

/* ------------------------------------------------------------------ field */

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

export default function SetupProfileAndroid({
  onBack,
  onSubmit,
  initial,
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(
    initial?.photoUri ?? null,
  );
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [dobText, setDobText] = useState("");
  const [aadharText, setAadharText] = useState("");
  const [cardUri, setCardUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // mockup rules: 6.4cqh header, 3.4cqw side, 2.4cqh card gap, 6.6cqh bottom,
  // 4.6cqh / 3.4cqh card padding, 2.4cqh block gap, avatar 33cqw max 124, drop zone 22cqh
  const headerTop = height * 0.064;
  const side = width * 0.034;
  const cardGap = height * 0.024;
  const bottom = height * 0.066;
  const padTop = height * 0.046;
  const padBottom = height * 0.034;
  const gap = height * 0.024;
  const avatar = Math.min(width * 0.33, 124);
  const dropMin = height * 0.22;
  const indicatorW = Math.min(width * 0.26, 96);

  const dobIso = useMemo(() => parseDob(dobText), [dobText]);
  const aadharDigits = aadharText.replace(/\D/g, "");

  const valid = [
    firstName.trim().length >= 2,
    !!dobIso,
    aadharDigits.length === 12 && !/^[01]/.test(aadharDigits),
    !!cardUri,
  ][step];

  const progress = useRef(new Animated.Value((step + 1) / TOTAL)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step + 1) / TOTAL,
      duration: 300,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [step, progress]);

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

  const openDatePicker = () => {
    const now = new Date();
    const fallback = new Date(now.getFullYear() - 25, 0, 1);
    DateTimePickerAndroid.open({
      value: dobIso ? new Date(dobIso) : fallback,
      mode: "date",
      maximumDate: new Date(
        now.getFullYear() - 18,
        now.getMonth(),
        now.getDate(),
      ),
      minimumDate: new Date(now.getFullYear() - 100, 0, 1),
      onChange: (e, date) => {
        if (e.type === "set" && date) setDobText(toDisplay(date));
      },
    });
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

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={TEXTURE}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
        imageStyle={styles.texture}
      />
      <Wash width={width} height={height} />

      <KeyboardAvoidingView
        behavior="padding"
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
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
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.headerSide}
          >
            <BackArrow />
          </Pressable>
          <Text style={styles.headerTitle}>Setup Profile</Text>
          <View style={styles.headerSide} />
        </View>

        <View
          style={[
            styles.card,
            {
              marginTop: cardGap,
              marginHorizontal: side,
              marginBottom: bottom,
              paddingTop: padTop,
              paddingBottom: padBottom,
            },
          ]}
        >
          {/* progress */}
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

          {/* step body */}
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
                  <View style={styles.inputRow}>
                    <TextInput
                      value={dobText}
                      onChangeText={(v) => setDobText(formatDob(v))}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={PLACEHOLDER}
                      keyboardType="number-pad"
                      autoComplete="birthdate-full"
                      maxLength={10}
                      returnKeyType="next"
                      onSubmitEditing={next}
                      style={styles.inputFlex}
                    />
                    <Pressable
                      onPress={openDatePicker}
                      hitSlop={14}
                      accessibilityRole="button"
                      accessibilityLabel="Pick date of birth"
                    >
                      <CalendarIcon />
                    </Pressable>
                  </View>
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
                  <TextInput
                    value={aadharText}
                    onChangeText={(v) => setAadharText(formatAadhar(v))}
                    placeholder="0000 0000 0000"
                    placeholderTextColor={PLACEHOLDER}
                    keyboardType="number-pad"
                    maxLength={14}
                    returnKeyType="next"
                    onSubmitEditing={next}
                    style={[styles.input, styles.inputSpaced]}
                  />
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
                </Pressable>
              </>
            )}
          </ScrollView>

          {/* next / submit — fixed footer, never overlapped by the step body */}
          <View style={styles.footer}>
            <View
              style={[
                styles.buttonShell,
                (!valid || busy) && styles.buttonShellDisabled,
              ]}
            >
              <Pressable
                onPress={next}
                disabled={!valid || busy}
                android_ripple={{ color: "rgba(255,255,255,0.25)" }}
                accessibilityRole="button"
                accessibilityLabel={isLast ? "Submit profile" : "Next step"}
                accessibilityState={{ disabled: !valid || busy, busy }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {busy ? "Saving…" : isLast ? "Submit" : "Next"}
                </Text>
                {!busy && <NextArrow />}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.gestureBar,
          { width: indicatorW, marginLeft: -indicatorW / 2 },
        ]}
      />
    </View>
  );
}

const field = {
  height: 52,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(180,174,220,0.55)",
  backgroundColor: "rgba(255,255,255,0.62)",
  paddingHorizontal: 14,
} as const;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7FF", overflow: "hidden" },
  texture: { opacity: 0.55, width: 360, height: 800 },
  content: { flex: 1 },

  header: { flexDirection: "row", alignItems: "center" },
  headerSide: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.15,
  },

  card: {
    flex: 1,
    minHeight: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: "8%",
    elevation: 6,
    shadowColor: "#3C288C",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  progressRow: { flexDirection: "row", alignItems: "center", columnGap: 10 },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(109,92,224,0.18)",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 2, backgroundColor: PURPLE },
  stepLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: MUTED,
    fontFamily: "monospace",
  },

  body: { flex: 1, minHeight: 0, marginTop: 12 },
  bodyContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 4 },
  footer: { flexShrink: 0, paddingTop: 16 },

  heading: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.38,
  },
  hint: { marginTop: 6, fontSize: 12.5, lineHeight: 18, color: MUTED },
  label: {
    fontSize: 12.5,
    lineHeight: 15,
    fontWeight: "500",
    color: INK,
    marginBottom: 9,
  },
  error: { marginTop: -4, fontSize: 11.5, lineHeight: 16, color: "#E5484D" },

  input: { ...field, fontSize: 13.5, color: INK },
  inputSpaced: { letterSpacing: 0.54 },
  inputRow: {
    ...field,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 13.5,
    color: INK,
    padding: 0,
  },

  avatarWrap: { alignSelf: "center" },
  avatar: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#E8E4FF",
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
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  drop: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(109,92,224,0.45)",
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 18,
  },
  dropPreview: { width: "100%", aspectRatio: 85.6 / 54, borderRadius: 8 },
  dropText: { textAlign: "center", fontSize: 12, lineHeight: 18, color: MUTED },

  buttonShell: {
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: PURPLE,
    elevation: 4,
  },
  buttonShellDisabled: { backgroundColor: "#C4BBFF", elevation: 0 },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    includeFontPadding: false,
  },

  gestureBar: {
    position: "absolute",
    left: "50%",
    bottom: 6,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#AFAFAF",
    opacity: 0.7,
  },
});
