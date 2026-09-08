import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRightLeft,
  Check,
  Copy,
  Flag,
  Languages,
  Loader2,
  Mic,
  RefreshCw,
  ScanText,
  Send,
  Volume2,
} from 'lucide-react'
import type { Locale } from '../../shared/types'
import { LOCALE_NAMES, t } from '../../shared/i18n'
import { useApp } from '../AppContext'

const TERM_MAP: { match: string[]; en: string; fr?: string; es?: string }[] = [
  {
    match: ['八七会议', 'August 7th'],
    en: 'The August 7th Meeting — a secret emergency session of the CPC Central Committee held in Hankou on 7 August 1927, which set the course toward land revolution and armed struggle.',
  },
  {
    match: ['辛亥革命', 'Xinhai', '1911'],
    en: 'The Xinhai Revolution — named after the sexagenary-calendar year 1911 — the revolution begun in Wuchang that ended two thousand years of imperial rule.',
  },
  {
    match: ['农讲所', 'peasant'],
    en: 'The National Peasant Movement Institute — a 1927 school in Wuchang where Mao Zedong and others trained revolutionary leaders for China’s countryside.',
  },
  {
    match: ['卫生间', 'toilet', 'bathroom'],
    en: 'Restroom — follow the blue signs to the west corridor.',
  },
  {
    match: ['出口', 'exit'],
    en: 'Exit — the south gate is wheelchair-accessible.',
  },
]

export function TranslateScreen() {
  const { locale, go, openHelp, toast } = useApp()
  const [source, setSource] = useState<Locale>('zh')
  const [target, setTarget] = useState<Locale>('en')
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const sourceName = useMemo(() => LOCALE_NAMES[source], [source])
  const targetName = useMemo(() => LOCALE_NAMES[target], [target])

  const translate = () => {
    const text = input.trim()
    if (!text) {
      setStatus('error')
      return
    }
    setStatus('loading')
    setOutput('')
    window.setTimeout(() => {
      const term = TERM_MAP.find((row) => row.match.some((m) => text.toLowerCase().includes(m.toLowerCase())))
      if (term) {
        const result = target === 'zh' ? term.en : term[target]
        setOutput(result ?? term.en)
      } else {
        setOutput(
          `Here is how I would say that for museum staff: “${text.slice(0, 80)}” — this is a demo translation until the reviewed glossary is connected.`,
        )
      }
      setStatus('done')
    }, 760)
  }

  const swap = () => {
    setSource(target)
    setTarget(source)
    setOutput('')
    setStatus('idle')
  }

  useEffect(() => {
    if (copied) {
      const id = window.setTimeout(() => setCopied(false), 1800)
      return () => window.clearTimeout(id)
    }
  }, [copied])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper-warm/90 px-2 py-2 backdrop-blur-md">
        <div className="mx-auto flex max-w-[440px] items-center gap-1">
          <button
            className="icon-btn"
            onClick={() => go('#/home')}
            aria-label={t(locale, 'action.back')}
          >
            <ArrowLeft size={20} />
          </button>
          <span className="flex items-center gap-2 pl-1">
            <span className="grid size-8 place-items-center rounded-[9px] bg-clay text-white">
              <Languages size={16} />
            </span>
            <span>
              <span className="block text-[0.95rem] font-bold leading-none text-ink">
                {t(locale, 'translate.title')}
              </span>
              <span className="mt-0.5 block text-[0.66rem] text-ink-faint">Reviewed by student translators · demo</span>
            </span>
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[440px] flex-1 px-5 pb-10 pt-6">
        {/* Language pair */}
        <div className="flex items-center gap-3 rounded-[16px] border border-line bg-paper px-3 py-3">
          <button
            className="flex min-w-0 flex-1 flex-col items-center rounded-[12px] bg-paper-warm px-2 py-2.5"
            onClick={() => toast(`${sourceName} stays as the source language`)}
          >
            <span className="truncate text-[0.88rem] font-bold text-ink">{sourceName}</span>
            <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-ink-faint">from</span>
          </button>
          <button
            className="icon-btn !size-10 shrink-0 rounded-full bg-clay text-white"
            aria-label={t(locale, 'translate.swap')}
            onClick={swap}
          >
            <ArrowRightLeft size={17} />
          </button>
          <button
            className="flex min-w-0 flex-1 flex-col items-center rounded-[12px] bg-paper-warm px-2 py-2.5"
            onClick={() => toast(`${targetName} receives the translation`)}
          >
            <span className="truncate text-[0.88rem] font-bold text-ink">{targetName}</span>
            <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-ink-faint">to</span>
          </button>
        </div>

        {/* Input */}
        <div className="mt-4">
          <textarea
            className="field min-h-[140px] !rounded-[16px] bg-paper"
            placeholder={t(locale, 'translate.input')}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setStatus('idle')
            }}
            aria-label="Text to translate"
          />
          <div className="mt-2 flex items-center gap-1">
            <button
              className="icon-btn icon-btn-solid !size-10"
              aria-label={t(locale, 'translate.photo')}
              onClick={() => toast('Camera OCR is ready to connect — demo reserves the interface')}
            >
              <ScanText size={18} />
            </button>
            <button
              className="icon-btn icon-btn-solid !size-10"
              aria-label={t(locale, 'translate.voice')}
              onClick={() => toast('Voice input placeholder — speech model connects later')}
            >
              <Mic size={18} />
            </button>
            <button
              className="btn btn-clay ml-auto min-h-[44px]"
              disabled={!input.trim() || status === 'loading'}
              onClick={translate}
            >
              {status === 'loading' ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
              {t(locale, 'translate.button')}
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="mt-5 min-h-[210px] rounded-[18px] border border-line bg-paper p-4">
          <div className="flex items-center gap-2">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
              {t(locale, 'translate.result')}
            </span>
            {status === 'done' ? (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#e5efe6] px-2 py-0.5 text-[0.62rem] font-bold text-[#2f5d3a]">
                <Check size={11} /> Glossed
              </span>
            ) : null}
          </div>

          {status === 'loading' ? (
            <div className="mt-5 grid gap-2.5" role="status" aria-label="Translating">
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-mist/70" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-mist/50" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-mist/40" />
            </div>
          ) : status === 'done' ? (
            <>
              <p className="mt-4 font-display text-[1.12rem] leading-relaxed text-ink">{output}</p>
              <div className="mt-4 flex gap-1 border-t border-line/70 pt-2.5">
                <button
                  className="flex min-h-[38px] items-center gap-1.5 rounded-full px-3 text-[0.76rem] font-semibold text-ink-soft hover:bg-paper-deep"
                  onClick={() => {
                    navigator.clipboard?.writeText(output).catch(() => undefined)
                    setCopied(true)
                  }}
                >
                  {copied ? <Check size={15} className="text-green" /> : <Copy size={15} />}
                  {copied ? 'Copied' : t(locale, 'action.copy')}
                </button>
                <button
                  className="flex min-h-[38px] items-center gap-1.5 rounded-full px-3 text-[0.76rem] font-semibold text-ink-soft hover:bg-paper-deep"
                  onClick={() => toast('Listen demo — recorded human audio connects with the real API')}
                >
                  <Volume2 size={15} /> {t(locale, 'action.listen')}
                </button>
                <button
                  className="flex min-h-[38px] items-center gap-1.5 rounded-full px-3 text-[0.76rem] font-semibold text-ink-soft hover:bg-paper-deep"
                  onClick={() => {
                    setStatus('idle')
                    setInput('')
                  }}
                >
                  <RefreshCw size={15} /> New
                </button>
                <button
                  className="ml-auto flex min-h-[38px] items-center gap-1.5 rounded-full px-2.5 text-[0.7rem] font-semibold text-ink-faint"
                  onClick={() => toast('Thanks — the translation team reviews reports within 24h')}
                >
                  <Flag size={13} /> {t(locale, 'action.report')}
                </button>
              </div>
            </>
          ) : status === 'error' ? (
            <p className="mt-5 text-[0.84rem] font-medium text-clay-deep">
              Type a phrase first — a sign, a question, or a word you want to show museum staff.
            </p>
          ) : (
            <div className="mt-5 text-center text-[0.8rem] leading-relaxed text-ink-faint">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-paper-deep">
                <Languages size={20} strokeWidth={1.7} />
              </span>
              <span className="mt-3 block">
                Try: “八七会议” or “Where is the exit?” — heritage terms carry extra glosses.
              </span>
            </div>
          )}
        </div>

        {/* Help CTA */}
        <button className="mt-4 flex w-full items-center gap-3 rounded-[16px] bg-night px-4 py-4 text-left text-paper-warm" onClick={openHelp}>
          <span className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10">
            <span className="text-[0.85rem] font-bold text-[#e8cf9d]">SOS</span>
          </span>
          <span className="flex-1">
            <span className="block text-[0.96rem] font-bold">{t(locale, 'translate.helpTitle')}</span>
            <span className="block text-[0.74rem] text-white/65">{t(locale, 'translate.help')}</span>
          </span>
          <ArrowRightLeft size={18} className="rotate-90 text-white/70" />
        </button>

        <p className="mt-6 text-center text-[0.66rem] leading-relaxed text-ink-faint">
          Demo translation is illustrative. Heritage terms are human-reviewed before release to
          prevent cultural mistranslation.
        </p>
      </main>
    </div>
  )
}
