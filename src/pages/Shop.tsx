import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useBrands } from '../hooks/useBrands'
import { ProductCard } from '../components/product/ProductCard'
import { FilterSidebar } from '../components/product/FilterSidebar'
import { SortDropdown } from '../components/product/SortDropdown'
import { Pagination } from '../components/ui/Pagination'
import { categories, roastLabels } from '../lib/categories'
import type { Category } from '../types/database'
import type { SortOption } from '../hooks/useProducts'

const categoryLabels = Object.fromEntries(
  categories.map((item) => [item.value, item.label]),
) as Record<Category, string>

export function Shop() {
  const { category } = useParams<{ category?: Category }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const brands = useBrands(category)

  const search = searchParams.get('search') ?? undefined
  const selectedBrands = useMemo(
    () => (searchParams.get('brands') ?? '').split(',').filter(Boolean),
    [searchParams],
  )
  const minPrice = searchParams.get('min') ?? ''
  const maxPrice = searchParams.get('max') ?? ''
  const sort = (searchParams.get('sort') as SortOption | null) ?? 'newest'
  const page = Number(searchParams.get('page') ?? '1')
  const roast = Number(searchParams.get('roast') ?? '0')

  const { products, total, pageSize, loading, error } = useProducts({
    category,
    roast: roast > 0 ? roast : undefined,
    search,
    brands: selectedBrands,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
    page,
  })

  function updateParams(updates: Record<string, string | null>, resetPage = true) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    }
    if (resetPage) {
      next.delete('page')
    }
    setSearchParams(next)
  }

  function toggleBrand(brand: string) {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    updateParams({ brands: next.length > 0 ? next.join(',') : null })
  }

  const hasActiveFilters = selectedBrands.length > 0 || Boolean(minPrice) || Boolean(maxPrice)

  const title = search
    ? `Results for "${search}"`
    : category
      ? categoryLabels[category]
      : 'All products'

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl text-forest md:text-5xl">{title}</h1>
          {!loading && <p className="mt-1 text-sm text-ink/50">{total} items</p>}
        </div>
        <SortDropdown value={sort} onChange={(value) => updateParams({ sort: value })} />
      </div>


      {(category === 'beans' || !category) && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[11px] uppercase tracking-[0.25em] text-ink/50">Roast</span>
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => updateParams({ roast: level === 0 ? null : String(level) })}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                roast === level ? 'border-forest bg-forest text-cream' : 'border-line hover:border-forest'
              }`}
            >
              {level === 0 ? 'Any' : roastLabels[level]}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-10">
        <FilterSidebar
          brands={brands}
          selectedBrands={selectedBrands}
          onToggleBrand={toggleBrand}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={(value) => updateParams({ min: value || null })}
          onMaxPriceChange={(value) => updateParams({ max: value || null })}
          onClear={() => updateParams({ brands: null, min: null, max: null })}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="flex-1">
          {loading && <p className="text-sm text-ink/50">Loading...</p>}
          {error && <p className="text-sm text-clay">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-sm text-ink/50">Nothing matches these filters.</p>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={(nextPage) => updateParams({ page: String(nextPage) }, false)}
          />
        </div>
      </div>
    </div>
  )
}
