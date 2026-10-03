import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

export type TabDataOptions = {
  /** 'mount' (default): fetch as soon as the tab mounts; with lazy:false, Profile loads in the background.
   *  'focus': wait until the tab is first opened. */
  load?: "mount" | "focus";
  /** refetch every time the tab regains focus (shows the skeleton over the old content) */
  refetchOnFocus?: boolean;
};

/** Loads one tab's data and reports `loading` for <TabLoadGate>. Stale responses are dropped. */
export function useTabData<T>(
  fetcher: () => Promise<T>,
  { load = "mount", refetchOnFocus = false }: TabDataOptions = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const req = useRef(0);
  const focusedOnce = useRef(false);
  const fetchRef = useRef(fetcher);
  fetchRef.current = fetcher;

  const refresh = useCallback(async () => {
    const id = ++req.current;
    setLoading(true);
    setError(null);
    try {
      const next = await fetchRef.current();
      if (id === req.current) setData(next);
    } catch (e) {
      if (id === req.current) setError(e);
    } finally {
      if (id === req.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (load === "mount") refresh();
    return () => {
      req.current++; // ignore anything in flight after unmount
    };
  }, [load, refresh]);

  useFocusEffect(
    useCallback(() => {
      const first = !focusedOnce.current;
      focusedOnce.current = true;
      if (first ? load === "focus" : refetchOnFocus) refresh();
    }, [load, refetchOnFocus, refresh]),
  );

  return { data, loading, error, refresh, ready: data !== null };
}
