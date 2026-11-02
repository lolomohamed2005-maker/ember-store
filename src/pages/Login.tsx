import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)
    if (signInError) {
      setError(signInError)
      return
    }
    navigate('/account')
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl">Sign in</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm text-ink/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-forest"
          />
        </div>

        <div>
          <label className="text-sm text-ink/70">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-forest"
          />
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink py-3 text-sm text-cream transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 flex justify-between text-sm">
        <Link to="/forgot-password" className="text-ink/60 underline">
          Forgot password?
        </Link>
        <Link to="/register" className="text-forest underline">
          Create account
        </Link>
      </div>
    </div>
  )
}
