import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'

export function Checkout() {
  const { user } = useAuth()
  const { lines, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return <Navigate to="/login" replace />
  if (lines.length === 0) return <Navigate to="/cart" replace />

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user!.id,
        status: 'pending',
        total: subtotal,
        full_name: fullName,
        address,
        city,
        phone,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      setError(orderError?.message ?? 'Could not place order')
      setSubmitting(false)
      return
    }

    const orderItems = lines.map((line) => ({
      order_id: order.id,
      product_id: line.product.id,
      size: line.size,
      quantity: line.quantity,
      unit_price: line.product.price,
    }))

    await supabase.from('order_items').insert(orderItems)
    await clearCart()

    navigate(`/order-success/${order.id}`)
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-ink/70">Full name</label>
            <input
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="text-sm text-ink/70">Address</label>
            <input
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-forest"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-ink/70">City</label>
              <input
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Phone</label>
              <input
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-forest"
              />
            </div>
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink py-3 text-sm text-cream transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {submitting ? 'Placing order...' : `Place order — ${formatPrice(subtotal)}`}
          </button>
        </form>
      </div>

      <div className="divide-y divide-line border-t border-line md:border-l md:border-t-0 md:pl-10">
        {lines.map((line) => (
          <div key={line.id} className="flex justify-between py-4 text-sm">
            <span>
              {line.product.name} × {line.quantity}
            </span>
            <span>{formatPrice(line.product.price * line.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between py-4 text-base">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  )
}
