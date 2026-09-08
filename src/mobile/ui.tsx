import type { ReactNode } from 'react'
import { Globe } from 'lucide-react'
import type { Locale, Place } from '../shared/types'
import { LOCALE_NAMES, localized, t } from '../shared/i18n'
import { useApp } from './AppContext'

/** Language badge used on cards and headers */
export function LanguageDots({ languages, max = 3 }: { languages: Locale[]; max?: number }) {
  const shown = languages.slice(0, max)
  return (
    <span className="inline-flex items-center gap-1" aria-label="Available languages">
      {shown.map((lang) => (
        <span
          key={lang}
          className="grid size-5 place-items-center rounded-full border border-white/40 bg-black/25 text-[9px] font-bold uppercase tracking-wide text-white"
        >
          {lang === 'zh' ? '中' : lang.slice(0, 2)}
        </span>
      ))}
      {languages.length > max ? (
        <span className="text-[10px] font-medium opacity-80">+{languages.length - max}</span>
      ) : null}
    </span>
  )
}

export function LangSwitcher({
  compact = false,
  light = false,
}: {
  compact?: boolean
  light?: boolean
}) {
  const { locale, go, route } = useApp()
  return (
    <button
      className={`icon-btn ${
        light
          ? 'rounded-full bg-white/14 text-white backdrop-blur-md hover:bg-white/24'
          : 'icon-btn-solid'
      }`}
      onClick={() => go('#/language')}
      aria-label="Change language"
    >
      <Globe size={19} strokeWidth={1.9} />
      <span className="sr-only">Language</span>
      {!compact && !light && (
        <span className="text-[0.78rem] font-semibold">{LOCALE_NAMES[locale]}</span>
      )}
    </button>
  )
}

/** Reusable status/open row. */
export function OpenStatus({ place }: { place: Place }) {
  const { locale } = useApp()
  const closed = Boolean(place.closedDay)
  return (
    <span className={`status-pill ${closed ? 'status-pill--closed' : ''}`}>
      {closed ? t(locale, 'action.closedToday') : t(locale, 'action.openNow')} ·{' '}
      {localized(locale, place.openHours)}
    </span>
  )
}

/** Brand lock-up shown in headers. */
export function Brand({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { locale } = useApp()
  const light = tone === 'light'
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="monogram" aria-hidden>
        H
      </span>
      <span className="min-w-0 leading-tight">
        <span
          className={`block truncate text-[1rem] font-bold tracking-[-0.01em] ${light ? 'text-white' : 'text-ink'}`}
        >
          HeriGuide
        </span>
        <span
          className={`block text-[0.62rem] font-medium tracking-[0.06em] ${light ? 'text-white/70' : 'text-ink-faint'}`}
        >
          {t(locale, 'brand.subline')}
        </span>
      </span>
    </div>
  )
}

export function SectionHead({
  title,
  note,
  action,
  onAction,
}: {
  title: string
  note?: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="mb-3.5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-[1.45rem] leading-[1.08] tracking-[-0.015em] text-ink text-balance">
          {title}
        </h2>
        {note ? <p className="mt-1 text-[0.78rem] font-medium text-ink-faint">{note}</p> : null}
      </div>
      {action ? (
        <button onClick={onAction} className="tap shrink-0 pb-1 text-[0.8rem] font-semibold text-clay">
          {action}
        </button>
      ) : null}
    </div>
  )
}

export function PageTitle({ eyebrow, title }: { eyebrow?: ReactNode; title: string }) {
  return (
    <header className="px-5 pt-5">
      {eyebrow ? <div className="mb-2">{eyebrow}</div> : null}
      <h1 className="font-display text-[2.05rem] font-medium leading-[1.02] tracking-[-0.02em] text-ink text-balance">
        {title}
      </h1>
    </header>
  )
}

export function Avatar({
  name,
  letter,
  accent = '#a92e1f',
  size = 'md',
}: {
  name: string
  letter: string
  accent?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const dim = size === 'sm' ? 'size-8 text-[10px]' : size === 'lg' ? 'size-14 text-base' : 'size-10 text-[11px]'
  return (
    <span
      className={`${dim} grid shrink-0 place-items-center rounded-full font-bold tracking-wide text-white`}
      style={{ background: accent }}
      aria-label={name}
    >
      {letter}
    </span>
  )
}

export function DemoTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-soft px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
      Demo content
    </span>
  )
}
