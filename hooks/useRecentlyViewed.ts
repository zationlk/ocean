"use client";

import { useEffect, useState } from "react";

interface RecentItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
}

const KEY = "recently_viewed";
const MAX = 6;

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const add = (item: RecentItem) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      const next = [item, ...filtered].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return { items, add };
}
