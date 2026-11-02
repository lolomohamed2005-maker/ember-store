import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { categories } from '../../lib/categories'
import { ImageUploadField } from './ImageUploadField'
import type { Category, ProductRow } from '../../types/database'

interface ProductFormProps {
  product?: ProductRow
  onSaved: () => void
  onCancel: () => void
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const fieldClass =
  'mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-forest'

export function ProductForm({ product, onSaved, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '')
  const [brand, setBrand] = useState(product?.brand ?? '')
  const [category, setCategory] = useState<Category>(product?.category ?? 'beans')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price ? String(product.compare_at_price) : '',
  )
  const [description, setDescription] = useState(product?.description ?? '')
  const [color, setColor] = useState(product?.color ?? '')
  const [options, setOptions] = useState(product?.sizes.join(', ') ?? '250 g, 1 kg')
  const [roast, setRoast] = useState(product ? String(product.roast) : '0')
  const [stock, setStock] = useState(product ? String(product.stock) : '10')
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false)
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (images.length === 0) {
      setError('Add at least one product image')
      return
    }

    setSaving(true)

    const payload = {
      name,
      slug: product?.slug ?? slugify(name),
      brand,
      category,
      price: Number(price),
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      description,
      color,
      sizes: options
        .split(',')
        .map((option) => option.trim())
        .filter(Boolean),
      images,
      stock: Number(stock),
      roast: Number(roast),
      is_featured: isFeatured,
    }

    const { error: saveError } = product
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-line p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-ink/70">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="text-sm text-ink/70">Brand</label>
          <input required value={brand} onChange={(e) => setBrand(e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="text-sm text-ink/70">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={fieldClass}
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-ink/70">Roast or finish</label>
          <input value={color} onChange={(e) => setColor(e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="text-sm text-ink/70">Price (EGP)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm text-ink/70">Compare-at price (optional)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm text-ink/70">Sizes (comma separated)</label>
          <input
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            placeholder="250 g, 1 kg"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm text-ink/70">Roast level (0 for non-coffee, 1 light to 5 dark)</label>
          <select value={roast} onChange={(e) => setRoast(e.target.value)} className={fieldClass}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-ink/70">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-ink/70">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <p className="text-sm text-ink/70">Images (the first one is the main image)</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={url} className="w-24">
              <img src={url} alt="" className="h-28 w-24 bg-sand object-cover" />
              <div className="mt-1 flex justify-between text-xs">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => [url, ...prev.filter((item) => item !== url)])
                    }
                    className="text-forest underline"
                  >
                    Main
                  </button>
                ) : (
                  <span className="text-ink/40">Main</span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((item) => item !== url))}
                  className="text-clay underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <ImageUploadField
            label="Add an image"
            value={null}
            onChange={(url) => setImages((prev) => [...prev, url])}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4 accent-forest"
        />
        Show in Fresh picks on the homepage
      </label>

      {error && <p className="text-sm text-clay">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-forest px-6 py-2.5 text-sm text-cream transition-colors hover:bg-forest-dark disabled:opacity-40"
        >
          {saving ? 'Saving...' : product ? 'Save changes' : 'Add product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-line px-6 py-2.5 text-sm hover:border-forest"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
