import {createContext, useContext} from 'react';

/** Kept outside app/ so expo-router doesn't treat it as a route. */
export const TabOverlayContext = createContext<(open: boolean) => void>(() => {});
/** Screens call this so the shared tab bar hides while a detail / Settings screen is open. */
export const useTabOverlay = () => useContext(TabOverlayContext);

/** True while a detail / Settings screen is open. SwipeTabs uses it to turn swiping off. */
export const TabOverlayOpenContext = createContext(false);
export const useTabOverlayOpen = () => useContext(TabOverlayOpenContext);
