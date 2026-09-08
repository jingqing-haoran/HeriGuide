import {
  ArrowRight,
  AudioLines,
  ChevronRight,
  Compass,
  Headphones,
  Languages,
  MapPin,
  MessageCircle,
  ScanLine,
  Sparkles,
  UserRound,
  Users,
  Volume2,
} from 'lucide-react'
import { featuredPlaces, PLACES } from '../../shared/data/places'
import { POSTS } from '../../shared/data/community'
import { HERITAGE_SHOTS } from '../../shared/data/heritageGallery'
import { t } from '../../shared/i18n'
import { useApp } from '../AppContext'
import {
  Avatar,
  Brand,
  DemoTag,
  LangSwitcher,
  OpenStatus,
  SectionHead,
} from '../ui'
import { FeaturedPlaceCard, NearbyPlaceCard, PlaceRowCard } from '../components/PlaceCards'

export function HomeScreen() {
  const { locale, go, openHelp } = useApp()
  const nearby = PLACES.slice(0, 5)
  const top = featuredPlaces[0]

  return (
    <>
      {/* Hero ---------------------------------------------------------------- */}
      <section className="relative h-[628px] overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="/images/places/20231125_Statue_of_Sun_Yat-sen_in_front_of_the_1911_Revolution_Museum.jpg"
          alt="Sun Yat-sen statue before the Xinhai Revolution Museum in Wuhan"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(16,12,9,.18) 0%, rgba(16,12,9,.02) 30%, rgba(16,12,9,.66) 72%, rgba(16,12,9,.86) 100%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <div className="rounded-full bg-black/22 py-1 pl-1 pr-3 backdrop-blur-md">
            <Brand tone="light" />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="icon-btn rounded-full bg-white/14 text-white backdrop-blur-md hover:bg-white/24"
              onClick={() => go('#/translate')}
              aria-label="Translate"
            >
              <Languages size={19} strokeWidth={1.9} />
            </button>
            <LangSwitcher light />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 text-[#fbf6ee]">
          <div className="fade-up flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.16em] text-[#f0d9b8]">
            <span className="inline-block h-px w-6 bg-[#c9543a]" />
            Wuhan · 1927 · 1911 · Story of modern China
          </div>
          <h1 className="fade-up mt-3 max-w-[350px] font-display text-[2.75rem] font-medium leading-[0.98] tracking-[-0.025em] text-balance" style={{ animationDelay: '70ms' }}>
            Wuhan’s revolutionary story, told in your language.
          </h1>
          <p className="fade-up mt-3 max-w-[330px] text-[0.95rem] font-normal leading-relaxed text-white/86" style={{ animationDelay: '140ms' }}>
            <span className="text-[#efd5ae]">文脉向导</span> · 把中国红色文化讲给世界。
            A free multilingual guide to the heritage of modern China.
          </p>
          <div className="fade-up mt-5 flex items-end justify-between gap-3" style={{ animationDelay: '210ms' }}>
            <button
              className="btn btn-lg min-h-[54px] flex-1"
              style={{ backgroundColor: '#f6efe3', color: '#211c15' }}
              onClick={() => go('#/explore')}
            >
              {t(locale, 'cta.explore')} <ArrowRight size={18} />
            </button>
            <div className="flex items-center gap-1" aria-hidden>
              {['中', 'EN', 'FR', 'ES'].map((code, i) => (
                <span
                  key={code}
                  className={`grid size-8 place-items-center rounded-full text-[0.66rem] font-bold ${
                    i === 0 ? 'border border-white/60 text-white' : 'bg-white/14 text-white/80'
                  }`}
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global purpose band ------------------------------------------------ */}
      <section className="m-section -mt-2">
        <div className="rounded-[16px] border border-line bg-paper px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-clay text-white">
              <Sparkles size={16} strokeWidth={1.9} />
            </span>
            <div>
              <p className="text-[0.9rem] font-bold leading-snug text-ink">
                Red heritage, carried onward by every visitor.
              </p>
              <p className="mt-1 text-[0.78rem] leading-relaxed text-ink-faint">
                HeriGuide is a non-profit project helping China’s revolutionary story travel — one
                translated object, room and conversation at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby -------------------------------------------------------------- */}
      <section className="m-section mt-8">
        <SectionHead
          title={t(locale, 'home.nearby')}
          note={t(locale, 'home.nearby.sub')}
          action={t(locale, 'action.seeAll')}
          onAction={() => go('#/explore')}
        />
        <div className="no-scrollbar -mx-[18px] flex snap-x gap-3 overflow-x-auto px-[18px] pb-2">
          {nearby.map((place) => (
            <NearbyPlaceCard key={place.slug} place={place} />
          ))}
        </div>
      </section>

      {/* Core features --------------------------------------------------------- */}
      <section className="m-section mt-9">
        <SectionHead
          title={t(locale, 'home.features')}
          note={t(locale, 'home.features.sub')}
        />
        <div className="grid gap-2.5">
          {/* Translation — product demo at work */}
          <button className="tap flex w-full items-center gap-4 rounded-[16px] border border-line bg-paper p-4 text-left transition-transform active:scale-[0.99]" onClick={() => go('#/translate')}>
            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-clay text-white">
              <Languages size={20} strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.98rem] font-bold text-ink">{t(locale, 'feature.translate')}</span>
              <span className="mt-1 block truncate text-[0.8rem] text-ink-faint">
                “八七会议” <ChevronRight size={12} className="inline" /> August 7th Meeting
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-ink-faint" />
          </button>

          {/* Smart map */}
          <button className="tap flex w-full items-center gap-4 rounded-[16px] border border-line bg-paper p-4 text-left transition-transform active:scale-[0.99]" onClick={() => go('#/map')}>
            <span className="relative grid size-11 shrink-0 place-items-center rounded-[12px] bg-night text-white">
              <Compass size={20} strokeWidth={1.9} />
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-gold text-[8px]">•</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.98rem] font-bold text-ink">{t(locale, 'feature.map')}</span>
              <span className="mt-1 flex items-center gap-1.5 text-[0.8rem] text-ink-faint">
                <MapPin size={12} /> 0.4 km · exhibition hall mapped
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-ink-faint" />
          </button>

          {/* Audio guide */}
          <div className="rounded-[16px] border border-line bg-paper p-4">
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-gold-soft text-[#6c4c15]">
                <Headphones size={20} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.98rem] font-bold text-ink">{t(locale, 'feature.audio')}</p>
                <p className="mt-1 truncate text-[0.8rem] text-ink-faint">{t(locale, 'feature.audio.desc')}</p>
              </div>
              <button
                className="btn btn-sm !rounded-full bg-ink text-paper-warm"
                onClick={() => top && go(`#/place/${top.slug}`)}
                aria-label="Play audio guide"
              >
                <Volume2 size={15} />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[0.68rem] text-ink-faint">
              <span className="rounded-full bg-clay-wash px-2 py-1 font-semibold text-clay-deep">EN</span>
              <span className="rounded-full bg-paper-deep px-2 py-1 font-semibold">FR</span>
              <span className="rounded-full bg-paper-deep px-2 py-1 font-semibold">ES</span>
              <span className="rounded-full bg-paper-deep px-2 py-1 font-semibold">中文</span>
              <AudioLines size={13} className="ml-auto" />
            </div>
          </div>

          {/* Community */}
          <button className="tap flex w-full items-center gap-4 rounded-[16px] border border-line bg-paper p-4 text-left transition-transform active:scale-[0.99]" onClick={() => go('#/community')}>
            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-paper-deep text-ink">
              <Users size={20} strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.98rem] font-bold text-ink">{t(locale, 'feature.community')}</span>
              <span className="mt-1 flex items-center gap-1.5 text-[0.8rem] text-ink-faint">
                <span className="flex -space-x-1.5">
                  {POSTS.slice(0, 3).map((post) => (
                    <Avatar key={post.id} name={post.author} letter={post.flagLetter.slice(0, 1)} accent={post.accent} size="sm" />
                  ))}
                </span>
                23 countries learning together
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-ink-faint" />
          </button>
        </div>
      </section>

      {/* Featured places ------------------------------------------------------ */}
      <section className="m-section mt-9">
        <SectionHead
          title={t(locale, 'home.featured')}
          note={t(locale, 'home.featured.sub')}
          action={t(locale, 'action.seeAll')}
          onAction={() => go('#/explore')}
        />
        {top ? (
          <div className="mb-3">
            <FeaturedPlaceCard place={top} />
          </div>
        ) : null}
        <div className="grid gap-0.5">
          {featuredPlaces.slice(1).map((place) => (
            <PlaceRowCard key={place.slug} place={place} trailing={<ChevronRight className="my-auto shrink-0 text-ink-faint" size={18} />} />
          ))}
        </div>
      </section>

      {/* Heritage gallery ------------------------------------------------------ */}
      <section className="m-section mt-10">
        <SectionHead
          title="Wuhan in red & stone"
          note="红色图志 · 八张照片里的武汉革命记忆"
        />
        <div className="no-scrollbar -mx-[18px] flex snap-x gap-3 overflow-x-auto px-[18px] pb-2">
          {HERITAGE_SHOTS.slice(0, 6).map((shot) => (
            <article
              key={shot.image}
              className="w-[218px] shrink-0 snap-start overflow-hidden rounded-[16px] bg-paper-deep"
            >
              <div className="relative h-[262px]">
                <img
                  className="media-cover absolute inset-0"
                  src={shot.image}
                  alt={shot.title.en}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(16,11,8,.85), rgba(16,11,8,.08) 58%, rgba(16,11,8,0))',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 text-white">
                  <p className="font-display text-[1.05rem] font-medium leading-tight text-balance">
                    {shot.title.en}
                  </p>
                  <p className="mt-1 text-[0.66rem] font-semibold tracking-[0.06em] text-[#efd5ae]">
                    {shot.title.zh}
                  </p>
                </div>
              </div>
              <p className="line-clamp-2 px-3 py-2.5 text-[0.72rem] leading-snug text-ink-faint">
                {shot.note.en}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works ---------------------------------------------------------- */}
      <section className="m-section mt-10">
        <SectionHead title={t(locale, 'home.how')} note={t(locale, 'home.how.sub')} />
        <ol className="relative">
          {[
            {
              icon: ScanLine,
              title: 'Scan',
              zh: '扫码',
              body: 'No download. Scan the site QR code or open the link — your guide is already there.',
            },
            {
              icon: MapPin,
              title: 'Explore',
              zh: '探索',
              body: 'Follow a surveyed route. Rooms, objects and facilities are mapped and named for you.',
            },
            {
              icon: UserRound,
              title: 'Understand',
              zh: '理解',
              body: 'Hear the story in your language — then ask, share and carry it onward.',
            },
          ].map((step, i) => (
            <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
              {i < 2 ? (
                <span className="absolute left-[23px] top-12 h-[calc(100%-2rem)] w-px bg-line-strong" aria-hidden />
              ) : null}
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-line bg-paper-warm text-clay shadow-[0_2px_8px_rgba(33,28,21,0.06)]">
                <step.icon size={20} strokeWidth={1.8} />
              </span>
              <div className="pt-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink-faint">
                  Step {i + 1} · {step.zh}
                </p>
                <h3 className="mt-1 font-display text-[1.25rem] font-medium text-ink">{step.title}</h3>
                <p className="mt-1.5 max-w-[260px] text-[0.84rem] leading-relaxed text-ink-faint">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Community preview ------------------------------------------------------ */}
      <section className="m-section mt-9">
        <SectionHead
          title={t(locale, 'home.community')}
          note={t(locale, 'home.community.sub')}
          action={t(locale, 'action.seeAll')}
          onAction={() => go('#/community')}
        />
        <div className="grid gap-3">
          {POSTS.slice(0, 2).map((post, i) => (
            <article
              key={post.id}
              className={`rounded-[16px] border border-line bg-paper ${i % 2 ? 'ml-5' : 'mr-5'}`}
            >
              <div className="flex items-center gap-2.5 px-4 pt-3.5">
                <Avatar name={post.author} letter={post.flagLetter.slice(0, 1)} accent={post.accent} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[0.84rem] font-bold text-ink">{post.author}</p>
                  <p className="text-[0.7rem] font-medium text-ink-faint">{post.country}</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-[0.68rem] font-semibold text-ink-faint">
                  <MessageCircle size={12} /> {post.comments}
                </span>
              </div>
              <h3 className="px-4 pt-2.5 font-display text-[1.05rem] font-medium leading-snug text-ink">
                {post.title}
              </h3>
              {post.image ? (
                <div className="mx-4 mt-3 h-[176px] overflow-hidden rounded-[10px] bg-paper-deep">
                  <img className="media-cover" src={post.image} alt="" loading="lazy" />
                </div>
              ) : null}
              <button
                className="tap w-full px-4 pb-3.5 pt-3 text-left text-[0.76rem] font-semibold text-clay"
                onClick={() => go('#/community')}
              >
                Read the full story <ArrowRight size={13} className="inline" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Help banner --------------------------------------------------------------- */}
      <section className="m-section mt-10">
        <div className="relative overflow-hidden rounded-[18px] bg-night px-5 py-6 text-paper-warm">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background:
                'radial-gradient(560px 220px at 92% -10%, rgba(201,84,58,.55), transparent 60%), radial-gradient(300px 180px at -10% 110%, rgba(164,117,47,.32), transparent 60%)',
            }}
          />
          <div className="relative">
            <DemoTag />
            <h2 className="mt-3 max-w-[280px] font-display text-[1.6rem] font-medium leading-[1.05] text-balance">
              Lost a word? Need a room? Ask a human guide.
            </h2>
            <p className="mt-2 max-w-[300px] text-[0.82rem] leading-relaxed text-white/70">
              One tap connects you to multilingual student volunteers during opening hours.
            </p>
            <div className="mt-5 flex gap-2">
              <button className="btn btn-light" onClick={openHelp}>
                Ask now
              </button>
              <button
                className="btn border border-white/25 text-white/90 hover:bg-white/10"
                onClick={() => go('#/profile')}
              >
                Volunteer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer --------------------------------------------------------------- */}
      <footer className="m-section mt-11 pb-2">
        <div className="flex items-center justify-between border-t border-line pt-5">
          <Brand />
          <LangSwitcher compact />
        </div>
        <p className="mt-4 text-[0.7rem] leading-relaxed text-ink-faint">
          {t(locale, 'publicwelfare')} · Demo frontend — data shown is illustrative until site
          licensing is confirmed.
        </p>
      </footer>
    </>
  )
}
