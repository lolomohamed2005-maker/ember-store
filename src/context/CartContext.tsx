import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { ProductRow } from '../types/database'

export interface CartLine {
  id: string
  size: string
  quantity: number
  product: ProductRow
}

interface CartContextValue {
  lines: CartLine[]
  loading: boolean
  itemCount: number
  subtotal: number
  addItem: (product: ProductRow, size: string, quantity?: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [lines, setLines] = useState<CartLine[]>([])
  const [loading, setLoading] = useState(false)

  const loadCart = useCallback(async () => {
    if (!user) {
      setLines([])
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('cart_items')
      .select('id, size, quantity, products(*)')
      .eq('user_id', user.id)

    const mapped: CartLine[] = (data ?? [])
      .filter((row) => row.products)
      .map((row) => ({
        id: row.id,
        size: row.size,
        quantity: row.quantity,
        product: row.products as unknown as ProductRow,
      }))

    setLines(mapped)
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  async function addItem(product: ProductRow, size: string, quantity = 1) {
    if (!user) return

    const existing = lines.find((line) => line.product.id === product.id && line.size === size)

    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity)
      return
    }

    const { data } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: product.id, size, quantity })
      .select('id')
      .single()

    if (data) {
      setLines((prev) => [...prev, { id: data.id, size, quantity, product }])
    }
  }

  async function updateQuantity(lineId: string, quantity: number) {
    if (quantity < 1) {
      await removeItem(lineId)
      return
    }
    await supabase.from('cart_items').update({ quantity }).eq('id', lineId)
    setLines((prev) => prev.map((line) => (line.id === lineId ? { ...line, quantity } : line)))
  }

  async function removeItem(lineId: string) {
    await supabase.from('cart_items').delete().eq('id', lineId)
    setLines((prev) => prev.filter((line) => line.id !== lineId))
  }

  async function clearCart() {
    if (!user) return
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    setLines([])
  }

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines])
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0),
    [lines],
  )

  const value: CartContextValue = {
    lines,
    loading,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
