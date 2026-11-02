import { useWishlist } from '../context/WishlistContext'
import { ProductCard } from '../components/product/ProductCard'

export function Wishlist() {
  const { lines } = useWishlist()

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl">Wishlist</h1>

      {lines.length === 0 ? (
        <p className="mt-8 text-sm text-ink/50">Nothing saved yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {lines.map((line) => (
            <ProductCard key={line.id} product={line.product} />
          ))}
        </div>
      )}
    </div>
  )
}
