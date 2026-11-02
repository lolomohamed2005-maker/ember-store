import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { Heart } from 'lucide-react'
import { formatPrice } from '../../lib/format'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { RoastMeter } from '../ui/RoastMeter'
import type { ProductRow } from '../../types/database'

export function ProductCard({ product }: { product: ProductRow }) {
  const { user } = useAuth()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const hoverImage = product.images[1]

  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const sx = useSpring(cx, { stiffness: 300, damping: 26 })
  const sy = useSpring(cy, { stiffness: 300, damping: 26 })

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    cx.set(event.clientX - rect.left)
    cy.set(event.clientY - rect.top)
  }

  function handleWishlistClick(event: React.MouseEvent) {
    event.preventDefault()
    if (!user) return
    toggleWishlist(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div
          onPointerMove={handleMove}
          className="relative aspect-[4/5] cursor-none overflow-hidden rounded-t-[999px] bg-sand md:cursor-none"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-110 ${
              hoverImage ? 'group-hover:opacity-0' : ''
            }`}
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-0 transition-all duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100"
            />
          )}

          <motion.span
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 -ml-9 -mt-9 flex h-[72px] w-[72px] scale-0 items-center justify-center rounded-full bg-clay text-[11px] uppercase tracking-[0.2em] text-cream transition-transform duration-300 group-hover:scale-100"
          >
            View
          </motion.span>

          {product.compare_at_price && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-clay px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream">
              Offer
            </span>
          )}
          <motion.button
            onClick={handleWishlistClick}
            aria-label="Toggle wishlist"
            whileTap={{ scale: 1.5 }}
            className="absolute right-4 top-12 rounded-full bg-cream/90 p-2 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              fill={wishlisted ? '#c8641f' : 'none'}
              color={wishlisted ? '#c8641f' : '#1c120c'}
            />
          </motion.button>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink/50">{product.brand}</p>
          <p className="mt-1 font-display text-3xl leading-tight text-forest">{product.name}</p>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm">
            <span className={product.compare_at_price ? 'text-clay' : 'text-ink'}>{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-ink/40 line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
          {product.roast > 0 && (
            <div className="mt-3 flex justify-center">
              <RoastMeter level={product.roast} withLabel={false} />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
