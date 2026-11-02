import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { phoneToEmail, signInAdminWithPhone, signUpAdminWithPhone } from '../lib/adminAuth'

type Mode = 'signin' | 'signup'

export function AdminLogin() {
  const [mode, setMode] = useState<Mode>('signin')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sql, setSql] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setSql(null)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSql(null)

    if (phone.replace(/\D/g, '').length < 8) {
      setError('Enter a valid phone number')
      return
    }

    setSubmitting(true)

    if (mode === 'signin') {
      const { error: signInError } = await signInAdminWithPhone(phone, password)
      setSubmitting(false)
      if (signInError) {
        setError(
          signInError.toLowerCase().includes('confirm')
            ? 'Email confirmation is still on in Supabase. Turn off Confirm email under Authentication, Providers, Email.'
            : signInError,
        )
        return
      }
      navigate('/admin')
      return
    }

    const { error: signUpError } = await signUpAdminWithPhone(phone, password)
    setSubmitting(false)
    if (signUpError) {
      setError(signUpError)
      return
    }
    setSql(
      `insert into admins (user_id)\nselect id from auth.users where email = '${phoneToEmail(phone)}';`,
    )
  }

  async function copySql() {
    if (!sql) return
    await navigator.clipboard.writeText(sql)
    setCopied(true)
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-4xl text-forest">Admin</h1>

      <div className="mt-5 flex gap-5 text-sm">
        <button
          onClick={() => switchMode('signin')}
          className={mode === 'signin' ? 'text-forest underline underline-offset-4' : 'text-ink/50'}
        >
          Sign in
        </button>
        <button
          onClick={() => switchMode('signup')}
          className={mode === 'signup' ? 'text-forest underline underline-offset-4' : 'text-ink/50'}
        >
          Create admin account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm text-ink/70">Phone number</label>
          <input
            required
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="01xxxxxxxxx"
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
          className="w-full bg-forest py-3 text-sm text-cream transition-colors hover:bg-forest-dark disabled:opacity-40"
        >
          {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {sql && (
        <div className="mt-8 border border-line bg-sand p-4">
          <p className="text-sm text-ink/70">
            Account created. Run this once in the Supabase SQL Editor to make it an admin, then
            sign in.
          </p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all bg-cream p-3 text-xs">
            {sql}
          </pre>
          <button onClick={copySql} className="mt-3 text-sm text-forest underline underline-offset-4">
            {copied ? 'Copied' : 'Copy SQL'}
          </button>
        </div>
      )}
    </div>
  )
}
