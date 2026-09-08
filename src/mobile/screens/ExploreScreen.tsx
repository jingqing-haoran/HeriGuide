import { useEffect, useMemo, useState } from 'react'
import {
  ChevronRight,
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { PLACES, PLACE_CATEGORIES } from '../../shared/data/places'
import type { Locale, Place, PlaceCategory } from '../../shared/types'
import { t } from '../../shared/i18n'
import { useApp } from '../AppContext'
import { LangSwitcher, PageTitle } from '../ui'
import { FeaturedPlaceCard, PlaceRowCard } from '../components/PlaceCards'

export function ExploreScreen() {
  const { locale, go } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | PlaceCategory>('all')
  const [langFilter, setLangFilter] = useState<Locale | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 520)
    return () => window.clearTimeout(timer)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PLACES.filter((place) => {
      if (category !== 'all' && place.category !== category) return false
      if (langFilter !== 'all' && !place.languages.includes(langFilter)) return false
      if (!q) return true
      const hay = `${place.names.zh} ${place.names.en} ${place.summary.en} ${place.region}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, category, langFilter])

  const isBrowsing = !query && category === 'all' && langFilter === 'all'

  const reset = () => {
    setQuery('')
    setCategory('all')
    setLangFilter('all')
  }

  return (
    <div className="pb-6">
      <PageTitle
        eyebrow={
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-clay">
              <MapPin size={13} /> Wuchang · Hankou
            </span>
            <LangSwitcher compact />
          </div>
        }
        title="Explore red Wuhan"
      />
      <p className="px-5 pt-1.5 text-[0.86rem] leading-relaxed text-ink-faint">
        Ten heritage sites surveyed by our team in 2026 — routes, rooms and stories, mapped for
        international visitors.
      </p>

      <div className="m-section mt-5">
        <div className="relative">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            className="field pl-11 pr-10"
            placeholder={t(locale, 'search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search places"
          />
          {query ? (
            <button
              className="icon-btn absolute right-0.5 top-1/2 -translate-y-1/2"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        <div className="no-scrollbar -mx-[18px] mt-3 flex gap-2 overflow-x-auto px-[18px] pb-0.5">
          {(
            [
              { key: 'all', label: 'All languages' },
              { key: 'zh', label: '中文' },
              { key: 'en', label: 'English' },
              { key: 'fr', label: 'Français' },
              { key: 'es', label: 'Español' },
            ] as { key: Locale | 'all'; label: string }[]
          ).map((item) => (
            <button
              key={item.key}
              className={`chip ${langFilter === item.key ? 'active' : ''}`}
              aria-pressed={langFilter === item.key}
              onClick={() => setLangFilter(item.key === langFilter ? 'all' : item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="no-scrollbar -mx-[18px] flex flex-1 gap-2 overflow-x-auto px-[18px]">
            {PLACE_CATEGORIES.map((item) => (
              <button
                key={item.key}
                className="tap shrink-0 pb-1.5 text-[0.82rem] font-semibold transition-colors"
                style={{ color: category === item.key ? 'var(--ink)' : 'var(--ink-faint)' }}
                aria-pressed={category === item.key}
                onClick={() =>
                  setCategory((prev) => (prev === item.key ? 'all' : (item.key as 'all' | PlaceCategory)))
                }
              >
                {locale === 'zh' ? item.label.zh : item.label.en}
                <span
                  className={`mt-1 block h-[2px] rounded-full transition-all ${
                    category === item.key ? 'w-full bg-clay' : 'w-0 bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[0.72rem] font-semibold text-ink-faint">
            <SlidersHorizontal size={13} /> {results.length}
          </span>
        </div>
      </div>

      <section className="m-section mt-3">
        {loading ? (
          <SkeletonList />
        ) : results.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <>
            {isBrowsing ? (
              <>
                <div className="mb-5">
                  <p className="mb-2.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                    Route of the month · Wuchang
                  </p>
                  <FeaturedPlaceCard place={PLACES[0]} />
                </div>
                <PlaceRowGroup places={results.slice(1, 5)} />
                <div className="mt-6 grid gap-0.5 border-t border-line pt-4">
                  <PlaceRowGroup places={results.slice(5)} />
                </div>
              </>
            ) : (
              <PlaceRowGroup places={results} />
            )}
          </>
        )}
      </section>

      <section className="m-section mt-9">
        <button className="flex w-full items-center gap-3 rounded-[16px] border border-line bg-paper px-4 py-3.5 text-left" onClick={() => go('#/map')}>
          <span className="grid size-10 place-items-center rounded-[11px] bg-night text-white">
            <LocateFixed size={17} />
          </span>
          <span className="flex-1">
            <span className="block text-[0.92rem] font-bold text-ink">Open live map</span>
            <span className="block text-[0.75rem] text-ink-faint">Current position · room-level routes</span>
          </span>
          <ChevronRight size={18} className="text-ink-faint" />
        </button>
      </section>
    </div>
  )
}

function PlaceRowGroup({ places }: { places: Place[] }) {
  const { locale } = useApp()
  if (!places.length) return null
  return (
    <div className="grid gap-0.5">
      {places.map((place) => (
        <PlaceRowCard key={place.slug} place={place} />
      ))}
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="grid gap-3" role="status" aria-label="Loading places">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3 rounded-[14px] bg-paper-soft/70 p-1.5">
          <div className="h-[86px] w-[74px] animate-pulse rounded-[10px] bg-mist/70" />
          <div className="flex-1 py-2">
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-mist/80" />
            <div className="mt-2 h-3.5 w-3/4 animate-pulse rounded-full bg-mist/60" />
            <div className="mt-2 h-2.5 w-5/6 animate-pulse rounded-full bg-mist/50" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const { locale } = useApp()
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-paper-deep text-ink-faint">
        <Search size={22} strokeWidth={1.7} />
      </span>
      <h3 className="mt-4 font-display text-[1.35rem] text-ink">No sites match yet</h3>
      <p className="mt-2 max-w-[250px] text-[0.85rem] leading-relaxed text-ink-faint">
        Try another language filter — every site supports at least Chinese and English.
      </p>
      <button className="btn btn-outline btn-sm mt-5" onClick={onReset}>
        Reset filters
      </button>
    </div>
  )
}
