import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Category } from '../types/database'

export function useBrands(category?: Category) {
  const [brands, setBrands] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      let query = supabase.from('products').select('brand')
      if (category) {
        query = query.eq('category', category)
      }
      const { data } = await query
      if (cancelled) return
      const unique = Array.from(new Set((data ?? []).map((row) => row.brand))).sort()
      setBrands(unique)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [category])

  return brands
}
