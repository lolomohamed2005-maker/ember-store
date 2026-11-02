import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('site_settings').select('key, value')
    const map: Record<string, string> = {}
    for (const row of data ?? []) {
      map[row.key] = row.value
    }
    setSettings(map)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function updateSetting(key: string, value: string) {
    await supabase.from('site_settings').upsert({ key, value })
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return { settings, loading, updateSetting, refresh: load }
}
