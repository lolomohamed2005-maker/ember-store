import { useState } from 'react'
import { Upload } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ImageUploadFieldProps {
  label: string
  value: string | null
  onChange: (url: string) => void
}

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('images').getPublicUrl(fileName)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <p className="text-sm text-ink/70">{label}</p>

      <div className="mt-2 flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden bg-sand">
          {value && <img src={value} alt={label} className="h-full w-full object-cover" />}
        </div>

        <label className="flex cursor-pointer items-center gap-2 border border-line px-4 py-2 text-sm hover:border-forest">
          <Upload size={16} strokeWidth={1.5} />
          {uploading ? 'Uploading...' : 'Upload image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="mt-2 text-xs text-clay">{error}</p>}
    </div>
  )
}
