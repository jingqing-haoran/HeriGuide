/**
 * Headless-Chrome page QA for the HeriGuide demo.
 * Reports runtime errors, network failures, horizontal overflow and font readiness.
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.argv[2] ?? 'http://127.0.0.1:4173'
const ONLY = process.argv[3] ?? ''
const ROUTES = [
  ['desktop', '/index.html'],
  ['mobile-home', '/mobile.html'],
  ['mobile-explore', '/mobile.html#/explore'],
  ['mobile-map', '/mobile.html#/map'],
  ['mobile-community', '/mobile.html#/community'],
  ['mobile-profile', '/mobile.html#/profile'],
  ['mobile-place', '/mobile.html#/place/xinhai-museum'],
  ['mobile-translate', '/mobile.html#/translate'],
  ['mobile-language', '/mobile.html#/language'],
].filter(([name]) => !ONLY || name.includes(ONLY))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const profileDir = mkdtempSync(join(tmpdir(), 'heri-qa-'))
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--remote-debugging-port=9333',
      '--no-first-run',
      '--disable-extensions',
      '--user-data-dir=' + profileDir,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )

  let stderr = ''
  chrome.stderr.on('data', (d) => (stderr += d.toString()))
  try {
    const port = await waitForPort()
    const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, {
      method: 'PUT',
    }).then((r) => r.json())

    const ws = new WebSocket(target.webSocketDebuggerUrl)
    await new Promise((resolve, reject) => {
      ws.onopen = resolve
      ws.onerror = reject
    })

    let id = 0
    const pending = new Map()
    const events = new Map()
    const problems = []

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg)
        pending.delete(msg.id)
        return
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        problems.push({
          kind: 'exception',
          text: msg.params.exceptionDetails?.exception?.description ?? msg.params.exceptionDetails?.text,
        })
      }
      if (msg.method === 'Log.entryAdded' && msg.params.entry?.level === 'error') {
        problems.push({ kind: 'console', text: msg.params.entry.text })
      }
      if (msg.method === 'Network.loadingFailed') {
        problems.push({ kind: 'network', text: `${msg.params.errorText} ${msg.params.requestId}` })
      }
      const waiters = events.get(msg.method)
      if (waiters?.length) {
        waiters.splice(0).forEach((fn) => fn(msg.params))
      }
    }

    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const mid = ++id
        pending.set(mid, resolve)
        ws.send(JSON.stringify({ id: mid, method, params }))
      })

    const once = (method, timeout = 8000) =>
      new Promise((resolve) => {
        const list = events.get(method) ?? []
        const timer = setTimeout(() => resolve(null), timeout)
        list.push((params) => {
          clearTimeout(timer)
          resolve(params)
        })
        events.set(method, list)
      })

    await send('Page.enable')
    await send('Runtime.enable')
    await send('Log.enable')
    await send('Network.enable')

    for (const [name, path] of ROUTES) {
      problems.length = 0
      const desktop = name === 'desktop'
      await send('Emulation.setDeviceMetricsOverride', {
        width: desktop ? 1440 : 390,
        height: desktop ? 900 : 844,
        deviceScaleFactor: 1,
        mobile: !desktop,
      })
      const navDone = once('Page.loadEventFired')
      await send('Page.navigate', { url: BASE + path })
      await navDone
      await sleep(1600)
      const result = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const de = document.documentElement
          const body = document.body
          const fonts = ['Instrument Sans Variable', 'Newsreader Variable', 'Noto Sans SC']
          return {
            title: document.title,
            hash: location.hash,
            viewport: de.clientWidth,
            scrollWidth: Math.max(de.scrollWidth, body.scrollWidth),
            overflowX: Math.max(de.scrollWidth, body.scrollWidth) > de.clientWidth + 1,
            rootChildren: document.querySelector('#root,#mobile-root')?.children.length ?? 0,
            fonts: Object.fromEntries(fonts.map((f) => [f, document.fonts.check('16px "' + f + '"')])),
            hasBottomNav: !!document.querySelector('.tabbar'),
            brokenImages: [...document.images]
              .filter((img) => img.complete && img.naturalWidth === 0)
              .slice(0, 12)
              .map((img) => img.getAttribute('src')),
            totalImages: document.images.length,
            containers: [...document.querySelectorAll('.no-scrollbar')].map((el) => {
              const r = el.getBoundingClientRect()
              const cs = getComputedStyle(el)
              return {
                cls: String(el.className || '').slice(0, 110),
                left: Math.round(r.left),
                right: Math.round(r.right),
                width: Math.round(r.width),
                scrollW: el.scrollWidth,
                overflowX: cs.overflowX,
              }
            }),
            offenders: [...document.querySelectorAll('body *')]
              .map((el) => {
                const r = el.getBoundingClientRect()
                const cs = getComputedStyle(el)
                return {
                  el: el.tagName.toLowerCase(),
                  cls: String(el.className || '').slice(0, 90),
                  left: Math.round(r.left),
                  right: Math.round(r.right),
                  overflowX: cs.overflowX,
                  text: (el.textContent || '').trim().slice(0, 36),
                }
              })
              .filter((item) => item.right > window.innerWidth + 1 || item.left < -1)
              .slice(0, 14),
          }
        })()`,
      })
      const value = result.result?.result?.value
      console.log(JSON.stringify({ name, ...value, problems }, null, 0))
    }

    ws.close()
  } finally {
    chrome.kill()
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 2000)
      chrome.once('exit', () => {
        clearTimeout(timer)
        resolve()
      })
    })
    await sleep(400)
    try {
      rmSync(profileDir, { recursive: true, force: true })
    } catch {
      /* profile cleanup is best-effort on Windows */
    }
  }
}

function waitForPort() {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const poll = async () => {
      try {
        const res = await fetch('http://127.0.0.1:9333/json/version')
        if (res.ok) return resolve(9333)
      } catch {
        /* not ready */
      }
      if (Date.now() - started > 15000) return reject(new Error('Chrome DevTools did not start'))
      setTimeout(poll, 150)
    }
    poll()
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
