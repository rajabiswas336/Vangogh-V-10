import { useEffect, useRef } from 'react'

// A living night sky in the spirit of Van Gogh's "The Starry Night" (1889,
// public domain), painted fresh in code, not copied: brushstroke particles ride
// a field of swirling vortices and leave painterly trails, large stars glow
// inside rotating halo rings, a crescent moon burns in the corner, and small
// stars twinkle in three depths. Scroll and pointer move the layers at
// different speeds for a 3D feel.
// - prefers-reduced-motion: one still, fully painted frame.
// - Pauses in hidden tabs; fewer strokes on small screens.
// - Performance: drawn at 1x pixel density and capped at 30 fps. Every glass
//   (backdrop-filter) panel re-blurs this canvas whenever it changes, so a
//   calmer redraw rate keeps scrolling smooth.

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

const STROKE_COLORS = [
  [24, 52, 140], [36, 78, 178], [52, 104, 206], [86, 140, 226],
  [143, 178, 255], [190, 212, 255], [236, 222, 150], [246, 236, 190],
]

export default function StarryNight() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = rng(1889)

    let w = 1, h = 1, dpr = 1, raf = 0, last = performance.now(), t = 0
    const FRAME_MS = 1000 / 30
    let strokes = [], tiny = [], bigStars = [], vortices = []
    let px = 0, py = 0, tx = 0, ty = 0, scrollShift = 0
    // Brushstrokes live on their own layer so only they leave trails;
    // stars and the moon are redrawn crisply every frame.
    const trail = document.createElement('canvas')
    const tctx = trail.getContext('2d')

    const layout = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      trail.width = canvas.width
      trail.height = canvas.height
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const small = w < 700
      const u = Math.min(w, h)

      // Two large swirls and a smaller one, like wind turning in the sky.
      vortices = [
        { x: 0.42, y: 0.34, r: u * 0.42, s: 1.0 },
        { x: 0.72, y: 0.22, r: u * 0.26, s: -0.8 },
        { x: 0.16, y: 0.62, r: u * 0.22, s: 0.7 },
      ]

      const n = small ? 170 : Math.min(380, Math.round((w * h) / 4200))
      strokes = Array.from({ length: n }, () => newStroke())
      tiny = Array.from({ length: Math.round((w * h) / (small ? 6000 : 4200)) }, () => ({
        x: rand() * w, y: rand() * h * 1.5, r: 0.4 + rand() * 1.1,
        depth: rand() < 0.6 ? 0.3 : rand() < 0.8 ? 0.6 : 1, tw: 0.8 + rand() * 2.4, ph: rand() * 6.3,
      }))
      const bigCount = small ? 4 : 7
      bigStars = Array.from({ length: bigCount }, (_, i) => {
        let x = (0.06 + (i / bigCount) * 0.88 + (rand() - 0.5) * 0.05) * w
        // keep the headline area calm: stars there move up into the top band
        let y = (0.06 + rand() * 0.5) * h
        if (x < w * 0.72 && y > h * 0.14) y = h * (0.05 + rand() * 0.07)
        return {
        x, y,
        r: (small ? 4 : 5) + rand() * (small ? 3 : 5),
        depth: 0.5 + rand() * 0.5,
        spin: (rand() < 0.5 ? -1 : 1) * (0.15 + rand() * 0.25),
        ph: rand() * 6.3,
      }})

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintSky(1)
      if (reduced) {
        for (let i = 0; i < 160; i++) step(1 / 30, true)
        compose()
      }
    }

    const newStroke = () => {
      const c = STROKE_COLORS[Math.floor(Math.pow(rand(), 1.4) * STROKE_COLORS.length)]
      return {
        x: rand() * w, y: rand() * h, life: rand() * 200, max: 140 + rand() * 180,
        width: 1.2 + rand() * 2.6, c, depth: 0.5 + rand() * 0.5,
      }
    }

    // Flow direction at a point: rotation around each vortex plus a slow
    // rolling wind across the sky. Returns [vx, vy].
    const field = (x, y) => {
      let vx = 26 + Math.sin(y / h * 7 + t * 0.2) * 18
      let vy = Math.sin(x / w * 6 + t * 0.15) * 14
      for (const v of vortices) {
        const cx = v.x * w + px * 30, cy = v.y * h - scrollShift * 0.25 + py * 20
        const dx = x - cx, dy = y - cy
        const d = Math.hypot(dx, dy) + 1
        const k = Math.exp(-(d * d) / (2 * v.r * v.r)) * 120 * v.s
        vx += (-dy / d) * k
        vy += (dx / d) * k
      }
      return [vx, vy]
    }

    const paintSky = (alpha) => {
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, `rgba(10,20,64,${alpha})`)
      g.addColorStop(0.55, `rgba(9,15,46,${alpha})`)
      g.addColorStop(1, `rgba(6,9,26,${alpha})`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    const step = (dt) => {
      // fade old strokes a little, then paint the new ones
      tctx.globalCompositeOperation = 'destination-out'
      tctx.fillStyle = 'rgba(0,0,0,.07)'
      tctx.fillRect(0, 0, w, h)
      tctx.globalCompositeOperation = 'source-over'
      tctx.lineCap = 'round'
      for (const s of strokes) {
        const [vx, vy] = field(s.x, s.y)
        const sp = Math.hypot(vx, vy) + 0.001
        const nx = s.x + (vx / sp) * 60 * dt * (0.6 + s.depth)
        const ny = s.y + (vy / sp) * 60 * dt * (0.6 + s.depth)
        const fade = Math.min(1, s.life / 30) * Math.min(1, (s.max - s.life) / 30)
        {
          tctx.strokeStyle = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${0.32 * fade})`
          tctx.lineWidth = s.width
          tctx.beginPath()
          tctx.moveTo(s.x, s.y)
          tctx.lineTo(nx, ny)
          tctx.stroke()
        }
        s.x = nx; s.y = ny; s.life += dt * 60
        if (s.life > s.max || s.x < -30 || s.x > w + 30 || s.y < -30 || s.y > h + 30) Object.assign(s, newStroke(), { life: 0 })
      }
    }

    const drawTiny = () => {
      for (const s of tiny) {
        let y = s.y - (scrollShift * s.depth * 0.2) % (h * 1.5)
        if (y < -4) y += h * 1.5
        if (y > h + 4) continue
        const a = reduced ? 0.8 : 0.35 + 0.65 * Math.abs(Math.sin(t * s.tw + s.ph))
        ctx.globalAlpha = a
        ctx.fillStyle = '#fffbe8'
        ctx.beginPath()
        ctx.arc(s.x + px * s.depth * 16, y + py * s.depth * 12, s.r, 0, 6.283)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const drawBigStars = () => {
      for (const s of bigStars) {
        const x = s.x + px * s.depth * 26
        const y = s.y - scrollShift * s.depth * 0.18 + py * s.depth * 18
        if (y < -80 || y > h + 80) continue
        const pulse = reduced ? 1 : 1 + 0.12 * Math.sin(t * 1.4 + s.ph)
        const glow = ctx.createRadialGradient(x, y, 0, x, y, s.r * 5 * pulse)
        glow.addColorStop(0, 'rgba(255,248,214,.7)')
        glow.addColorStop(0.18, 'rgba(250,226,140,.28)')
        glow.addColorStop(0.5, 'rgba(160,190,255,.1)')
        glow.addColorStop(1, 'rgba(160,190,255,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, s.r * 5 * pulse, 0, 6.283)
        ctx.fill()
        // swirling halo rings, drawn as broken brush arcs
        ctx.lineCap = 'round'
        for (let k = 1; k <= 3; k++) {
          const rr = s.r * (1.4 + k * 0.95) * pulse
          const rot = t * s.spin * (k % 2 ? 1 : -0.7) + s.ph
          ctx.strokeStyle = k === 1 ? 'rgba(252,236,170,.4)' : k === 2 ? 'rgba(220,214,160,.22)' : 'rgba(150,185,255,.16)'
          ctx.lineWidth = k === 1 ? 2 : 1.5
          for (let seg = 0; seg < 3; seg++) {
            const a0 = rot + seg * 2.1
            ctx.beginPath()
            ctx.arc(x, y, rr, a0, a0 + 1.3)
            ctx.stroke()
          }
        }
        ctx.fillStyle = '#fffdf0'
        ctx.beginPath()
        ctx.arc(x, y, s.r * 0.55, 0, 6.283)
        ctx.fill()
      }
    }

    const drawMoon = () => {
      const r = Math.min(w, h) * (w < 700 ? 0.05 : 0.045)
      const x = w * 0.88 + px * 34
      const y = h * 0.14 - scrollShift * 0.12 + py * 22
      if (y < -r * 4) return
      const halo = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 4.2)
      halo.addColorStop(0, 'rgba(255,210,110,.4)')
      halo.addColorStop(0.4, 'rgba(240,190,90,.12)')
      halo.addColorStop(1, 'rgba(240,190,90,0)')
      ctx.fillStyle = halo
      ctx.beginPath(); ctx.arc(x, y, r * 4.2, 0, 6.283); ctx.fill()
      ctx.strokeStyle = 'rgba(255,214,120,.35)'
      ctx.lineWidth = 2
      for (let k = 0; k < 4; k++) {
        const a0 = t * 0.12 + k * 1.6
        ctx.beginPath(); ctx.arc(x, y, r * 1.9, a0, a0 + 0.9); ctx.stroke()
      }
      // crescent: a bright disc with a darker disc cutting it
      ctx.fillStyle = '#ffe08a'
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill()
      ctx.fillStyle = '#0a1440'
      ctx.beginPath(); ctx.arc(x + r * 0.45, y - r * 0.2, r * 0.9, 0, 6.283); ctx.fill()
    }

    const compose = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(trail, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawStatic()
    }

    const drawStatic = () => {
      drawTiny()
      drawBigStars()
      drawMoon()
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) { last = now; return }
      if (now - last < FRAME_MS - 1) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      px += (tx - px) * 0.04
      py += (ty - py) * 0.04
      scrollShift += (window.scrollY - scrollShift) * 0.08
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintSky(1)
      step(dt)
      compose()
    }

    const onMove = (e) => { tx = e.clientX / w - 0.5; ty = e.clientY / h - 0.5 }

    layout()
    if (!reduced) {
      raf = requestAnimationFrame(frame)
      window.addEventListener('pointermove', onMove, { passive: true })
    }
    window.addEventListener('resize', layout)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="starry-night" aria-hidden="true" />
}
