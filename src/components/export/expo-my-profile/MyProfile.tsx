import React from "react";
import {
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileBackground from "./components/ProfileBackground";
import DetailHeader from "./components/DetailHeader";
import IdCard from "./components/IdCard";
import RateQrCard from "./components/RateQrCard";
import PersonalFields from "./components/PersonalFields";
import AddressSection from "./components/AddressSection";
import PaymentDetailsCard from "./components/PaymentDetailsCard";
import DocumentsCard from "./components/DocumentsCard";
import ReferEarn from "./components/ReferEarn";
import { Variant, VariantContext } from "./components/theme";
import { ProfileData, ProfileDocument, sampleProfile } from "./types";

export type MyProfileProps = {
  data?: ProfileData;
  variant?: Variant;
  rateQr?: ImageSourcePropType;
  referQr?: ImageSourcePropType;
  /** px reserved at the bottom for a floating tab bar */
  tabBarSpace?: number;
  onBack?: () => void;
  onEditPhoto?: () => void;
  onSelectCity?: (which: "current" | "permanent") => void;
  onEditPayment?: () => void;
  onUploadDocument?: (doc: ProfileDocument) => void;
  onShareLink?: () => void;
  onCopyLink?: () => void;
  onKnowMore?: () => void;
};

export default function MyProfile({
  data = sampleProfile,
  variant,
  rateQr,
  referQr,
  tabBarSpace = 0,
  onBack,
  onEditPhoto,
  onSelectCity,
  onEditPayment,
  onUploadDocument,
  onShareLink,
  onCopyLink,
  onKnowMore,
}: MyProfileProps) {
  const insets = useSafeAreaInsets();
  const body = (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ProfileBackground />
      <DetailHeader title="My Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <IdCard
          name={data.displayName}
          nuId={data.nuId}
          phone={data.phone}
          completion={data.completion}
          photoUri={data.photoUri}
          onEditPhoto={onEditPhoto}
        />
        <RateQrCard qr={rateQr} />
        <PersonalFields info={data.personal} />
        <View style={styles.addresses}>
          <AddressSection
            title="Current Address"
            address={data.currentAddress}
            onSelectCity={() => onSelectCity?.("current")}
          />
          <AddressSection
            title="Permanent Address"
            address={data.permanentAddress}
            onSelectCity={() => onSelectCity?.("permanent")}
          />
        </View>
        <PaymentDetailsCard bank={data.bank} onEdit={onEditPayment} />
        <DocumentsCard documents={data.documents} onUpload={onUploadDocument} />
        <ReferEarn
          qr={referQr}
          onShare={onShareLink}
          onCopy={onCopyLink}
          onKnowMore={onKnowMore}
          bottomInset={tabBarSpace + insets.bottom}
        />
      </ScrollView>
    </View>
  );
  return variant ? (
    <VariantContext.Provider value={variant}>{body}</VariantContext.Provider>
  ) : (
    body
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  addresses: { marginHorizontal: 14 },
});
