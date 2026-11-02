import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'

export function Cart() {
  const { lines, subtotal, updateQuantity, removeItem } = useCart()

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-lg">Your bag is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-sm text-forest underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl">Your bag</h1>

      <div className="mt-8 divide-y divide-line">
        {lines.map((line) => (
          <div key={line.id} className="flex gap-4 py-6">
            <img
              src={line.product.images[0]}
              alt={line.product.name}
              className="h-28 w-24 object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm">{line.product.name}</p>
                <p className="text-xs text-ink/50">Size {line.size}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(line.id, line.quantity - 1)}
                    className="h-7 w-7 border border-line"
                  >
                    -
                  </button>
                  <span className="text-sm">{line.quantity}</span>
                  <button
                    onClick={() => updateQuantity(line.id, line.quantity + 1)}
                    className="h-7 w-7 border border-line"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm">{formatPrice(line.product.price * line.quantity)}</p>
              </div>
            </div>
            <button
              onClick={() => removeItem(line.id)}
              className="self-start text-xs text-ink/40 underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <span className="text-sm">Subtotal</span>
        <span className="text-lg">{formatPrice(subtotal)}</span>
      </div>

      <Link
        to="/checkout"
        className="mt-6 block w-full bg-ink py-3 text-center text-sm text-cream transition-opacity hover:opacity-90"
      >
        Checkout
      </Link>
    </div>
  )
}
