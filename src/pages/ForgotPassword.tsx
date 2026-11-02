import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { resetPassword } = useAuth()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    const { error: resetError } = await resetPassword(email)
    if (resetError) {
      setError(resetError)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-lg">Check your email for a reset link.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl">Reset password</h1>
      <p className="mt-3 text-sm text-ink/60">
        We will send a reset link to your email address.
      </p>

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

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          className="w-full bg-ink py-3 text-sm text-cream transition-opacity hover:opacity-90"
        >
          Send reset link
        </button>
      </form>
    </div>
  )
}
