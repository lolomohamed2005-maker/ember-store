import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Category, ProductRow } from '../types/database'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc'

export interface ProductFilters {
  category?: Category
  roast?: number
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: SortOption
  page?: number
  pageSize?: number
}

const DEFAULT_PAGE_SIZE = 12

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE
  const brandsKey = (filters.brands ?? []).slice().sort().join(',')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      let query = supabase.from('products').select('*', { count: 'exact' })

      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (typeof filters.roast === 'number') {
        query = query.eq('roast', filters.roast)
      }
      if (filters.brands && filters.brands.length > 0) {
        query = query.in('brand', filters.brands)
      }
      if (typeof filters.minPrice === 'number') {
        query = query.gte('price', filters.minPrice)
      }
      if (typeof filters.maxPrice === 'number') {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`)
      }

      if (filters.sort === 'price-asc') {
        query = query.order('price', { ascending: true })
      } else if (filters.sort === 'price-desc') {
        query = query.order('price', { ascending: false })
      } else if (filters.sort === 'name-asc') {
        query = query.order('name', { ascending: true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error: queryError, count } = await query

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
      } else {
        setProducts(data ?? [])
        setTotal(count ?? 0)
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [
    filters.category,
    filters.roast,
    brandsKey,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
    filters.sort,
    page,
    pageSize,
  ])

  return { products, total, page, pageSize, loading, error }
}
