import { useEffect, useState } from 'react'
import type { Route, TabKey } from './types'

const VALID_TABS: TabKey[] = ['home', 'explore', 'map', 'community', 'profile']

export function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '')
  const parts = raw.split('/').filter(Boolean)
  const first = parts[0]?.toLowerCase()
  if (first === 'place' && parts[1]) return { name: 'place', slug: parts[1] }
  if (first === 'translate') return { name: 'translate' }
  if (first === 'language') return { name: 'language' }
  if (first && VALID_TABS.includes(first as TabKey)) return { name: 'tab', tab: first as TabKey }
  return { name: 'tab', tab: 'home' }
}

export function tabHash(tab: TabKey) {
  return `#/${tab}`
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash())

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}

export function navigate(hash: string) {
  if (window.location.hash === hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.location.hash = hash
}
