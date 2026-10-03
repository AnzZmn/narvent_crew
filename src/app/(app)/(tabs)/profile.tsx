import ProfileFlow, {
  ProfileData,
  sampleProfile,
} from "@/components/export/expo-profile-v2";
import {
  ProfileSkeleton,
  TabLoadGate,
  useTabData,
} from "@/components/export/expo-tab-loading";
import { SwipeTabs } from "@/components/export/expo-tabs/SwipeTabs";
import { useTabOverlay } from "@/components/export/expo-tabs/TabOverlay";

const fetchProfile = async (): Promise<ProfileData> => {
  return sampleProfile;
};

export default function ProfileTab() {
  const { data, loading, ready } = useTabData(fetchProfile, {
    refetchOnFocus: true,
  });
  const setOverlay = useTabOverlay();
  return (
    <SwipeTabs tab="profile">
      <TabLoadGate
        loading={loading}
        ready={ready}
        skeleton={<ProfileSkeleton />}
      >
        {data && (
          <ProfileFlow
            hideTabBar // the layout draws the bar
            onOverlayChange={setOverlay} // hides it while a page / sheet is open
            onSaveProfile={(d) => console.log(d)}
            onSaveSkills={(s) => console.log(s)}
            onSaveBank={(b) => console.log(b)}
            onUploadDocument={(u) => console.log(u)}
            onAddMissing={(id) => id === "emergency" && console.log(id)}
          />
        )}
      </TabLoadGate>
    </SwipeTabs>
  );
}
