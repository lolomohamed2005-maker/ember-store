import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { ProductRow } from '../types/database'

interface WishlistLine {
  id: string
  product: ProductRow
}

interface WishlistContextValue {
  lines: WishlistLine[]
  loading: boolean
  isWishlisted: (productId: string) => boolean
  toggleWishlist: (product: ProductRow) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [lines, setLines] = useState<WishlistLine[]>([])
  const [loading, setLoading] = useState(false)

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setLines([])
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('wishlist')
      .select('id, products(*)')
      .eq('user_id', user.id)

    const mapped: WishlistLine[] = (data ?? [])
      .filter((row) => row.products)
      .map((row) => ({ id: row.id, product: row.products as unknown as ProductRow }))

    setLines(mapped)
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  function isWishlisted(productId: string) {
    return lines.some((line) => line.product.id === productId)
  }

  async function toggleWishlist(product: ProductRow) {
    if (!user) return

    const existing = lines.find((line) => line.product.id === product.id)

    if (existing) {
      await supabase.from('wishlist').delete().eq('id', existing.id)
      setLines((prev) => prev.filter((line) => line.id !== existing.id))
      return
    }

    const { data } = await supabase
      .from('wishlist')
      .insert({ user_id: user.id, product_id: product.id })
      .select('id')
      .single()

    if (data) {
      setLines((prev) => [...prev, { id: data.id, product }])
    }
  }

  const value: WishlistContextValue = { lines, loading, isWishlisted, toggleWishlist }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
