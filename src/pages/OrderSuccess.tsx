import { Link, useParams } from 'react-router-dom'

export function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>()

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-3xl">Order placed</h1>
      <p className="mt-3 text-sm text-ink/60">
        Thank you. Your order reference is <span className="text-ink">{orderId?.slice(0, 8)}</span>.
      </p>
      <Link to="/" className="mt-8 inline-block text-sm text-forest underline">
        Back to home
      </Link>
    </div>
  )
}
