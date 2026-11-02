import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-3xl">Page not found</h1>
      <Link to="/" className="mt-6 inline-block text-sm text-forest underline">
        Back to home
      </Link>
    </div>
  )
}
