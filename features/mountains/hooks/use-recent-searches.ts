import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "@mountain_recent_searches";
const MAX_COUNT = 10;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) setRecentSearches(JSON.parse(json));
    });
  }, []);

  const saveSearch = useCallback((keyword: string): void => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(
        0,
        MAX_COUNT,
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeSearch = useCallback((keyword: string): void => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== keyword);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentSearches, saveSearch, removeSearch };
}
