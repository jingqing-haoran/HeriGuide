import { useEffect, useState } from 'react'
import { ArrowUpRight, Globe2, Languages, Smartphone } from 'lucide-react'
import { useReveal } from '../shared/useReveal'
import { HeroSection } from './sections/HeroSection'
import { PlacesSection } from './sections/PlacesSection'
import { FeatureSections } from './sections/FeatureSections'
import { CultureCommunitySection } from './sections/CultureCommunitySection'
import { JourneySection } from './sections/JourneySection'

const NAV = [
  { href: '#places', label: 'Places' },
  { href: '#guide', label: 'The guide' },
  { href: '#culture', label: 'Culture' },
  { href: '#community', label: 'Community' },
  { href: '#journey', label: 'Journey' },
]

export function DesktopApp() {
  const [solid, setSolid] = useState(false)
  const mainRef = useReveal<HTMLDivElement>()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <nav className={`d-nav ${solid ? 'd-nav--solid' : ''}`}>
        <div className="d-container d-nav__inner">
          <a href="#top" className="d-brand" aria-label="HeriGuide home">
            <span className="d-brand__mark">H</span>
            <span>
              <span className="block text-[1.02rem] font-bold leading-none tracking-[-0.01em] text-ink">
                HeriGuide
              </span>
              <span className="mt-1 block text-[0.66rem] font-medium text-ink-faint">
                文脉向导 · Discover China’s Stories
              </span>
            </span>
          </a>
          <div className="d-nav__links">
            {NAV.map((item) => (
              <a key={item.href} className="d-nav__link" href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              className="btn btn-sm btn-ghost"
              href="./mobile.html#/language"
              target="_blank"
              rel="noreferrer"
              aria-label="Open language settings"
            >
              <Globe2 size={15} /> EN <span className="text-ink-faint">中文</span>
            </a>
            <a className="btn btn-clay btn-sm" href="./mobile.html">
              <Smartphone size={15} /> Open the H5 guide
            </a>
          </div>
        </div>
      </nav>

      <main id="top" ref={mainRef}>
        <HeroSection />
        <PlacesSection />
        <FeatureSections />
        <CultureCommunitySection />
        <JourneySection />

        {/* Final CTA */}
        <section className="d-section" id="mobile">
          <div className="d-container">
            <div className="relative overflow-hidden rounded-[22px] bg-night px-8 py-14 text-center text-paper-warm md:px-16 md:py-20">
              <div
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{
                  background:
                    'radial-gradient(700px 320px at 82% -16%, rgba(201,84,58,.55), transparent 62%), radial-gradient(460px 260px at 6% 120%, rgba(164,117,47,.35), transparent 60%)',
                }}
              />
              <div className="relative mx-auto max-w-[760px]">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[#e8cf9d]">
                  Scan at the gate · no download
                </p>
                <h2 className="d-display d-display--md mt-5">
                  The whole story, in the visitor’s own language.
                </h2>
                <p className="d-lead mx-auto mt-5 max-w-[560px] text-paper-warm/72">
                  HeriGuide stays a public-interest project: free guides, reviewed translation and
                  open routes across Wuhan’s revolutionary heritage.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a href="./mobile.html" className="btn btn-clay btn-lg">
                    Explore on mobile <ArrowUpRight size={18} />
                  </a>
                  <a href="#places" className="btn btn-light btn-lg">
                    Browse the places
                  </a>
                </div>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[0.75rem] font-semibold text-white/55">
                  <span className="inline-flex items-center gap-2">
                    <Languages size={14} /> 中文 · English · Français · Español
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Smartphone size={14} /> H5 · WeChat · browser
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Globe2 size={14} /> Free and non-profit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-line bg-paper-warm">
          <div className="d-container flex flex-col gap-6 py-9 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-[10px] bg-clay text-lg font-semibold text-white">
                H
              </span>
              <div>
                <p className="text-[0.92rem] font-bold text-ink">HeriGuide 文脉向导</p>
                <p className="text-[0.72rem] text-ink-faint">
                  公益项目 · 华中师范大学 · Demo frontend
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] font-medium text-ink-soft">
              <a className="hover:text-clay" href="#top">Privacy</a>
              <a className="hover:text-clay" href="#community">Feedback</a>
              <a className="hover:text-clay" href="#mobile">Volunteer</a>
              <span className="text-ink-faint">Photos: Wikimedia Commons contributors</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
