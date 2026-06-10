"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface WishlistItem {
  id: string
  name: string
  slug: string
  image: string
  category: string
}

interface WishlistContextType {
  items: WishlistItem[]
  add: (item: WishlistItem) => void
  remove: (id: string) => void
  isInWishlist: (id: string) => boolean
  clear: () => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        localStorage.removeItem("wishlist")
      }
    }
  }, [])

  const save = (newItems: WishlistItem[]) => {
    setItems(newItems)
    localStorage.setItem("wishlist", JSON.stringify(newItems))
  }

  const add = (item: WishlistItem) => {
    if (!items.find((i) => i.id === item.id)) {
      save([...items, item])
    }
  }

  const remove = (id: string) => {
    save(items.filter((i) => i.id !== id))
  }

  const isInWishlist = (id: string) => items.some((i) => i.id === id)

  const clear = () => {
    save([])
  }

  return (
    <WishlistContext.Provider value={{ items, add, remove, isInWishlist, clear }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return context
}