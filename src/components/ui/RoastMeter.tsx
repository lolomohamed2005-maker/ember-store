import { motion } from 'motion/react'
import { roastLabels } from '../../lib/categories'

function Bean({ filled, index }: { filled: boolean; index: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 32"
      className="h-4 w-3"
      initial={{ scale: 0.4, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 260, damping: 14 }}
    >
      <ellipse cx="12" cy="16" rx="9" ry="14" className={filled ? 'fill-clay' : 'fill-line'} />
      <path d="M8 6c6 4 2 16 8 20" className={filled ? 'stroke-cream' : 'stroke-cream'} strokeWidth="2" fill="none" strokeLinecap="round" />
    </motion.svg>
  )
}

export function RoastMeter({ level, withLabel = true }: { level: number; withLabel?: boolean }) {
  if (level <= 0) return null

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <Bean key={step} filled={step <= level} index={step} />
        ))}
      </div>
      {withLabel && <span className="text-[11px] uppercase tracking-[0.18em] text-ink/50">{roastLabels[level]}</span>}
    </div>
  )
}
