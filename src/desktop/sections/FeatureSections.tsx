import {
  ArrowRight,
  Compass,
  Headphones,
  Languages,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  Send,
  Volume2,
} from 'lucide-react'

export function FeatureSections() {
  return (
    <section className="d-section bg-paper-warm" id="guide">
      <div className="d-container">
        <div className="d-section-head d-reveal">
          <div>
            <p className="d-index">The guide</p>
            <h2 className="d-display d-display--lg mt-4">Four ways into one story</h2>
          </div>
          <p className="max-w-[420px] text-[0.95rem] leading-relaxed text-ink-soft">
            A visitor moves between translation, space, voice and people — each feature designed
            around one question asked inside a real museum.
          </p>
        </div>

        {/* 1 — Translation ------------------------------------------------------ */}
        <div className="grid items-center gap-10 border-t border-line py-14 lg:grid-cols-2 lg:gap-20">
          <div className="d-reveal">
            <span className="grid size-12 place-items-center rounded-[14px] bg-clay text-white">
              <Languages size={22} />
            </span>
            <h3 className="mt-6 font-display text-[2rem] font-medium leading-tight text-ink">
              Translation that explains, not only converts
            </h3>
            <p className="mt-5 max-w-[560px] text-[0.98rem] leading-[1.75] text-ink-soft">
              Sign text, panel labels, conversations with staff — plus a glossary for terms that
              carry history. “八七会议” becomes more than a proper noun: it becomes a dated,
              explained event.
            </p>
            <a href="./mobile.html#/translate" target="_blank" rel="noreferrer" className="btn btn-dark mt-7">
              Try the translator <ArrowRight size={17} />
            </a>
          </div>
          <DemoTranslator />
        </div>

        {/* 2 — Map -------------------------------------------------------------- */}
        <div className="grid items-center gap-10 border-t border-line py-14 lg:grid-cols-2 lg:gap-20">
          <DemoMap />
          <div className="d-reveal order-first lg:order-none">
            <span className="grid size-12 place-items-center rounded-[14px] bg-night text-white">
              <Compass size={22} />
            </span>
            <h3 className="mt-6 font-display text-[2rem] font-medium leading-tight text-ink">
              Rooms, routes and services — mapped for real
            </h3>
            <p className="mt-5 max-w-[560px] text-[0.98rem] leading-[1.75] text-ink-soft">
              Generic map apps stop at the gate. HeriGuide maps the inside: exhibition halls,
              restrooms, AEDs, exits and the exact route between them — drawn from site surveys,
              offered in each visitor’s language.
            </p>
            <ul className="mt-6 grid gap-2.5">
              {[
                'Current position inside the venue',
                'Room-by-room route with walking time',
                'Facilities and accessible paths',
                'Works offline after first load',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5 text-[0.9rem] font-medium text-ink-soft">
                  <MapPin size={14} className="text-clay" /> {line}
                </li>
              ))}
            </ul>
            <a href="./mobile.html#/map" target="_blank" rel="noreferrer" className="btn btn-clay mt-7">
              Open the live map <ArrowRight size={17} />
            </a>
          </div>
        </div>

        {/* 3 — Audio -------------------------------------------------------------- */}
        <div className="grid items-center gap-10 border-t border-line py-14 lg:grid-cols-2 lg:gap-20">
          <div className="d-reveal">
            <span className="grid size-12 place-items-center rounded-[14px] bg-gold text-[#fff7e8]">
              <Headphones size={22} />
            </span>
            <h3 className="mt-6 font-display text-[2rem] font-medium leading-tight text-ink">
              Story-led audio, reviewed before it ships
            </h3>
            <p className="mt-5 max-w-[560px] text-[0.98rem] leading-[1.75] text-ink-soft">
              Commentary is written as narrative — not flat facts — then human-translated by
              students and verified by faculty, because revolutionary history deserves more care
              than machine output can promise.
            </p>
            <a href="./mobile.html#/place/xinhai-museum" target="_blank" rel="noreferrer" className="btn btn-dark mt-7">
              Listen to a sample <ArrowRight size={17} />
            </a>
          </div>
          <div className="d-reveal">
            <AudioDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

function DemoTranslator() {
  return (
    <div className="d-card d-reveal overflow-hidden p-5 shadow-[var(--shadow-2)]">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
          Translator · demo
        </p>
        <span className="rounded-full bg-paper-deep px-2.5 py-1 text-[0.66rem] font-bold text-ink-faint">
          中文 → English
        </span>
      </div>
      <div className="mt-5 grid gap-3">
        <div className="rounded-[12px] bg-paper-deep/70 p-4">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-ink-faint">Source</p>
          <p className="mt-2 font-display text-[1.1rem] leading-snug text-ink">
            八七会议在这里秘密召开，确定了土地革命和武装斗争的总方针。
          </p>
        </div>
        <div className="flex justify-center text-clay">
          <ArrowRight size={18} />
        </div>
        <div className="rounded-[12px] border border-clay/20 bg-clay-wash/70 p-4">
          <div className="flex items-center gap-2">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-clay">Translated · glossed</p>
            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[0.62rem] font-bold text-clay-deep">
              context included
            </span>
          </div>
          <p className="mt-2 text-[1rem] leading-relaxed text-ink">
            The <b>August 7th Meeting</b> was held here in secret, setting the general line of land
            revolution and armed struggle.
          </p>
          <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
            August 7th, 1927 — an emergency Central Committee meeting in Hankou after the 1927
            setback of the revolution.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="text-[0.72rem] text-ink-faint">Sign, photo and voice input included</span>
        <span className="btn btn-clay btn-sm pointer-events-none">
          <Send size={14} /> Translate
        </span>
      </div>
    </div>
  )
}

function DemoMap() {
  return (
    <div className="d-reveal overflow-hidden rounded-[18px] border border-line bg-[#e9e3d6] shadow-[var(--shadow-2)]">
      <div className="relative">
        <svg viewBox="0 0 560 330" className="block w-full" role="img" aria-label="Indoor map preview">
          <path d="M0 24 H560 M0 96 H560 M0 176 H560 M0 264 H560 M140 0 V330 M300 0 V330 M440 0 V330" stroke="#d5ccb9" fill="none" />
          <rect x="24" y="34" width="90" height="44" rx="4" fill="#e0d8c6" />
          <rect x="164" y="116" width="112" height="40" rx="4" fill="#e4dcca" />
          <rect x="330" y="200" width="92" height="46" rx="4" fill="#e0d8c6" />
          <rect x="462" y="40" width="80" height="40" rx="4" fill="#dbe3d3" />
          <path d="M0 0 C 190 26, 330 -12, 560 30" stroke="#c9d5cd" strokeWidth="18" fill="none" opacity=".9" />
          <g transform="translate(84 120)">
            <circle r="15" fill="#211c15" opacity=".08" />
            <circle r="8" fill="#fff" stroke="#211c15" strokeWidth="2.2" />
            <circle r="3" fill="#211c15" />
          </g>
          <g transform="translate(244 136)">
            <circle r="20" fill="#a92e1f" opacity=".12" />
            <circle r="9" fill="#a92e1f" stroke="#f7f1e6" strokeWidth="2.5" />
          </g>
          <g transform="translate(370 76)">
            <circle r="8" fill="#fff" stroke="#6f7a68" strokeWidth="1.6" />
          </g>
          <g transform="translate(498 150)">
            <circle r="8" fill="#fff" stroke="#6f7a68" strokeWidth="1.6" />
          </g>
          <path d="M84 120 C 150 122, 200 132, 244 136" stroke="#a92e1f" strokeWidth="2.4" fill="none" strokeDasharray="3 7" strokeLinecap="round" />
          <text x="96" y="150" fill="#211c15" fontSize="11" fontWeight="700">You are here</text>
          <text x="214" y="112" fill="#a92e1f" fontSize="11" fontWeight="700">Main hall</text>
          <text x="396" y="66" fill="#57503f" fontSize="10">AED</text>
          <text x="522" y="140" fill="#57503f" fontSize="10">Exit</text>
        </svg>
        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1.5 text-[0.72rem] font-semibold text-ink backdrop-blur">
          August 7th Meeting Memorial · Level 1
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line bg-paper-warm px-5 py-4">
        <div>
          <p className="text-[0.9rem] font-bold text-ink">Main hall · 12 m ahead</p>
          <p className="text-[0.74rem] text-ink-faint">Route preview from the entrance</p>
        </div>
        <span className="btn btn-dark btn-sm pointer-events-none">
          Navigate <ArrowRight size={14} />
        </span>
      </div>
    </div>
  )
}

function AudioDemo() {
  return (
    <div className="relative overflow-hidden rounded-[18px] bg-night p-6 text-paper-warm shadow-[var(--shadow-2)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(400px 220px at 90% -10%, rgba(201,84,58,.6), transparent 62%), radial-gradient(300px 200px at -5% 110%, rgba(164,117,47,.4), transparent 60%)',
        }}
      />
      <div className="relative flex items-center gap-4">
        <button className="grid size-16 shrink-0 place-items-center rounded-full bg-clay text-white transition-transform active:scale-95">
          <Play size={24} className="translate-x-0.5" />
        </button>
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#efd5ae]">
            Guided audio · English
          </p>
          <p className="mt-1 font-display text-[1.4rem] font-medium leading-tight">
            The meeting above the street
          </p>
        </div>
      </div>
      <div className="relative mt-6 flex h-12 items-center gap-[3px]">
        {Array.from({ length: 42 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-white/16"
            style={{ height: `${8 + ((i * 29) % 34)}px` }}
          />
        ))}
      </div>
      <div className="relative mt-2 flex items-center justify-between text-[0.68rem] font-medium text-white/45">
        <span>02:14</span>
        <span>09:30</span>
      </div>
      <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-white/12 pt-4">
        {['English', 'Français', 'Español', '中文', 'Deutsch (soon)'].map((lang) => (
          <span
            key={lang}
            className={`rounded-full px-3 py-1 text-[0.7rem] font-bold ${
              lang === 'English' ? 'bg-clay text-white' : 'bg-white/8 text-white/70'
            }`}
          >
            {lang}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1 text-[0.7rem] text-white/50">
          <Volume2 size={13} /> 4 languages
        </span>
      </div>
    </div>
  )
}
