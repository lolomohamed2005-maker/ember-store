import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: signUpError } = await signUp(email, password, fullName)
    setSubmitting(false)
    if (signUpError) {
      setError(signUpError)
      return
    }
    navigate('/account')
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl">Create account</h1>

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
            minLength={6}
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
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/login" className="text-forest underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
