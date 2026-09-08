import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  Search,
  Volume2,
  X,
} from 'lucide-react'
import { PLACES, getPlace } from '../../shared/data/places'
import type { Place } from '../../shared/types'
import { localized, t } from '../../shared/i18n'
import { useApp } from '../AppContext'
import { Brand, LangSwitcher, LanguageDots } from '../ui'

const MARKER_POS: Record<string, [number, number]> = {
  'xinhai-museum': [252, 122],
  honglou: [176, 208],
  'wuhan-revolution-museum': [220, 330],
  'fifth-congress': [172, 366],
  'peasant-institute': [238, 414],
  'mao-residence': [168, 448],
  'august-7th': [306, 264],
  'feb7-union': [344, 200],
}

const FACILITIES = [
  { label: 'Entrance', x: 218, y: 470 },
  { label: 'Restroom', x: 104, y: 348 },
  { label: 'AED', x: 120, y: 252 },
  { label: 'Visitor centre', x: 290, y: 414 },
  { label: 'Exit', x: 62, y: 176 },
]

export function MapScreen() {
  const { locale, go, toast } = useApp()
  const [selectedSlug, setSelectedSlug] = useState('honglou')
  const [showServices, setShowServices] = useState(true)
  const [routeActive, setRouteActive] = useState(false)
  const selected = getPlace(selectedSlug) ?? PLACES[0]

  const markers = useMemo(
    () =>
      PLACES.map((place) => ({
        place,
        pos: MARKER_POS[place.slug] ?? [150, 300],
      })),
    [],
  )

  const startRoute = () => {
    setRouteActive(true)
    toast(`Route to ${localized(locale, selected.names)} ready — 5 min walk`)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-4 pb-2 pt-[max(0.85rem,env(safe-area-inset-top))]">
        <Brand />
        <div className="flex items-center gap-1">
          <LangSwitcher compact />
          <button
            className="icon-btn icon-btn-solid"
            aria-label="Locate me"
            onClick={() => toast('Locating… you are at the main entrance')}
          >
            <LocateFixed size={18} />
          </button>
        </div>
      </header>

      <div className="px-4 pb-2">
        <p className="text-[0.9rem] font-bold text-ink">Wuchang · 1927 Heritage District</p>
        <p className="text-[0.72rem] text-ink-faint">Demo indoor-outdoor map · surveyed March 2026</p>
      </div>

      {/* Map canvas ---------------------------------------------------------- */}
      <div className="relative mx-4 overflow-hidden rounded-[20px] border border-line bg-[#e9e3d8] shadow-[inset_0_0_0_1px_rgba(255,255,255,.6)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-[#e9e3d8]/80 to-transparent" />
        <svg viewBox="0 0 390 560" className="block w-full" role="img" aria-label="HeriGuide live map">
          {/* Yangtze river */}
          <path
            d="M-10 40 C 90 12, 160 96, 250 60 C 300 40, 330 4, 400 -6"
            fill="none"
            stroke="#cfd8d2"
            strokeWidth="26"
            opacity="0.85"
          />
          <text x="270" y="34" fill="#8a9a91" fontSize="10" opacity=".9">长江 Yangtze</text>
          {/* District blocks */}
          {[
            'M70 110 h92 v56 h-92z',
            'M214 88 h96 v58 h-96z',
            'M24 208 h78 v66 h-78z',
            'M124 204 h72 v74 h-72z',
            'M216 178 h84 v62 h-84z',
            'M318 148 h52 v66 h-52z',
            'M48 300 h86 v66 h-86z',
            'M164 300 h92 v62 h-92z',
            'M286 296 h76 v52 h-76z',
            'M60 388 h78 v56 h-78z',
            'M170 382 h88 v52 h-88z',
            'M286 372 h74 v54 h-74z',
            'M116 456 h72 v46 h-72z',
            'M226 440 h92 v50 h-92z',
          ].map((d, i) => (
            <path key={i} d={d} fill="#e2dbcc" stroke="#d4cbbb" strokeWidth="1" />
          ))}
          {/* Green area */}
          <ellipse cx="304" cy="112" rx="44" ry="24" fill="#dbe3d3" />
          {/* Roads */}
          {[
            'M30 96 H370',
            'M30 250 H370',
            'M52 40 V480',
            'M180 80 V500',
            'M286 84 V480',
            'M48 170 H330',
            'M30 330 H360',
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#d9d0c0" strokeWidth={i === 0 ? 12 : 7} />
          ))}
          {['M30 250 H370', 'M180 80 V500'].map((d, i) => (
            <path key={`c${i}`} d={d} stroke="#fff" strokeWidth="1" strokeDasharray="4 8" opacity=".7" fill="none" />
          ))}
          {/* You are here */}
          <g transform="translate(116 470)">
            <circle r="16" fill="#211c15" opacity=".08" />
            <circle r="9" fill="#fff" stroke="#211c15" strokeWidth="2.5" />
            <circle r="3.4" fill="#211c15" />
          </g>
          <text x="102" y="472" fill="#211c15" fontSize="10" fontWeight="700">
            You are here
          </text>

          {routeActive ? (
            <path
              d="M116 470 C 140 420, 158 320, 176 208"
              fill="none"
              stroke="#a92e1f"
              strokeWidth="3.5"
              strokeDasharray="2 8"
              strokeLinecap="round"
            />
          ) : null}

          {/* Site markers */}
          {markers.map(({ place, pos }) => {
            const active = place.slug === selected.slug
            const [x, y] = pos
            return (
              <g
                key={place.slug}
                transform={`translate(${x} ${y})`}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedSlug(place.slug)
                  setRouteActive(false)
                }}
                aria-label={localized(locale, place.names)}
              >
                {active ? (
                  <>
                    <circle r="22" fill="#a92e1f" opacity=".1">
                      <animate attributeName="r" values="12;24;12" dur="2.6s" repeatCount="indefinite" />
                    </circle>
                    <circle r="18" fill="#f6f1e8" opacity=".7" />
                  </>
                ) : null}
                <circle r="8.5" fill={active ? '#a92e1f' : '#211c15'} stroke="#f6f1e8" strokeWidth="2.5" />
                {active ? <circle r="3" fill="#fff" /> : null}
              </g>
            )
          })}

          {/* Facilities */}
          {showServices
            ? FACILITIES.map((f) => (
                <g key={f.label} transform={`translate(${f.x} ${f.y})`}>
                  <circle r="8" fill="#fff" stroke="#9aa08f" strokeWidth="1.6" opacity=".95" />
                  <circle r="2.6" fill="#6f7a68" />
                  <text
                    x="0"
                    y="-12"
                    textAnchor="middle"
                    fill="#57503f"
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    {f.label}
                  </text>
                </g>
              ))
            : null}
        </svg>

        {/* Search + layer controls */}
        <div className="absolute left-3 right-3 top-3 z-20 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              className="field !min-h-[46px] rounded-full pl-10 text-[0.86rem]"
              placeholder={t(locale, 'map.search')}
              aria-label="Search the map"
            />
          </div>
          <button className="icon-btn icon-btn-glass" aria-label="Compass north">
            <Compass size={19} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 z-20 flex gap-1.5">
          <button
            className={`chip !min-h-[32px] bg-white/85 text-[0.74rem] backdrop-blur ${showServices ? 'active' : ''}`}
            aria-pressed={showServices}
            onClick={() => setShowServices((v) => !v)}
          >
            Services
          </button>
          <button
            className="chip !min-h-[32px] bg-white/85 text-[0.74rem] backdrop-blur"
            aria-pressed={false}
            onClick={() => toast('Indoor level 1 · English route loaded')}
          >
            Level 1
          </button>
        </div>
      </div>

      {/* Bottom sheet ---------------------------------------------------------- */}
      <div className="relative z-30 mx-0 mt-3 border-t border-line/70 bg-paper-warm pb-1 shadow-[0_-10px_30px_rgba(33,28,21,0.08)]">
        <div className="flex gap-4 px-4 py-4">
          <div className="relative h-[116px] w-[92px] shrink-0 overflow-hidden rounded-[12px] bg-paper-deep">
            <img className="media-cover" src={selected.image} alt="" />
            <span className="absolute left-1.5 top-1.5">
              <LanguageDots languages={selected.languages} max={4} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-clay">
              {selected.region} · {selected.distanceKm} {t(locale, 'place.distance')}
            </div>
            <h2 className="mt-1 truncate text-[1.05rem] font-bold leading-tight text-ink">
              {localized(locale, selected.names)}
            </h2>
            <p className="mt-1 text-[0.7rem] font-medium text-ink-faint">
              {selected.walkMinutes} {t(locale, 'place.walk')} · ★ {selected.rating}
            </p>
            <p className="mt-1.5 line-clamp-2 text-[0.76rem] leading-snug text-ink-soft">
              {localized(locale, selected.summary)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button className="btn btn-clay flex-1" onClick={() => go(`#/place/${selected.slug}`)}>
            {t(locale, 'map.sheet.guide')} <ArrowUpRight size={16} />
          </button>
          <button
            className="btn btn-dark flex-1"
            onClick={startRoute}
            aria-pressed={routeActive}
          >
            <Navigation size={16} />
            {t(locale, 'cta.navigate')}
          </button>
          <button
            className="icon-btn icon-btn-solid"
            aria-label="Play audio guide"
            onClick={() => {
              toast(`Audio guide: ${localized(locale, selected.names)} — EN`)
            }}
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
