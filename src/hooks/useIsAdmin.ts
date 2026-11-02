import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useIsAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function check() {
      if (!user) {
        setIsAdmin(false)
        setError(null)
        setChecked(true)
        return
      }

      setChecked(false)
      const { data, error: queryError } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (cancelled) return
      setIsAdmin(Boolean(data))
      setError(queryError ? queryError.message : null)
      setChecked(true)
    }

    check()

    return () => {
      cancelled = true
    }
  }, [user])

  return { isAdmin, checked, error }
}
