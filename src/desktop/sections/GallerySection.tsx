import { HERITAGE_SHOTS } from '../../shared/data/heritageGallery'

const SPANS = [
  'lg:col-span-7 h-[440px]',
  'lg:col-span-5 h-[440px]',
  'lg:col-span-4 h-[330px]',
  'lg:col-span-4 h-[330px]',
  'lg:col-span-4 h-[330px]',
  'lg:col-span-5 h-[380px]',
  'lg:col-span-4 h-[380px]',
  'lg:col-span-3 h-[380px]',
]

export function GallerySection() {
  return (
    <section className="d-section bg-paper-warm" id="frames">
      <div className="d-container">
        <div className="d-section-head d-reveal">
          <div>
            <p className="d-index">Through the lens · 镜头里的文脉</p>
            <h2 className="d-display d-display--lg mt-4">
              Red stories, seen in stone and light
            </h2>
          </div>
          <p className="max-w-[420px] text-[0.95rem] leading-relaxed text-ink-soft">
            Eight photographs from Wuhan’s revolutionary landscape — gates, memorials, halls and
            statues that carry the same history the guide translates.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          {HERITAGE_SHOTS.map((shot, i) => (
            <figure
              key={shot.image}
              className={`d-photo-card d-reveal ${SPANS[i] ?? 'lg:col-span-4 h-[300px]'}`}
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <img src={shot.image} alt={shot.title.en} loading="lazy" />
              <figcaption className="d-photo-card__body">
                <p className="font-display text-[1.18rem] font-medium leading-tight text-balance">
                  {shot.title.en}
                </p>
                <p className="mt-1 text-[0.78rem] font-semibold text-[#efd5ae]">{shot.title.zh}</p>
                <p className="mt-1.5 max-w-[440px] text-[0.78rem] leading-snug text-white/78">
                  {shot.note.en}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="d-reveal mt-5 text-[0.72rem] text-ink-faint">
          Photography: Wikimedia Commons contributors · licence and author credits listed in
          PHOTO_CREDITS.md
        </p>
      </div>
    </section>
  )
}
