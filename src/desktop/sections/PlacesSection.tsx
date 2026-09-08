import { ArrowUpRight, Clock3 } from 'lucide-react'
import { MissionSection } from './HeroSection'
import { featuredPlaces, PLACES } from '../../shared/data/places'

export function PlacesSection() {
  return (
    <>
      <MissionSection />
      <section className="d-section" id="places">
        <div className="d-container">
          <div className="d-section-head d-reveal">
            <div>
              <p className="d-index">Field-mapped places</p>
              <h2 className="d-display d-display--lg mt-4">Read the city’s red chapters</h2>
            </div>
            <p className="max-w-[380px] text-[0.94rem] leading-relaxed text-ink-soft">
              Ten sites across Wuchang and Hankou where modern China was decided — every one surveyed
              by the team before it entered the guide.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {featuredPlaces.slice(0, 4).map((place, i) => (
              <a
                key={place.slug}
                href={`./mobile.html#/place/${place.slug}`}
                target="_blank"
                rel="noreferrer"
                className={`d-place-card d-reveal ${
                  i === 0 ? 'h-[420px] lg:col-span-7' : i === 1 ? 'h-[420px] lg:col-span-5' : 'h-[360px] lg:col-span-6'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="d-place-card__media">
                  <img src={place.image} alt={place.names.en} loading="lazy" />
                </div>
                <div className="d-place-card__body">
                  <div className="flex items-center gap-2 text-[0.72rem] font-semibold text-white/85">
                    <span>{place.region}</span>
                    <span aria-hidden>·</span>
                    <span>{place.distanceKm} km from the route start</span>
                  </div>
                  <h3 className="mt-2 max-w-[80%] font-display text-[1.6rem] font-medium leading-[1.05] tracking-[-0.01em] text-balance">
                    {place.names.en}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-[0.74rem] font-medium text-white/75">
                    <Clock3 size={13} /> {place.openHours.en}
                    <span className="ml-auto inline-flex items-center gap-1 font-bold text-white">
                      Open guide <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="d-reveal mt-4 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLACES.filter((p) => !featuredPlaces.slice(0, 4).includes(p))
              .slice(0, 4)
              .map((place) => (
                <a
                  key={place.slug}
                  href={`./mobile.html#/place/${place.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-[12px] p-2 transition-colors hover:bg-paper-soft"
                >
                  <span className="h-[64px] w-[56px] shrink-0 overflow-hidden rounded-[9px] bg-paper-deep">
                    <img src={place.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-[0.88rem] font-bold leading-snug text-ink group-hover:text-clay-deep">
                      {place.names.en}
                    </span>
                    <span className="mt-1 block text-[0.72rem] text-ink-faint">
                      {place.region} · {place.walkMinutes} min guided
                    </span>
                  </span>
                </a>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
