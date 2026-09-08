export type Locale = 'zh' | 'en' | 'fr' | 'es'

export type PlaceCategory = 'museum' | 'historic' | 'memorial'

export interface LocalText {
  zh: string
  en: string
  fr?: string
  es?: string
}

export interface Place {
  slug: string
  names: LocalText
  category: PlaceCategory
  region: 'Wuchang' | 'Hankou' | 'Hanyang'
  /** Walking distance from the most common starting point, for UI only */
  walkMinutes: number
  distanceKm: number
  rating: number
  openHours: LocalText
  closedDay?: string
  languages: Locale[]
  image: string
  summary: LocalText
  description: LocalText
  culturalNote: LocalText
  highlights: string[]
  tags: string[]
  featured?: boolean
  audioMinutes: number
}

export interface CommunityPost {
  id: string
  author: string
  country: string
  flagLetter: string
  accent: string
  placeSlug?: string
  title: string
  body: string
  language: Locale
  likes: number
  comments: number
  liked?: boolean
  image?: string
  kind: 'story' | 'question' | 'discover'
}

export interface Badge {
  id: string
  names: LocalText
  kind: 'place' | 'share' | 'language' | 'volunteer'
  locked?: boolean
  progress?: number
  detail: LocalText
  accent: 'clay' | 'gold' | 'ink' | 'green'
}

export type TabKey = 'home' | 'explore' | 'map' | 'community' | 'profile'

export type Route =
  | { name: 'tab'; tab: TabKey }
  | { name: 'place'; slug: string }
  | { name: 'translate' }
  | { name: 'language' }
