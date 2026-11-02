import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

interface FilterSidebarProps {
  brands: string[]
  selectedBrands: string[]
  onToggleBrand: (brand: string) => void
  minPrice: string
  maxPrice: string
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onClear: () => void
  hasActiveFilters: boolean
}

function FilterFields(props: FilterSidebarProps) {
  const {
    brands,
    selectedBrands,
    onToggleBrand,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    onClear,
    hasActiveFilters,
  } = props

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Filters</p>
        {hasActiveFilters && (
          <button onClick={onClear} className="text-xs text-forest underline">
            Clear all
          </button>
        )}
      </div>

      <div>
        <p className="text-sm text-ink/70">Brand</p>
        <div className="mt-3 space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onToggleBrand(brand)}
                className="h-4 w-4 border-line accent-forest"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-ink/70">Price</p>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
            className="w-full border border-line bg-transparent px-2 py-1.5 text-sm outline-none focus:border-forest"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            className="w-full border border-line bg-transparent px-2 py-1.5 text-sm outline-none focus:border-forest"
          />
        </div>
      </div>
    </div>
  )
}

export function FilterSidebar(props: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-6 flex items-center gap-2 border border-line px-4 py-2 text-sm md:hidden"
      >
        <SlidersHorizontal size={16} strokeWidth={1.5} />
        Filters
      </button>

      <aside className="hidden w-56 shrink-0 md:block">
        <FilterFields {...props} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="ml-auto h-full w-80 max-w-full overflow-y-auto bg-cream p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="mb-6 ml-auto flex"
              aria-label="Close filters"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
            <FilterFields {...props} />
          </div>
        </div>
      )}
    </>
  )
}
