import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'
import { formatPrice } from '../lib/format'
import { roastLabels } from '../lib/categories'
import { useCart } from '../context/CartContext'
import { RoastMeter } from '../components/ui/RoastMeter'
import type { ProductRow } from '../types/database'

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductRow | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    if (!slug) return
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setProduct(data)
        if (data && data.sizes.length === 1) setSize(data.sizes[0])
      })
  }, [slug])

  if (!product) {
    return <div className="mx-auto max-w-7xl px-6 py-16 text-sm text-ink/50">Loading...</div>
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2">
      <div>
        <div className="aspect-[4/5] overflow-hidden bg-sand">
          <AnimatePresence mode="wait">
            <motion.img
              key={product.images[activeImage]}
              src={product.images[activeImage]}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
        <div className="mt-3 flex gap-2">
          {product.images.map((image, index) => (
            <button
              key={image}
              onClick={() => setActiveImage(index)}
              className={`h-16 w-16 overflow-hidden border ${
                index === activeImage ? 'border-forest' : 'border-line'
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.35em] text-clay">{product.brand}</p>
        <h1 className="mt-2 text-4xl text-forest md:text-5xl">{product.name}</h1>
        <p className="mt-3 text-lg">{formatPrice(product.price)}</p>
        {product.roast > 0 && (
          <div className="mt-4">
            <RoastMeter level={product.roast} />
          </div>
        )}
        <p className="mt-6 text-sm leading-relaxed text-ink/70">{product.description}</p>

        <div className="mt-8">
          <p className="text-sm text-ink">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`border px-4 py-2 text-sm ${
                  size === s ? 'border-forest bg-forest text-cream' : 'border-line'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          disabled={!size}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (!size) return
            addItem(product, size)
            setAdded(true)
            window.setTimeout(() => setAdded(false), 1600)
          }}
          className="mt-8 w-full bg-forest py-3 text-sm tracking-wide text-cream transition-colors hover:bg-forest-dark disabled:opacity-40"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'added' : 'idle'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="block"
            >
              {added ? 'Added to your bag' : 'Add to bag'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
          {[
            ['Origin or finish', product.color || 'Signature'],
            ['Roast', product.roast > 0 ? roastLabels[product.roast] : 'Not applicable'],
            ['Freshness', 'Roasted to order, shipped within 48 h'],
            ['Delivery', 'Free over 1000 EGP'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-3">
              <dt className="text-ink/50">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
