import React from 'react';
import {WorkerHomeFlow, sampleWorkerHome, WorkerHomeData} from '../../expo-worker-home';
import {HomeSkeleton, TabLoadGate, useTabData} from '../../expo-tab-loading';
import {useTabOverlay} from '../../TabOverlay';
import {SwipeTabs} from '../../SwipeTabs';

// Replace with your API call.
const fetchHome = () => new Promise<WorkerHomeData>(r => setTimeout(() => r(sampleWorkerHome), 700));

export default function HomeTab() {
  const setOverlay = useTabOverlay();
  const {data, loading, ready} = useTabData(fetchHome, {refetchOnFocus: true});
  return (
    <SwipeTabs tab="index">
    <TabLoadGate loading={loading} ready={ready} skeleton={<HomeSkeleton />}>
      {data && <WorkerHomeFlow home={data} hideTabBar onOverlayChange={setOverlay} />}
    </TabLoadGate>
    </SwipeTabs>
  );
}
