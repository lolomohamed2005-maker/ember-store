import type { Category } from '../types/database'

export const categories: { value: Category; label: string; note: string }[] = [
  { value: 'beans', label: 'Coffee beans', note: 'Roasted this week' },
  { value: 'gear', label: 'Brewing gear', note: 'Pour-over to espresso' },
  { value: 'cups', label: 'Cups and mugs', note: 'Stoneware, glass, porcelain' },
]

export const roastLabels = ['', 'Light', 'Light medium', 'Medium', 'Medium dark', 'Dark']
