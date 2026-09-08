import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="d-hero">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/places/辛亥革命博物馆2019.jpg"
        alt="Xinhai Revolution Museum in Wuhan"
      />
      <div className="d-container relative z-10 pb-[max(3.2rem,env(safe-area-inset-bottom))] pt-40">
        <div className="max-w-[980px]">
          <p className="d-hero__eyebrow d-reveal">Wuhan · Wuchang · 1911–1927</p>
          <h1 className="d-display d-display--xl d-reveal mt-6" style={{ transitionDelay: '90ms' }}>
            China’s red heritage,
            <br />
            written for the world.
          </h1>
          <p
            className="d-hero__chinese d-reveal mt-6 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-normal tracking-[-0.01em]"
            style={{ transitionDelay: '160ms' }}
          >
            文脉向导：把红色文化讲给世界，让故事被真正读懂。
          </p>
          <div className="d-reveal mt-8 flex flex-wrap items-center gap-3" style={{ transitionDelay: '230ms' }}>
            <a href="#places" className="btn btn-light btn-lg">
              Start exploring <ArrowRight size={18} />
            </a>
            <a href="#guide" className="btn btn-lg border border-white/35 text-white hover:bg-white/12">
              How the guide works
            </a>
          </div>
          <div
            className="d-reveal mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.8rem] font-medium text-white/75"
            style={{ transitionDelay: '300ms' }}
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#efd5ae]" /> Reviewed multilingual content
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} className="text-[#efd5ae]" /> 10 sites surveyed in person
            </span>
            <span className="inline-flex items-center gap-2">4 languages at launch</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function MissionSection() {
  const findings = [
    { value: '82%', label: 'of surveyed visitors could not fully understand a site because of language.', note: 'field survey · 50 visitors' },
    { value: '76%', label: 'wanted the guide in their own or a familiar language.', note: '23 countries represented' },
    { value: '61%', label: 'of respondents were native speakers of languages beyond English.', note: 'small-language first' },
    { value: '69%', label: 'preferred a lightweight H5 guide over downloading an app.', note: 'scan to start' },
  ]
  return (
    <section className="d-section pb-0">
      <div className="d-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="d-reveal lg:col-span-6">
            <p className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-clay">
              The problem we measured
            </p>
            <h2 className="d-display d-display--lg mt-5">
              Visitors see the objects. The story stays out of reach.
            </h2>
            <p className="d-lead mt-6 max-w-[620px]">
              Revolutionary heritage speaks in dates, places and terms that assume years of local
              knowledge — <em className="font-display">“Xinhai”</em>, <em className="font-display">“1927”</em>,{' '}
              <em className="font-display">“the Red Lane”</em>. A literal translation gives words, not
              understanding. HeriGuide adds the missing layer: human-reviewed language, mapped space and
              story-led commentary built for international visitors.
            </p>
            <div className="mt-8 border-l-2 border-clay pl-5">
              <p className="max-w-[560px] font-display text-[1.18rem] leading-[1.55] text-ink-soft">
                红色文化不应只是“看见”，更要“读懂”。We believe a museum visit succeeds when a visitor
                leaves able to tell the story themselves.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {findings.map((f, i) => (
                <div
                  key={f.value}
                  className={`d-reveal rounded-[14px] border border-line bg-paper-warm p-6 ${i === 0 ? 'bg-paper-deep/60' : ''}`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <p className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.02em] text-clay">
                    {f.value}
                  </p>
                  <p className="mt-3 text-[0.85rem] font-semibold leading-snug text-ink">{f.label}</p>
                  <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                    {f.note}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.68rem] text-ink-faint">
              Figures from the team’s April–August 2026 field research at Wuhan revolutionary sites.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
