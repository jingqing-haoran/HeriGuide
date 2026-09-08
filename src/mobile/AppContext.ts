import { createContext, useContext } from 'react'
import type { Locale, Route, TabKey } from '../shared/types'

export interface MobileCtx {
  locale: Locale
  setLocale: (locale: Locale) => void
  route: Route
  go: (hash: string) => void
  openTab: (tab: TabKey) => void
  toast: (message: string) => void
  openHelp: () => void
}

export const AppContext = createContext<MobileCtx | null>(null)

export function useApp(): MobileCtx {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('AppContext missing')
  return ctx
}
