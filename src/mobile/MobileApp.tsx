import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Compass,
  Home,
  Map as MapIcon,
  MessageCircle,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import { AppContext, useApp, type MobileCtx } from './AppContext'
import { navigate, useHashRoute, tabHash } from '../shared/useHashRoute'
import { LOCALES, LOCALE_NAMES, t } from '../shared/i18n'
import type { Locale, Route, TabKey } from '../shared/types'
import { HomeScreen } from './screens/HomeScreen'
import { ExploreScreen } from './screens/ExploreScreen'
import { MapScreen } from './screens/MapScreen'
import { CommunityScreen } from './screens/CommunityScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { PlaceDetailScreen } from './screens/PlaceDetailScreen'
import { TranslateScreen } from './screens/TranslateScreen'
import { Brand } from './ui'

const TABS: { key: TabKey; icon: typeof Home; labelKey: string }[] = [
  { key: 'home', icon: Home, labelKey: 'nav.home' },
  { key: 'explore', icon: Compass, labelKey: 'nav.explore' },
  { key: 'map', icon: MapIcon, labelKey: 'nav.map' },
  { key: 'community', icon: MessageCircle, labelKey: 'nav.community' },
  { key: 'profile', icon: UserRound, labelKey: 'nav.profile' },
]

interface ToastItem {
  id: number
  text: string
}

function MobileShell() {
  const route = useHashRoute()
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('heri-locale') as Locale | null
    return saved && LOCALES.includes(saved) ? saved : 'en'
  })
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [helpOpen, setHelpOpen] = useState(false)

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random()
    setToasts((list) => [...list, { id, text }])
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 2600)
  }, [])

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next)
      localStorage.setItem('heri-locale', next)
    },
    [],
  )

  const go = useCallback((hash: string) => navigate(hash), [])

  const openTab = useCallback((tab: TabKey) => go(tabHash(tab)), [go])

  const openHelp = useCallback(() => setHelpOpen(true), [])

  const ctx: MobileCtx = useMemo(
    () => ({ locale, setLocale, route, go, openTab, toast, openHelp }),
    [locale, setLocale, route, go, openTab, toast, openHelp],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  const isSubpage = route.name === 'place' || route.name === 'translate'

  let screen: ReactNode = null
  if (route.name === 'place') screen = <PlaceDetailScreen slug={route.slug} />
  else if (route.name === 'translate') screen = <TranslateScreen />
  else if (route.name === 'tab') {
    if (route.tab === 'home') screen = <HomeScreen />
    else if (route.tab === 'explore') screen = <ExploreScreen />
    else if (route.tab === 'map') screen = <MapScreen />
    else if (route.tab === 'community') screen = <CommunityScreen />
    else screen = <ProfileScreen />
  }

  const tabKey: TabKey | null = route.name === 'tab' ? route.tab : null

  return (
    <AppContext.Provider value={ctx}>
      <div className="phone-viewport">
        {!isSubpage ? (
          <>
            <main className="app-scroll" key={`tab-${tabKey}`}>
              <div key={route.name === 'tab' ? route.tab : route.name} className="screen-enter">
                {screen}
              </div>
            </main>
            <nav className="tabbar" aria-label="Primary">
              <div className="tabbar__nav">
                {TABS.map(({ key, icon: Icon, labelKey }) => {
                  const current = tabKey === key
                  return (
                    <button
                      key={key}
                      className="tabbar__item tap"
                      aria-current={current ? 'page' : undefined}
                      onClick={() => openTab(key)}
                    >
                      <Icon size={21} strokeWidth={current ? 2.2 : 1.8} />
                      <span>{t(locale, labelKey)}</span>
                      <span className="tabbar__dot" aria-hidden />
                    </button>
                  )
                })}
              </div>
            </nav>
          </>
        ) : (
          <main className="min-h-dvh">{screen}</main>
        )}

        {toasts.length ? (
          <div className="toast-stack" role="status" aria-live="polite">
            {toasts.map((item) => (
              <div className="toast" key={item.id}>
                <ShieldCheck size={16} className="text-[#d8c07a]" aria-hidden />
                {item.text}
              </div>
            ))}
          </div>
        ) : null}

        {helpOpen ? (
          <HelpSheet onClose={() => setHelpOpen(false)} />
        ) : null}

        {route.name === 'language' ? (
          <LanguageSheet
            locale={locale}
            onSelect={(next) => {
              setLocale(next)
              if (window.history.length > 1) {
                window.history.back()
              } else {
                navigate('#/home')
              }
            }}
            onClose={() => (window.history.length > 1 ? window.history.back() : navigate('#/home'))}
          />
        ) : null}
      </div>
    </AppContext.Provider>
  )
}

function LanguageSheet({
  locale,
  onSelect,
  onClose,
}: {
  locale: Locale
  onSelect: (locale: Locale) => void
  onClose: () => void
}) {
  return (
    <>
      <div className="sheet-backdrop tap" onClick={onClose} aria-hidden />
      <section className="sheet" role="dialog" aria-modal="true" aria-label="Choose language">
        <button className="absolute right-3 top-3 icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="sheet__grab" />
        <div className="px-6 pb-7 pt-3">
          <h2 className="font-display text-[1.6rem] leading-tight text-ink">Choose your language</h2>
          <p className="mt-1 text-[0.85rem] text-ink-faint">
            Every page adjusts — including guided commentary.
          </p>
          <div className="mt-5 grid gap-1.5">
            {LOCALES.map((lang) => {
              const selected = locale === lang
              return (
                <button
                  key={lang}
                  onClick={() => onSelect(lang)}
                  className={`flex min-h-[52px] items-center justify-between rounded-[12px] border px-4 text-left transition-colors ${
                    selected
                      ? 'border-clay bg-clay-wash text-clay-deep'
                      : 'border-line text-ink hover:bg-paper-soft'
                  }`}
                  aria-pressed={selected}
                >
                  <span className="text-[0.95rem] font-semibold">{LOCALE_NAMES[lang]}</span>
                  {lang === 'zh' ? <span className="text-[0.75rem]">简体中文</span> : null}
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

function HelpSheet({ onClose }: { onClose: () => void }) {
  const { toast } = useApp()
  return (
    <>
      <div className="sheet-backdrop tap" onClick={onClose} aria-hidden />
      <section className="sheet" role="dialog" aria-modal="true" aria-label="Need help">
        <button className="absolute right-3 top-3 icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="sheet__grab" />
        <div className="px-6 pb-8 pt-3">
          <span className="rule-label">Volunteer network</span>
          <h2 className="mt-2 font-display text-[1.7rem] leading-tight text-ink">Need help?</h2>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-faint">
            Multilingual volunteers from Central China Normal University are online during museum hours.
          </p>
          <div className="mt-5 grid gap-2.5">
            <button
              className="btn btn-clay w-full"
              onClick={() => {
                toast('Request sent — a volunteer will join you shortly.')
                onClose()
              }}
            >
              Ask a volunteer now
            </button>
            <button className="btn btn-outline w-full" onClick={() => toast('Offline card ready — translation works without network.')}>
              Offline phrase card
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export function MobileApp() {
  return <MobileShell />
}
