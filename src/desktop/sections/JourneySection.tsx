import { Award, ArrowRight, Globe2, Lock, MapPinned } from 'lucide-react'
import { BADGES } from '../../shared/data/badges'

export function JourneySection() {
  return (
    <section className="d-section pb-24" id="journey">
      <div className="d-container grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="d-reveal lg:col-span-5">
          <p className="d-index">Honour system</p>
          <h2 className="d-display d-display--lg mt-4">
            A journey worth carrying home
          </h2>
          <p className="d-lead mt-6">
            Badges are earned, not bought — for visiting deeply, sharing honestly and helping other
            visitors. They turn a museum day into a collected memory of cultural exchange.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: MapPinned, label: 'Visit real sites along surveyed routes' },
              { icon: Globe2, label: 'Ask or answer across language borders' },
              { icon: Award, label: 'Earn museum-inspired honour badges' },
              { icon: Lock, label: 'No points, no payments — only meaning' },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-[0.92rem] font-medium text-ink-soft">
                <item.icon size={17} className="text-clay" /> {item.label}
              </li>
            ))}
          </ul>
          <a href="./mobile.html#/profile" target="_blank" rel="noreferrer" className="btn btn-dark mt-8">
            Open My Journey <ArrowRight size={17} />
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          {BADGES.slice(0, 4).map((badge, i) => (
            <div
              key={badge.id}
              className={`d-reveal relative overflow-hidden rounded-[16px] p-6 ${
                i === 0
                  ? 'bg-clay text-white'
                  : badge.accent === 'gold'
                    ? 'bg-gold text-[#fff8e8]'
                    : 'border border-line bg-paper-warm text-ink'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid size-12 place-items-center rounded-full border ${
                    i === 0 ? 'border-white/30 bg-white/12' : i === 1 ? 'border-white/30 bg-white/12' : 'border-line bg-paper-deep/70'
                  }`}
                >
                  {badge.locked ? (
                    <Lock size={19} className={i === 0 || i === 1 ? 'text-white/75' : 'text-ink-faint'} />
                  ) : (
                    <Award size={19} />
                  )}
                </span>
                {badge.locked ? (
                  <span className="rounded-full bg-white/12 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider">
                    {badge.progress}% there
                  </span>
                ) : (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider">
                    Earned
                  </span>
                )}
              </div>
              <h3 className="mt-6 font-display text-[1.35rem] font-medium leading-tight">{badge.names.en}</h3>
              <p className={`mt-2 text-[0.82rem] leading-relaxed ${i === 0 || i === 1 ? 'text-white/80' : 'text-ink-faint'}`}>
                {badge.detail.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
