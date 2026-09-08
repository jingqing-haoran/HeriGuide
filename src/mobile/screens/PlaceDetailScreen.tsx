import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  DoorOpen,
  ExternalLink,
  Heart,
  History,
  Languages,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Navigation,
  Pause,
  Play,
  Share2,
  Star,
  Users,
  Video,
  Volume2,
  WifiOff,
} from 'lucide-react'
import { getPlace, PLACES } from '../../shared/data/places'
import { localized, t } from '../../shared/i18n'
import type { Locale, Place } from '../../shared/types'
import { useApp } from '../AppContext'
import { LanguageDots, OpenStatus } from '../ui'
import { CompactPlaceCard } from '../components/PlaceCards'

const EXPLORE_TABS = [
  { key: 'history', en: 'History', zh: '历史' },
  { key: 'stories', en: 'Stories', zh: '故事' },
  { key: 'space', en: 'Space', zh: '空间' },
  { key: 'objects', en: 'Objects', zh: '文物' },
] as const

export function PlaceDetailScreen({ slug }: { slug: string }) {
  const { locale, go, toast } = useApp()
  const place = getPlace(slug)
  const [tab, setTab] = useState<(typeof EXPLORE_TABS)[number]['key']>('history')
  const [playing, setPlaying] = useState(false)
  const [audioLocale, setAudioLocale] = useState<Locale>('en')
  const [progress, setProgress] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          setPlaying(false)
          return 0
        }
        return value + 0.8
      })
    }, 120)
    return () => window.clearInterval(timer)
  }, [playing])

  useEffect(() => {
    setTab('history')
    setPlaying(false)
    setProgress(0)
  }, [slug])

  if (!place) {
    return (
      <div className="grid min-h-dvh place-items-center px-8 text-center">
        <div>
          <BookOpen className="mx-auto text-ink-faint" size={30} />
          <p className="mt-3 font-display text-[1.4rem] text-ink">Place not found</p>
          <button className="btn btn-outline btn-sm mt-5" onClick={() => go('#/explore')}>
            Back to explore
          </button>
        </div>
      </div>
    )
  }

  const facts = [
    { icon: Clock3, label: 'Hours', value: localized(locale, place.openHours) },
    { icon: MapPin, label: 'District', value: place.region },
    { icon: DoorOpen, label: 'Visit time', value: `≈ ${place.audioMinutes} min guided` },
    { icon: Languages, label: 'Languages', value: place.languages.length + ' supported' },
  ]

  const otherPlaces = PLACES.filter((p) => p.slug !== slug).slice(0, 4)

  return (
    <article className="pb-10">
      {/* Hero ---------------------------------------------------------------- */}
      <section className="relative h-[430px] overflow-hidden">
        <img className="media-cover absolute inset-0" src={place.image} alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a07]/90 via-[#0e0a07]/18 to-[#0e0a07]/30" />
        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 pt-[max(0.7rem,env(safe-area-inset-top))]">
          <button
            className="icon-btn icon-btn-glass !size-10"
            aria-label={t(locale, 'action.back')}
            onClick={() => go('#/explore')}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex gap-1.5">
            <button
              className="icon-btn icon-btn-glass !size-10"
              aria-label="Translate this page"
              onClick={() => go('#/translate')}
            >
              <Languages size={18} />
            </button>
            <button
              className="icon-btn icon-btn-glass !size-10"
              aria-label="Share place"
              onClick={() => {
                setSaved(!saved)
                toast(saved ? 'Removed from journey' : 'Saved to your journey')
              }}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </header>
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 text-[#fbf6ee]">
          <div className="flex items-center justify-between gap-2">
            <OpenStatus place={place} />
            <div className="flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
              <Star size={12} fill="currentColor" /> {place.rating}
            </div>
          </div>
          <h1 className="mt-3 font-display text-[2.4rem] font-medium leading-[1.0] tracking-[-0.02em] text-balance">
            {localized(locale, place.names)}
          </h1>
          <p className="mt-1.5 text-[0.88rem] font-medium text-white/85">
            {localized(locale === 'zh' ? 'zh' : 'en', place.names)}
          </p>
          <div className="mt-2">
            <LanguageDots languages={place.languages} max={4} />
          </div>
        </div>
      </section>

      {/* Intro + facts --------------------------------------------------------- */}
      <section className="m-section mt-6">
        <p className="text-[0.94rem] leading-[1.75] text-ink-soft">{localized(locale, place.description)}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-[13px] border border-line bg-paper px-3.5 py-3">
              <fact.icon size={16} className="text-clay" strokeWidth={1.9} />
              <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-ink-faint">
                {fact.label}
              </p>
              <p className="mt-1 text-[0.84rem] font-semibold leading-snug text-ink">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore tabs ------------------------------------------------------------ */}
      <section className="m-section mt-8">
        <h2 className="font-display text-[1.5rem] text-ink">Explore this place</h2>
        <div className="mt-3 flex gap-1 overflow-x-auto rounded-[12px] bg-paper-deep/70 p-1">
          {EXPLORE_TABS.map((item) => (
            <button
              key={item.key}
              className={`min-h-[40px] flex-1 whitespace-nowrap rounded-[9px] px-3 text-[0.8rem] font-bold transition-colors ${
                tab === item.key ? 'bg-paper-warm text-ink shadow-sm' : 'text-ink-faint'
              }`}
              aria-pressed={tab === item.key}
              onClick={() => setTab(item.key)}
            >
              {locale === 'zh' ? item.zh : item.en}
            </button>
          ))}
        </div>
        <ExploreContent place={place} tab={tab} />
      </section>

      {/* Audio guide ------------------------------------------------------------- */}
      <section className="m-section mt-9">
        <div className="overflow-hidden rounded-[18px] bg-night p-4 text-paper-warm">
          <div className="flex items-center gap-3">
            <button
              className="grid size-[52px] shrink-0 place-items-center rounded-full bg-clay text-white"
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={22} /> : <Play size={22} className="translate-x-0.5" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[0.78rem] font-bold text-[#efd5ae]">Guided audio · {audioLocale.toUpperCase()}</p>
              <p className="truncate text-[1.02rem] font-bold text-white">
                {localized(locale, place.names)} — the story in {place.audioMinutes} minutes
              </p>
            </div>
            <Volume2 size={18} className="text-white/55" />
          </div>

          <div className="mt-3.5 flex h-9 items-center gap-0.5" aria-hidden>
            {Array.from({ length: 26 }).map((_, i) => {
              const h = 5 + ((i * 17) % 19)
              const active = playing && i / 26 <= progress / 100
              return (
                <span
                  key={i}
                  className={`w-[3px] rounded-full ${active ? 'bg-clay-soft' : 'bg-white/18'}`}
                  style={{ height: `${h}px` }}
                />
              )
            })}
          </div>
          <div className="mt-1 flex items-center justify-between text-[0.64rem] font-medium text-white/50">
            <span>{(progress * place.audioMinutes) / 60}s</span>
            <span>{place.audioMinutes}:00</span>
          </div>

          <div className="mt-3 flex gap-1.5">
            {place.languages.map((lang) => (
              <button
                key={lang}
                className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${
                  audioLocale === lang ? 'bg-clay text-white' : 'bg-white/10 text-white/75 hover:bg-white/20'
                }`}
                onClick={() => {
                  setAudioLocale(lang)
                  setPlaying(true)
                }}
              >
                {lang === 'zh' ? '中文' : lang.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.64rem] leading-relaxed text-white/45">
            Commentary drafted by the CCNU team and reviewed by professional translators.
          </p>
        </div>
      </section>

      {/* Map + route --------------------------------------------------------------- */}
      <section className="m-section mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-[1.5rem] text-ink">Find your way</h2>
            <p className="mt-1 text-[0.78rem] text-ink-faint">Room-level map from our March 2026 site survey</p>
          </div>
          <button className="btn btn-sm btn-outline" onClick={() => toast('Full map opens on the Map tab')}>
            <MapIcon size={14} /> Open map
          </button>
        </div>
        <MiniSiteMap place={place} />
      </section>

      {/* Cultural note --------------------------------------------------------------- */}
      <section className="m-section mt-8">
        <div className="relative overflow-hidden rounded-[18px] border border-clay/25 bg-clay-wash px-5 py-5">
          <div className="absolute right-4 top-3 font-display text-[3.4rem] font-medium text-clay/12" aria-hidden>
            ?
          </div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-clay">
            You may not know · 你可能不知道
          </p>
          <p className="mt-3 font-display text-[1.18rem] font-medium leading-[1.35] text-ink">
            {localized(locale, place.culturalNote)}
          </p>
          <button
            className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-clay-deep"
            onClick={() => toast('Cultural note unlocked — badge progress +1')}
          >
            Mark as understood <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Video guide ------------------------------------------------------------- */}
      <section className="m-section mt-8">
        <h2 className="font-display text-[1.5rem] text-ink">Video guide</h2>
        <p className="mt-1 text-[0.78rem] text-ink-faint">3 min film · subtitles in four languages</p>
        <div className="relative mt-3 h-[210px] overflow-hidden rounded-[16px] bg-paper-deep">
          <img className="media-cover absolute inset-0" src={place.image} alt="" />
          <div className="absolute inset-0 grid place-items-center bg-black/28">
            <button
              className="grid size-14 place-items-center rounded-full bg-[#f7f1e6]/95 text-ink shadow-lg"
              aria-label="Play video"
              onClick={() => toast('Video demo: sign language & subtitles connect with real API')}
            >
              <Play size={22} className="translate-x-0.5" />
            </button>
          </div>
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[0.68rem] font-bold text-white backdrop-blur">
            <Video size={12} /> 3:12 · EN subtitles
          </span>
        </div>
      </section>

      {/* Keep visiting ---------------------------------------------------------------- */}
      <section className="m-section mt-9">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-[1.5rem] text-ink">Continue the walk</h2>
            <p className="mt-1 text-[0.78rem] text-ink-faint">Same district · same century, next chapter</p>
          </div>
        </div>
        <div className="no-scrollbar -mx-[18px] mt-4 flex snap-x gap-3 overflow-x-auto px-[18px] pb-2">
          {otherPlaces.map((p) => (
            <CompactPlaceCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      {/* Offline note + footer actions ------------------------------------------------ */}
      <section className="m-section mt-8">
        <div className="flex items-start gap-3 rounded-[14px] bg-paper-deep/60 px-4 py-3.5">
          <WifiOff size={17} className="mt-0.5 text-ink-faint" />
          <p className="text-[0.75rem] leading-relaxed text-ink-faint">
            This guide caches for offline use — text, map and audio stay available after one load.
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-clay flex-1" onClick={() => go('#/map')}>
            <Navigation size={16} /> Start route
          </button>
          <button className="btn btn-outline flex-1" onClick={() => toast('Opening share sheet')}>
            <Share2 size={16} /> Share
          </button>
        </div>
      </section>
    </article>
  )
}

function ExploreContent({ place, tab }: { place: Place; tab: string }) {
  const copy = {
    history: {
      en: 'The route through this site follows the chronology of the event it commemorates — from the decisions in 1927 to their consequences across the country.',
      zh: '这里的参观路线遵循它所纪念事件的时间线索——从 1927 年的抉择，到它影响全国的后续。',
    },
    stories: {
      en: 'Look for the hand-written letters and restored daily objects. Our guides tell the people behind the dates: who wrote, who waited, who decided.',
      zh: '请留意手写信件与复原的日常物件。讲解会告诉你日期背后的人——谁在书写、谁在等待、谁在做决定。',
    },
    space: {
      en: 'The building itself is an exhibit. Doorways, windows and the distance between rooms explain how secrecy, scale and daily life shaped the events.',
      zh: '建筑本身就是展品。门窗与房间的距离，解释着秘密、规模与日常生活如何塑造了事件。',
    },
    objects: {
      en: 'Featured artefacts are tagged with a small numbered disc. Point HeriGuide’s translator at any caption to add context from the reviewed glossary.',
      zh: '重点文物带有编号圆盘。用 HeriGuide 拍译展牌，即可获得经专业审核的扩展注释。',
    },
  } as const
  const current = copy[tab as keyof typeof copy]
  return (
    <div className="mt-4 rounded-[14px] border border-line bg-paper px-4 py-4">
      <div className="flex items-center gap-2 text-clay">
        {tab === 'history' ? <History size={15} /> : tab === 'stories' ? <Users size={15} /> : <MapIcon size={15} />}
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em]">
          {tab} · {place.category}
        </span>
      </div>
      <p className="mt-2 text-[0.9rem] leading-[1.75] text-ink-soft">{current.en}</p>
      <p className="mt-2 text-[0.8rem] leading-[1.7] text-ink-faint">{current.zh}</p>
    </div>
  )
}

function MiniSiteMap({ place }: { place: Place }) {
  const { locale, toast } = useApp()
  const [routeOn, setRouteOn] = useState(false)
  const points = useMemo(
    () => [
      { name: 'Entrance', x: 18, y: 86, type: 'door' as const },
      { name: 'Main hall', x: 46, y: 38, type: 'room' as const },
      { name: 'Exhibition B', x: 72, y: 62, type: 'room' as const },
      { name: 'Restroom', x: 88, y: 24, type: 'service' as const },
      { name: 'AED', x: 16, y: 30, type: 'service' as const },
      { name: 'Exit', x: 82, y: 88, type: 'door' as const },
    ],
    [],
  )
  const active = points[2]
  return (
    <div className="relative mt-3 overflow-hidden rounded-[18px] border border-line bg-[#e9e3d6]">
      <div className="relative h-[220px]">
        {/* interior corridors */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path d="M0 20 H100 M0 58 H100 M0 82 H100 M30 20 V100 M62 0 V100 M30 0 V100" stroke="#d6cdbb" strokeWidth="1.6" fill="none" />
          <path d="M0 20 H100 M62 0 V100" stroke="#fff" strokeWidth=".6" strokeDasharray="1.5 2.4" opacity=".7" />
          {routeOn ? (
            <path
              d="M18 86 C 26 66, 34 58, 72 62"
              fill="none"
              stroke="#a92e1f"
              strokeWidth="1.8"
              strokeDasharray="1.6 2.8"
            />
          ) : null}
        </svg>
        {points.map((p) => (
          <span
            key={p.name}
            className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${
              p.type === 'service'
                ? 'size-4 border border-[#6f7a68] bg-white text-[5px]'
                : p.type === 'door'
                  ? 'size-4 border-2 border-ink bg-white'
                  : p.type === 'room'
                    ? 'size-5 border border-clay bg-clay text-white'
                    : ''
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            title={p.name}
          >
            {p.type === 'room' ? <span className="text-[7px]" /> : null}
          </span>
        ))}
        <span
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 text-[7px] font-bold text-ink"
          style={{ left: '92%', top: '70%' }}
        >
          <LocateFixed size={9} /> You
        </span>
        <span
          className="absolute left-[46%] top-[38%] rounded bg-white/90 px-1 py-0.5 text-[7px] font-bold uppercase tracking-wider text-ink-faint"
        >
          {place.region} · level 1
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-line bg-paper-warm px-3.5 py-3">
        <div className="min-w-0">
          <p className="text-[0.8rem] font-bold text-ink">{active.name}</p>
          <p className="truncate text-[0.68rem] text-ink-faint">
            12 m ahead · turn right at the colonnade
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            className="btn btn-dark btn-sm"
            onClick={() => {
              setRouteOn(true)
              toast('Route preview on — follow the red dashes')
            }}
          >
            Navigate
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => toast('Audio plays at each numbered stop')}>
            <Play size={13} /> Stops
          </button>
        </div>
      </div>
    </div>
  )
}
