import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/format'
import type { OrderStatus, OrderWithItems } from '../../types/database'

const statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export function OrdersPanel() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('orders')
      .select('*, order_items(id, size, quantity, unit_price, products(name))')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
    } else {
      setError(null)
      setOrders((data ?? []) as unknown as OrderWithItems[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function updateStatus(orderId: string, status: OrderStatus) {
    const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  if (loading) return <p className="text-sm text-ink/50">Loading orders...</p>
  if (error) return <p className="text-sm text-clay">{error}</p>
  if (orders.length === 0) return <p className="text-sm text-ink/50">No orders yet.</p>

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <div key={order.id} className="border border-line p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                Order {order.id.slice(0, 8)} · {formatPrice(order.total)}
              </p>
              <p className="mt-1 text-xs text-ink/50">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
              className="border border-line bg-transparent px-3 py-1.5 text-sm outline-none focus:border-forest"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            <div className="text-ink/70">
              <p>{order.full_name}</p>
              <p>{order.phone}</p>
              <p>
                {order.address}, {order.city}
              </p>
            </div>
            <ul className="space-y-1 text-ink/70">
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.products?.name ?? 'Deleted product'} · {item.size} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
