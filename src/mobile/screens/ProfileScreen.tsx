import {
  Award,
  ChevronRight,
  Globe2,
  HandHeart,
  HeartHandshake,
  Languages,
  Lock,
  MapPinned,
  MessageSquareText,
  Settings2,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { BADGES } from '../../shared/data/badges'
import { t } from '../../shared/i18n'
import { useApp } from '../AppContext'
import { Avatar, LangSwitcher } from '../ui'

const VISITED = 4
const TOTAL = 8

export function ProfileScreen() {
  const { locale, go, toast, openHelp } = useApp()

  return (
    <div className="pb-8">
      {/* Identity ----------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-b-[24px] bg-night px-5 pb-7 pt-5 text-paper-warm">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src="/images/places/武汉革命博物馆_5611.jpg"
          alt=""
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#120e0a]/55" />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(320px 190px at 92% 8%, rgba(201,84,58,.6), transparent 62%), radial-gradient(240px 150px at -5% 100%, rgba(164,117,47,.38), transparent 62%)',
          }}
        />
        <div className="relative flex items-center justify-between">
          <h1 className="font-display text-[2.05rem] font-medium leading-[1.02] tracking-[-0.02em] text-paper-warm text-balance">
            My Journey
          </h1>
          <LangSwitcher light />
        </div>
        <div className="relative mt-4 flex items-center gap-3.5">
          <Avatar name="Anna Meyer" letter="A" accent="#a92e1f" size="lg" />
          <div>
            <p className="text-[1.08rem] font-bold">Anna Meyer</p>
            <p className="text-[0.76rem] font-medium text-white/65">Germany · English · 中文 · Español</p>
          </div>
          <button
            className="icon-btn ml-auto !size-10 rounded-full border border-white/20 text-white/90 hover:bg-white/10"
            aria-label="Share profile"
            onClick={() => toast('Journey card copied — ready to share')}
          >
            <Share2 size={17} />
          </button>
        </div>
        <p className="relative mt-4 rounded-[12px] border border-white/10 bg-white/8 px-3.5 py-3 text-[0.78rem] leading-relaxed text-white/78">
          A non-profit keeps your story: every visit, translation and shared answer quietly carries
          Wuhan’s heritage to another corner of the world.
        </p>
      </section>

      {/* Journey stats ------------------------------------------------------- */}
      <section className="m-section -mt-5">
        <div className="rounded-[16px] border border-line bg-paper-warm px-4 py-4 shadow-[0_10px_30px_rgba(33,28,21,0.08)]">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[12px] bg-clay text-white">
              <MapPinned size={20} />
            </span>
            <div className="flex-1">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                {t(locale, 'profile.visited')}
              </p>
              <p className="font-display text-[1.65rem] font-medium leading-none text-ink">
                {VISITED} <span className="text-[0.85rem] text-ink-faint">/ {TOTAL} sites</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-[1.4rem] font-medium text-ink">5.6 km</p>
              <p className="text-[0.68rem] font-semibold text-ink-faint">walked with guides</p>
            </div>
          </div>
          <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-paper-deep">
            <div className="h-full w-1/2 rounded-full bg-clay" />
          </div>
          <div className="mt-2 flex justify-between text-[0.68rem] font-semibold text-ink-faint">
            <span>Red Heritage Explorer 2/3</span>
            <span>4 languages used</span>
          </div>
        </div>
      </section>

      {/* Badges --------------------------------------------------------------- */}
      <section className="m-section mt-8">
        <div className="mb-3.5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-[1.45rem] leading-tight text-ink">
              {t(locale, 'profile.badges')}
            </h2>
            <p className="mt-1 text-[0.76rem] font-medium text-ink-faint">
              Honour earned by visiting deeply, sharing honestly
            </p>
          </div>
          <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[0.7rem] font-bold text-[#6c4c15]">
            {BADGES.filter((b) => !b.locked).length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {BADGES.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} hero={i === 0} />
          ))}
        </div>
      </section>

      {/* Why badges exist ------------------------------------------------------ */}
      <section className="m-section mt-5">
        <div className="rounded-[16px] border border-line bg-paper px-4 py-4">
          <div className="flex items-start gap-3">
            <HeartHandshake size={20} className="mt-0.5 text-clay" />
            <div>
              <p className="text-[0.9rem] font-bold text-ink">Honour is not a game</p>
              <p className="mt-1 text-[0.78rem] leading-relaxed text-ink-faint">
                Badges come from real visits and quality contributions — and volunteer answers can
                count toward service hours at Central China Normal University.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action list -------------------------------------------------------------- */}
      <section className="m-section mt-8 grid gap-1.5">
        {[
          {
            icon: Languages,
            label: t(locale, 'profile.language'),
            note: 'English · 中文 · Français · Español',
            action: () => go('#/language'),
          },
          {
            icon: HandHeart,
            label: t(locale, 'profile.volunteer'),
            note: 'Answer travellers · earn service hours',
            action: () => toast('Volunteer application opens soon — demo'),
          },
          {
            icon: MessageSquareText,
            label: t(locale, 'profile.feedback'),
            note: 'Report a translation or suggest a route',
            action: () => openHelp(),
          },
          {
            icon: Settings2,
            label: 'Settings & data',
            note: t(locale, 'profile.privacy'),
            action: () => toast('Location stays on this device. No personal ID is stored.'),
          },
        ].map((item) => (
          <button
            key={item.label}
            className="tap flex w-full items-center gap-3 rounded-[14px] border border-line bg-paper px-3.5 py-3 text-left"
            onClick={item.action}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-paper-deep text-ink">
              <item.icon size={17} strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9rem] font-bold text-ink">{item.label}</span>
              <span className="block truncate text-[0.72rem] font-medium text-ink-faint">{item.note}</span>
            </span>
            <ChevronRight size={17} className="text-ink-faint" />
          </button>
        ))}
      </section>

      <section className="m-section mt-8 flex items-center justify-between gap-3 rounded-[16px] bg-paper-deep/70 px-4 py-3.5">
        <span className="flex items-center gap-2 text-[0.75rem] font-bold text-ink">
          <Globe2 size={16} className="text-clay" />
          {t(locale, 'publicwelfare')}
        </span>
        <ShieldCheck size={17} className="text-gold" />
      </section>
    </div>
  )
}

function BadgeCard({
  badge,
  hero,
}: {
  badge: (typeof BADGES)[number]
  hero?: boolean
}) {
  const { locale, toast } = useApp()
  const accent = {
    clay: '#a92e1f',
    gold: '#a4752f',
    ink: '#211c15',
    green: '#3d6b52',
  }[badge.accent]

  if (badge.locked) {
    return (
      <button
        className="tap flex min-h-[168px] flex-col rounded-[16px] border border-dashed border-line-strong bg-transparent p-4 text-left"
        onClick={() => toast(`${badge.progress ?? 0}% complete — keep exploring`)}
      >
        <span className="grid size-11 place-items-center rounded-full border border-line bg-paper-soft text-ink-faint">
          <Lock size={17} />
        </span>
        <span className="mt-3 text-[0.8rem] font-bold leading-snug text-ink-soft">
          {badge.names[locale] ?? badge.names.en}
        </span>
        <span className="mt-auto pt-3 text-[0.66rem] font-semibold text-ink-faint">
          {badge.progress}% of the way
        </span>
        <span className="mt-1 h-1 overflow-hidden rounded-full bg-paper-deep">
          <span className="block h-full rounded-full bg-gold" style={{ width: `${badge.progress}%` }} />
        </span>
      </button>
    )
  }

  return (
    <button
      className={`tap relative flex min-h-[168px] flex-col overflow-hidden rounded-[16px] p-4 text-left text-white ${
        hero ? 'col-span-2 min-h-[150px] flex-row items-center gap-4' : ''
      }`}
      style={{ background: accent }}
      onClick={() => toast(`${badge.names[locale] ?? badge.names.en} — badge earned. Well travelled!`)}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(200px 130px at 108% -12%, #f0d9b8, transparent 60%), radial-gradient(140px 110px at -8% 115%, rgba(255,255,255,.6), transparent 60%)',
        }}
      />
      {hero ? (
        <>
          <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-white/30 bg-white/12">
            <Award size={24} />
          </span>
          <span className="relative">
            <span className="block text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white/70">
              Earned · Wuchang
            </span>
            <span className="mt-1 block font-display text-[1.5rem] font-medium leading-tight">
              {badge.names[locale] ?? badge.names.en}
            </span>
            <span className="mt-2 block max-w-[250px] text-[0.74rem] leading-relaxed text-white/80">
              {badge.detail[locale] ?? badge.detail.en}
            </span>
          </span>
        </>
      ) : (
        <>
          <span className="relative grid size-11 place-items-center rounded-full border border-white/25 bg-white/12">
            <Sparkles size={18} />
          </span>
          <span className="relative mt-3 text-[0.8rem] font-bold leading-snug">
            {badge.names[locale] ?? badge.names.en}
          </span>
          <span className="relative mt-auto pt-2 text-[0.68rem] text-white/75">
            {badge.detail[locale] ?? badge.detail.en}
          </span>
        </>
      )}
    </button>
  )
}
