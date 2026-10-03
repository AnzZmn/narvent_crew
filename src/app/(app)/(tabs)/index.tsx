import {
  HomeSkeleton,
  TabLoadGate,
  useTabData,
} from "@/components/export/expo-tab-loading";
import { SwipeTabs } from "@/components/export/expo-tabs/SwipeTabs";
import {
  sampleWorkerHome,
  WorkerHomeData,
  WorkerHomeFlow,
} from "@/components/export/expo-worker-home";
import { SettingsCarousel } from "@/components/export/expo-settings";
import { useEffect, useState } from "react";
import { useTabOverlay } from "@/components/export/expo-tabs/TabOverlay";

const fetchHome = async (): Promise<WorkerHomeData> => {
  return sampleWorkerHome;
};
const MARK = require("../../../components/export/expo-my-profile/assets/narvent-mark.png");

const logo: { mark: any; wordmark: any } = { mark: MARK, wordmark: null };

export default function HomeTab() {
  const setOverlay = useTabOverlay();
  const [detailOpen, setDetailOpen] = useState(false); // Home's own detail screens
  const [settingsOpen, setSettingsOpen] = useState(false); // carousel target
  const [settingsShown, setSettingsShown] = useState(false); // true until the close slide finishes

  const { data, loading, ready } = useTabData(fetchHome, {
    refetchOnFocus: true,
  });

  // One overlay flag: hides the tab bar and disables SwipeTabs
  useEffect(() => {
    setOverlay(detailOpen || settingsShown);
  }, [detailOpen, settingsShown, setOverlay]);

  const openSettings = () => {
    setSettingsShown(true); // hide the tab bar right away
    setSettingsOpen(true);
  };

  return (
    <SwipeTabs tab="index">
      <SettingsCarousel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onTransitionEnd={(open) => !open && setSettingsShown(false)} // tab bar returns after the slide
        settings={{
          onLogout: () => {
            /* sign out */
          },
          onSave: (id, values) => {
            /* save profile / payout values */
          },
          logo: logo,
        }}
      >
        <TabLoadGate
          loading={loading}
          ready={ready}
          skeleton={<HomeSkeleton />}
        >
          {data && (
            <WorkerHomeFlow
              home={data}
              hideTabBar
              onMenu={openSettings}
              onOverlayChange={setDetailOpen}
            />
          )}
        </TabLoadGate>
      </SettingsCarousel>
    </SwipeTabs>
  );
}
