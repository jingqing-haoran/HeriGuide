import { ArrowUpRight, Clock3, Languages } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Place } from '../../shared/types'
import { localized, t } from '../../shared/i18n'
import { useApp } from '../AppContext'
import { LanguageDots } from '../ui'

export function FeaturedPlaceCard({ place }: { place: Place }) {
  const { locale, go } = useApp()
  return (
    <article
      className="m-media-card m-media-card--portrait tap w-full"
      onClick={() => go(`#/place/${place.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && go(`#/place/${place.slug}`)}
    >
      <img
        className="media-cover"
        src={place.image}
        alt={localized(locale, place.names)}
        loading="lazy"
      />
      <div className="m-media-content">
        <div className="flex items-center justify-between gap-2">
          <span className="status-pill">
            {place.region} · {place.distanceKm} {t(locale, 'place.distance')}
          </span>
          <LanguageDots languages={place.languages} />
        </div>
        <h3 className="mt-3 font-display text-[1.42rem] font-medium leading-[1.04] tracking-[-0.01em] text-balance">
          {localized(locale, place.names)}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.8rem] leading-relaxed text-white/82">
          {localized(locale, place.summary)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-[0.82rem] font-semibold">
          {t(locale, 'cta.viewGuide')} <ArrowUpRight size={15} />
        </span>
      </div>
    </article>
  )
}

export function NearbyPlaceCard({ place }: { place: Place }) {
  const { locale, go } = useApp()
  return (
    <article
      className="w-[218px] shrink-0 snap-start cursor-pointer"
      onClick={() => go(`#/place/${place.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && go(`#/place/${place.slug}`)}
    >
      <div className="m-media-card m-media-card--landscape w-full">
        <img className="media-cover" src={place.image} alt="" loading="lazy" />
        <div className="m-media-content justify-between">
          <span className="status-pill self-start">
            {place.walkMinutes} {t(locale, 'place.walk')}
          </span>
          <span className="text-[0.72rem] font-semibold text-white/90">
            {place.distanceKm} {t(locale, 'place.distance')}
          </span>
        </div>
      </div>
      <div className="px-0.5 pt-2">
        <h3 className="truncate text-[0.94rem] font-bold tracking-[-0.01em] text-ink">
          {localized(locale, place.names)}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-[0.76rem] leading-snug text-ink-faint">
          {localized(locale, place.summary)}
        </p>
      </div>
    </article>
  )
}

export function PlaceRowCard({
  place,
  trailing,
}: {
  place: Place
  trailing?: ReactNode
}) {
  const { locale, go } = useApp()
  return (
    <article
      className="group flex items-stretch gap-3 rounded-[14px] p-1.5 transition-colors duration-200 hover:bg-paper-soft/80"
      onClick={() => go(`#/place/${place.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && go(`#/place/${place.slug}`)}
    >
      <div className="relative h-[86px] w-[74px] shrink-0 overflow-hidden rounded-[10px] bg-paper-deep">
        <img className="media-cover" src={place.image} alt="" loading="lazy" />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-center gap-1.5 text-[0.64rem] font-bold uppercase tracking-[0.1em] text-clay">
          {place.region}
          <span aria-hidden>·</span>
          {place.rating} ★
        </div>
        <h3 className="mt-1 truncate text-[0.96rem] font-bold leading-tight text-ink">
          {localized(locale, place.names)}
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.76rem] leading-snug text-ink-faint">
          {localized(locale, place.summary)}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[0.68rem] font-medium text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={11} />
            {localized(locale, place.openHours)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Languages size={11} />
            {place.languages.length}
          </span>
        </div>
      </div>
      {trailing}
    </article>
  )
}

export function CompactPlaceCard({ place }: { place: Place }) {
  const { locale, go } = useApp()
  return (
    <button
      className="tap flex w-[138px] flex-col items-start text-left"
      onClick={() => go(`#/place/${place.slug}`)}
    >
      <span className="m-media-card block h-[108px] w-full">
        <img className="media-cover" src={place.image} alt="" loading="lazy" />
      </span>
      <span className="mt-2 line-clamp-2 text-[0.82rem] font-bold leading-tight text-ink">
        {localized(locale, place.names)}
      </span>
      <span className="mt-1 text-[0.7rem] font-medium text-ink-faint">
        {place.distanceKm} {t(locale, 'place.distance')} · {place.walkMinutes}m
      </span>
    </button>
  )
}
