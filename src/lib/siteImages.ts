const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

export const siteImages = [
  { key: 'hero_image', label: 'Homepage hero cup', fallback: photo('1691775755067-a9807ac8939c', 1400) },
  { key: 'cat_beans_image', label: 'Category: Coffee beans', fallback: photo('1447933601403-0c6688de566e') },
  { key: 'cat_gear_image', label: 'Category: Brewing gear', fallback: photo('1758221052634-33f352d1318b') },
  { key: 'cat_cups_image', label: 'Category: Cups and mugs', fallback: photo('1522120573867-e574959f84c8') },
  { key: 'story_1_image', label: 'Story step 1: Harvest', fallback: photo('1524350876685-274059332603', 1400) },
  { key: 'story_2_image', label: 'Story step 2: Roast', fallback: photo('1447933601403-0c6688de566e', 1400) },
  { key: 'story_3_image', label: 'Story step 3: Grind', fallback: photo('1511537190424-bbbab87ac5eb', 1400) },
  { key: 'story_4_image', label: 'Story step 4: Brew', fallback: photo('1774296479035-4c6075e0c340', 1400) },
]

export function resolveSiteImage(settings: Record<string, string>, key: string) {
  const custom = settings[key]
  if (custom) return custom
  return siteImages.find((item) => item.key === key)?.fallback ?? ''
}
