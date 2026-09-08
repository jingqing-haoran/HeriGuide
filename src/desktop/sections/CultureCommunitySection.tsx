import {
  ArrowRight,
  BadgeCheck,
  Heart,
  MessageCircle,
  Quote,
  Sparkles,
} from 'lucide-react'
import { POSTS } from '../../shared/data/community'

export function CultureCommunitySection() {
  return (
    <>
      {/* Culture — why translation is not enough ------------------------------ */}
      <section className="bg-night py-24 text-paper-warm" id="culture">
        <div className="d-container">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="d-reveal lg:col-span-7">
              <p className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-[#e8cf9d]">
                The cultural layer
              </p>
              <h2 className="d-display d-display--lg mt-5 text-paper-warm">
                A translation is not understanding.
              </h2>
            </div>
            <p className="d-reveal max-w-[500px] text-[0.95rem] leading-[1.75] text-white/68 lg:col-span-5">
              Every red term carries a world behind it. HeriGuide’s reviewers don’t only translate —
              they carry the context across, so a foreign visitor meets the idea, not just the word.
            </p>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {[
              {
                term: '八七会议',
                gloss: 'August 7th Meeting',
                image: 'images/places/八七会议会址大门.jpg',
                zh: '不是“八月七日的会议”这么简单',
                en: 'A date hides an emergency: a secret meeting that redirected a revolution.',
              },
              {
                term: '辛亥',
                gloss: 'Xinhai',
                image: 'images/places/辛亥革命博物馆2019.jpg',
                zh: '一字背后是一整年的中国',
                en: 'A year name in the sexagenary calendar — 1911, the year an empire ended.',
              },
              {
                term: '红巷',
                gloss: 'The Red Lane',
                image: 'images/places/武汉革命博物馆_5611.jpg',
                zh: '红色不是涂装，是历史的命名',
                en: 'Not painted red — named for the 1927 revolution it once concentrated.',
              },
            ].map((card, i) => (
              <article
                key={card.term}
                className="d-reveal group relative overflow-hidden rounded-[16px] border border-white/12 bg-white/[0.045] p-6"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="font-display text-[2rem] font-medium text-white">{card.term}</span>
                <span className="mt-1 block text-[0.8rem] font-semibold text-[#efd5ae]">{card.gloss}</span>
                <div className="mt-4 h-32 overflow-hidden rounded-[10px] border border-white/10 bg-white/10">
                  <img
                    src={card.image}
                    alt={card.gloss}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-5 h-px bg-white/10" />
                <p className="mt-4 text-[0.88rem] font-medium text-white/78">{card.zh}</p>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-white/55">{card.en}</p>
              </article>
            ))}
          </div>

          <div className="d-reveal mt-10 flex flex-wrap items-center justify-between gap-6 rounded-[16px] border border-white/10 bg-white/[0.05] px-6 py-5">
            <p className="max-w-[680px] font-display text-[1.15rem] leading-[1.6] text-white/85">
              “When a visitor can retell a story in their own words, the culture has travelled. That
              is the measurement we care about.”
            </p>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-clay text-white">王</span>
              <div>
                <p className="text-[0.85rem] font-bold">Team HeriGuide</p>
                <p className="text-[0.68rem] text-white/55">外国语 × 物理 × 城环 × 文学</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community ------------------------------------------------------------ */}
      <section className="d-section" id="community">
        <div className="d-container">
          <div className="d-section-head d-reveal">
            <div>
              <p className="d-index">Voices from the road</p>
              <h2 className="d-display d-display--lg mt-4">The story continues with its readers</h2>
            </div>
            <a href="./mobile.html#/community" target="_blank" rel="noreferrer" className="btn btn-dark">
              Join the community <ArrowRight size={17} />
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {POSTS.slice(0, 3).map((post, i) => (
              <article
                key={post.id}
                className={`d-card d-reveal overflow-hidden ${i === 0 ? 'lg:-mt-6' : ''}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                {post.image ? (
                  <div className="relative h-[220px] overflow-hidden bg-paper-deep">
                    <img src={post.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-[0.66rem] font-bold text-white backdrop-blur">
                      <Quote size={11} /> {post.kind === 'question' ? 'Question' : 'Story'}
                    </span>
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-full text-[0.72rem] font-bold text-white" style={{ background: post.accent }}>
                      {post.author[0]}
                    </span>
                    <div>
                      <p className="text-[0.84rem] font-bold text-ink">{post.author}</p>
                      <p className="text-[0.68rem] text-ink-faint">{post.country}</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1.5 text-[0.72rem] font-semibold text-ink-faint">
                      <Heart size={13} /> {post.likes}
                      <MessageCircle size={13} className="ml-1.5" /> {post.comments}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-[1.15rem] font-medium leading-snug text-ink">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[0.84rem] leading-relaxed text-ink-soft">{post.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="d-reveal mt-8 flex flex-col items-start justify-between gap-5 rounded-[16px] bg-paper-deep/70 px-6 py-5 md:flex-row md:items-center">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 text-clay" size={21} />
              <p className="max-w-[620px] text-[0.88rem] leading-relaxed text-ink-soft">
                Volunteer answers are reviewed by the CCNU team; high-quality contributions can
                count toward recognised service hours — so helping foreign visitors is also part of
                a student’s own public service journey.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-clay px-3.5 py-2 text-[0.74rem] font-bold text-white">
              <Sparkles size={14} /> 23 countries so far
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
