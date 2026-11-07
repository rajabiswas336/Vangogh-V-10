import { useEffect, useRef, useState } from 'react'

// First-visit intro: a murmuration of starlings gathers into the word
// "VANGOGH", then scatters while the official white logo appears.
// - Runs once per browser session.
// - Skipped entirely for visitors who prefer reduced motion.
// - "Skip intro" button, or click anywhere, ends it at once.
// - Logo shown unchanged (public/logo/web/vangogh-logo-white-tight.png).

const WORD = 'VANGOGH'
const INK = '#E6EDFA'
const FONT = '900 100px "Arial Black", "Helvetica Neue", Arial, sans-serif'
const KEY = 'vg-intro-seen'
// Review phase: show on every page load so the owner can see it.
// Before launch, set to true so visitors see it once per session.
const ONCE_PER_SESSION = false

// Timeline in seconds
const T_FLY = 1.2
const T_FORM = 1.8
const T_HOLD = 1.3
const T_SCATTER = 1.4
const T_LOGO = 1.6
const T_OUT = 0.7

function rng(seed) {
  let a = seed >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function curl(x, y, t) {
  const a = 1.7 * x + t, b = 1.3 * y - 0.6 * t, c = 2.9 * y + 1.1 * x - 0.8 * t, d = 4.3 * x - 3.7 * y + 1.3 * t
  const dpdx = 1.7 * Math.cos(a) * Math.cos(b) + 0.66 * Math.cos(c) - 1.505 * Math.sin(d)
  const dpdy = -1.3 * Math.sin(a) * Math.sin(b) + 1.74 * Math.cos(c) + 1.295 * Math.sin(d)
  return [dpdy, -dpdx]
}
const ease = (k) => { const x = k < 0 ? 0 : k > 1 ? 1 : k; return x * x * (3 - 2 * x) }

function shouldShow() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (ONCE_PER_SESSION) {
    try { if (sessionStorage.getItem(KEY)) return false } catch { /* storage blocked: still show */ }
  }
  return true
}

export default function IntroMurmuration() {
  const [show, setShow] = useState(shouldShow)
  const [phase, setPhase] = useState('birds') // birds | logo | out
  const canvasRef = useRef(null)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ }
    setPhase('out')
    setTimeout(() => setShow(false), T_OUT * 1000)
  }

  useEffect(() => {
    if (!show) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = prev }
  }, [show])

  useEffect(() => {
    if (!show) return
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    const rand = rng(11)
    let w = 1, h = 1, dpr = 1, n = 0, raf = 0, clock = 0, last = performance.now()
    const start = performance.now()
    let px, py, vx, vy, depth, phase0, target
    let tx = new Float32Array(0), ty = new Float32Array(0)

    const layout = () => {
      w = Math.max(1, window.innerWidth)
      h = Math.max(1, window.innerHeight)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      const m = document.createElement('canvas')
      m.width = w; m.height = h
      const mc = m.getContext('2d', { willReadFrequently: true })
      const xs = [], ys = []
      if (mc) {
        mc.font = FONT
        const ww = mc.measureText(WORD).width || 1
        const size = Math.min((w * 0.8) / ww * 100, (h * 0.3) / 0.72)
        mc.font = FONT.replace('100px', size + 'px')
        mc.textAlign = 'center'; mc.textBaseline = 'middle'
        mc.fillText(WORD, w / 2, h * 0.47)
        const img = mc.getImageData(0, 0, w, h).data
        const step = Math.max(2, Math.round(Math.sqrt((w * h) / 70000)))
        for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
          if (img[(y * w + x) * 4 + 3] > 128) { xs.push(x + (rand() - 0.5) * step); ys.push(y + (rand() - 0.5) * step) }
        }
      }
      tx = new Float32Array(xs); ty = new Float32Array(ys)
      const want = Math.max(700, Math.round(3000 * Math.min(1, (w * h) / (1440 * 860))))
      if (want !== n) {
        n = want
        px = new Float32Array(n); py = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n)
        depth = new Float32Array(n); phase0 = new Float32Array(n); target = new Int32Array(n)
        for (let i = 0; i < n; i++) {
          const a = rand() * Math.PI * 2, r = Math.sqrt(rand())
          px[i] = w * 0.5 + Math.cos(a) * r * w * 0.3
          py[i] = h * 0.45 + Math.sin(a) * r * h * 0.22
          depth[i] = 0.55 + rand() * 0.45
          phase0[i] = rand() * 6.28
        }
      }
      const pts = tx.length
      if (pts > 0) {
        const order = new Int32Array(pts)
        for (let i = 0; i < pts; i++) order[i] = i
        const r2 = rng(23)
        for (let i = pts - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t }
        for (let i = 0; i < n; i++) target[i] = order[i % pts]
      } else target.fill(-1)
    }

    const draw = (pull, alpha) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, el.width, el.height)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath()
        for (let i = 0; i < n; i++) {
          if ((pass === 1) !== (depth[i] > 0.78)) continue
          const s = (1.6 + depth[i] * 2.2) * (1 - 0.35 * pull)
          const sp = Math.hypot(vx[i], vy[i]) + 0.001
          const dx = vx[i] / sp, dy = vy[i] / sp
          const flap = 0.55 + 0.45 * Math.sin(phase0[i])
          const wx = -dx * s, wy = -dy * s, nx = -dy * s * flap, ny = dx * s * flap
          ctx.moveTo(px[i] + wx + nx, py[i] + wy + ny)
          ctx.lineTo(px[i], py[i])
          ctx.lineTo(px[i] + wx - nx, py[i] + wy - ny)
        }
        ctx.strokeStyle = INK
        ctx.globalAlpha = (pass === 0 ? 0.5 : 0.92) * alpha
        ctx.lineWidth = pass === 0 ? 0.9 : 1.25
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    let logoShown = false
    const tFormEnd = T_FLY + T_FORM
    const tHoldEnd = tFormEnd + T_HOLD
    const tScatterEnd = tHoldEnd + T_SCATTER
    const tEnd = tHoldEnd + T_LOGO + 0.6

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // Timeline follows real time, so a slow device never stretches the intro.
      clock = (now - start) / 1000
      let pull = 0
      if (clock > T_FLY && clock <= tFormEnd) pull = ease((clock - T_FLY) / T_FORM)
      else if (clock > tFormEnd && clock <= tHoldEnd) pull = 1
      const scattering = clock > tHoldEnd
      const alpha = scattering ? 1 - ease((clock - tHoldEnd) / T_SCATTER) : 1
      if (scattering && !logoShown) { logoShown = true; setPhase('logo') }
      if (clock > tEnd) { finish(); cancelAnimationFrame(raf); return }

      const u = Math.min(w, h)
      const cxp = w / 2 + 0.12 * Math.sin(clock * 0.6) * w
      const cyp = h * 0.45 + 0.05 * Math.sin(clock * 0.8 + 1) * h
      const t = clock * 0.5
      for (let i = 0; i < n; i++) {
        const x = px[i], y = py[i]
        let ax = 0, ay = 0
        const free = 1 - pull
        const cv = curl(((x - w / 2) / u) * 2.2 + depth[i] * 0.25, ((y - h / 2) / u) * 2.2, t)
        ax += cv[0] * 420 * free; ay += cv[1] * 420 * free
        if (!scattering) {
          const dxC = cxp - x, dyC = (cyp - y) * 1.6
          const dC = Math.hypot(dxC, dyC) / u
          const hold = dC < 0.14 ? 0.15 : 0.15 + (dC - 0.14) * 6
          ax += dxC * hold * 2.2 * free; ay += dyC * hold * 1.6 * free
        } else {
          // Scatter outward from the centre.
          const ox = x - w / 2, oy = y - h * 0.47, d = Math.hypot(ox, oy) + 1
          ax += (ox / d) * 900; ay += (oy / d) * 900
        }
        const ti = target[i]
        if (pull > 0 && ti >= 0) {
          ax += (tx[ti] - x) * 9 * pull - vx[i] * 3.2 * pull
          ay += (ty[ti] - y) * 9 * pull - vy[i] * 3.2 * pull
        }
        let nvx = (vx[i] + ax * dt) * (1 - 1.1 * dt), nvy = (vy[i] + ay * dt) * (1 - 1.1 * dt)
        const sp = Math.hypot(nvx, nvy), cap = 520 + 380 * pull + (scattering ? 400 : 0)
        if (sp > cap) { nvx = nvx / sp * cap; nvy = nvy / sp * cap }
        vx[i] = nvx; vy[i] = nvy
        px[i] = x + nvx * dt; py[i] = y + nvy * dt
        phase0[i] += dt * (9 + sp * 0.02)
      }
      if (clock < tScatterEnd) draw(pull, alpha)
      else { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, el.width, el.height) }
    }

    layout()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', layout)
    // Safety net: if the browser pauses animation (hidden tab, low power), never block the site.
    const safety = setTimeout(() => { setPhase('logo'); setTimeout(finish, 1200) }, (tEnd + 0.5) * 1000)
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); window.removeEventListener('resize', layout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  if (!show) return null

  return (
    <div className={`vg-intro vg-intro--${phase}`} onClick={finish}>
      <style>{CSS}</style>
      <canvas ref={canvasRef} className="vg-intro__sky" aria-hidden="true" />
      <img className="vg-intro__logo" src="/logo/web/vangogh-logo-white-tight.png" alt="Vangogh Productions" width="426" height="480" />
      <button type="button" className="vg-intro__skip" onClick={(e) => { e.stopPropagation(); finish() }}>
        Skip intro
      </button>
    </div>
  )
}

const CSS = `
.vg-intro { position: fixed; inset: 0; z-index: 1000; background: radial-gradient(ellipse at 50% 45%, #14204a 0%, #0A0F1E 55%, #05080F 100%); opacity: 1; transition: opacity ${T_OUT}s ease; cursor: pointer; }
.vg-intro--out { opacity: 0; pointer-events: none; }
.vg-intro__sky { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.vg-intro__logo { position: absolute; left: 50%; top: 47%; height: min(34vh, 300px); width: auto; transform: translate(-50%, -50%) scale(.94); opacity: 0; transition: opacity .9s ease, transform 1.4s cubic-bezier(.2,.8,.2,1); pointer-events: none; }
.vg-intro--logo .vg-intro__logo, .vg-intro--out .vg-intro__logo { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.vg-intro__skip { position: absolute; right: 24px; bottom: 24px; min-height: 44px; padding: 0 18px; border: 1px solid rgba(230,237,250,.4); border-radius: 999px; background: rgba(10,15,30,.5); color: #E6EDFA; font: 600 13px/1 system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; }
.vg-intro__skip:hover { background: rgba(230,237,250,.12); }
.vg-intro__skip:focus-visible { outline: 3px solid #76A8FF; outline-offset: 3px; }
`
