import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import type { OrderRow } from '../types/database'

export function Account() {
  const { user, loading, signOut } = useAuth()
  const { isAdmin } = useIsAdmin()
  const [orders, setOrders] = useState<OrderRow[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data ?? []))
  }, [user])

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl text-forest">Your account</h1>
      <p className="mt-3 text-sm text-ink/60">{user.email}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={signOut}
          className="border border-forest px-6 py-2 text-sm text-forest hover:bg-forest hover:text-cream"
        >
          Sign out
        </button>
        {isAdmin && (
          <Link to="/admin" className="bg-forest px-6 py-2 text-sm text-cream hover:bg-forest-dark">
            Open admin
          </Link>
        )}
      </div>

      <h2 className="mt-14 text-3xl text-forest">Your orders</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">No orders yet.</p>
      ) : (
        <div className="mt-4 divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p>Order {order.id.slice(0, 8)}</p>
                <p className="text-xs text-ink/50">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p>{formatPrice(order.total)}</p>
                <p className="text-xs capitalize text-ink/50">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
