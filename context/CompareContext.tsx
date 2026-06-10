"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CompareItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  specifications?: Record<string, string>;
  features?: string[];
  shortDescription?: string;
}

interface CompareContextType {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  const add = (item: CompareItem) => {
    if (items.length >= 3) return; // max 3
    if (!items.find((i) => i.id === item.id)) {
      setItems((prev) => [...prev, item]);
    }
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isInCompare = (id: string) => items.some((i) => i.id === id);

  const clear = () => setItems([]);

  return (
    <CompareContext.Provider value={{ items, add, remove, isInCompare, clear }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
