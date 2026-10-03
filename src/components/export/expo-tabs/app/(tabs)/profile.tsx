import React from 'react';
import {MyProfileFlow, sampleProfile, ProfileData} from '../../expo-my-profile';
import {ProfileSkeleton, TabLoadGate, useTabData} from '../../expo-tab-loading';
import {useTabOverlay} from '../../TabOverlay';
import {SwipeTabs} from '../../SwipeTabs';

// Replace with your API call.
const fetchProfile = () => new Promise<ProfileData>(r => setTimeout(() => r(sampleProfile), 700));

export default function ProfileTab() {
  const setOverlay = useTabOverlay();
  const {data, loading, ready} = useTabData(fetchProfile, {refetchOnFocus: true});
  return (
    <SwipeTabs tab="profile">
    <TabLoadGate loading={loading} ready={ready} skeleton={<ProfileSkeleton />}>
      {data && <MyProfileFlow data={data} hideTabBar onOverlayChange={setOverlay} />}
    </TabLoadGate>
    </SwipeTabs>
  );
}
