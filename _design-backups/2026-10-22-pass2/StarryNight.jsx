import { useEffect, useRef } from 'react'

// Cosmic backdrop for the whole site: three depths of twinkling stars that drift
// with scroll, slow luminous currents that swirl like wind in a night sky, and an
// occasional shooting star. One fixed canvas, behind everything.
// - Respects prefers-reduced-motion (draws one still frame).
// - Pauses when the tab is hidden. Lighter on small screens.

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

// Smooth swirling field: angle at (x, y) in unit space at time t.
function swirl(x, y, t) {
  return (
    Math.sin(x * 2.1 + t * 0.15) * 1.3 +
    Math.cos(y * 2.7 - t * 0.11) * 1.1 +
    Math.sin((x + y) * 3.3 + t * 0.07) * 0.7
  )
}

export default function StarryNight() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = rng(7)

    let w = 1, h = 1, dpr = 1, raf = 0, last = performance.now(), t = 0
    let stars = [], currents = [], shooting = null, nextShoot = 4
    let px = 0, py = 0, tx = 0, ty = 0

    const layout = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const small = w < 700
      const count = Math.round((w * h) / (small ? 5200 : 3400))
      stars = Array.from({ length: count }, () => {
        const depth = rand() < 0.62 ? 0.25 : rand() < 0.75 ? 0.55 : 1
        const warm = rand() < 0.12
        return {
          x: rand() * w,
          y: rand() * h * 1.6,
          r: (0.35 + rand() * 0.9) * (0.6 + depth * 0.7),
          depth,
          tw: 0.6 + rand() * 2.2,
          ph: rand() * 6.28,
          c: warm ? '255,226,170' : rand() < 0.3 ? '190,210,255' : '255,255,255',
        }
      })
      const ccount = small ? 60 : 140
      currents = Array.from({ length: ccount }, () => ({
        x: rand() * w,
        y: rand() * h,
        life: rand() * 260,
        hue: rand() < 0.18 ? 'gold' : 'blue',
      }))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#070a18'
      ctx.fillRect(0, 0, w, h)
    }

    const sky = () => {
      const g = ctx.createRadialGradient(w * 0.78, h * 0.12, 0, w * 0.78, h * 0.12, Math.max(w, h) * 0.9)
      g.addColorStop(0, '#12205a')
      g.addColorStop(0.35, '#0b1233')
      g.addColorStop(1, '#070a18')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const g2 = ctx.createRadialGradient(w * 0.12, h * 0.85, 0, w * 0.12, h * 0.85, Math.max(w, h) * 0.6)
      g2.addColorStop(0, 'rgba(40,100,215,.16)')
      g2.addColorStop(1, 'rgba(40,100,215,0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)
    }

    const drawStars = (scroll) => {
      for (const s of stars) {
        const off = (scroll * s.depth * 0.18) % (h * 1.6)
        let y = s.y - off
        if (y < -4) y += h * 1.6
        if (y > h + 4) continue
        const x = s.x + px * s.depth * 14
        const a = reduced ? 0.8 : 0.45 + 0.55 * Math.abs(Math.sin(t * s.tw + s.ph))
        ctx.globalAlpha = a
        ctx.fillStyle = `rgb(${s.c})`
        ctx.beginPath()
        ctx.arc(x, y + py * s.depth * 10, s.r, 0, 6.283)
        ctx.fill()
        if (s.depth === 1 && s.r > 1.1) {
          ctx.globalAlpha = a * 0.18
          ctx.beginPath()
          ctx.arc(x, y + py * s.depth * 10, s.r * 4, 0, 6.283)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    // Currents leave fading trails: we paint them on top with low alpha,
    // and the sky repaint each frame keeps only a short tail.
    const drawCurrents = (dt) => {
      ctx.lineCap = 'round'
      for (const c of currents) {
        const ang = swirl(c.x / w * 3, c.y / h * 3, t)
        const sp = 22
        const nx = c.x + Math.cos(ang) * sp * dt * 3
        const ny = c.y + Math.sin(ang) * sp * dt * 3
        const fade = Math.min(1, c.life / 40) * Math.min(1, (260 - c.life) / 40)
        ctx.strokeStyle = c.hue === 'gold' ? `rgba(230,196,120,${0.22 * fade})` : `rgba(120,165,255,${0.2 * fade})`
        ctx.lineWidth = c.hue === 'gold' ? 1.1 : 0.9
        ctx.beginPath()
        // a short comet tail along the flow
        ctx.moveTo(c.x - Math.cos(ang) * 14, c.y - Math.sin(ang) * 14)
        ctx.lineTo(nx, ny)
        ctx.stroke()
        c.x = nx; c.y = ny; c.life += dt * 60
        if (c.life > 260 || c.x < -20 || c.x > w + 20 || c.y < -20 || c.y > h + 20) {
          c.x = rand() * w; c.y = rand() * h; c.life = 0
        }
      }
    }

    const drawShooting = (dt) => {
      nextShoot -= dt
      if (!shooting && nextShoot <= 0) {
        shooting = { x: rand() * w * 0.7 + w * 0.2, y: rand() * h * 0.35, vx: -(380 + rand() * 260), vy: 160 + rand() * 120, life: 0 }
        nextShoot = 7 + rand() * 9
      }
      if (!shooting) return
      const s = shooting
      s.x += s.vx * dt; s.y += s.vy * dt; s.life += dt
      const a = Math.max(0, 1 - s.life / 1.1)
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 0.18, s.y - s.vy * 0.18)
      g.addColorStop(0, `rgba(255,255,255,${0.9 * a})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.strokeStyle = g
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x - s.vx * 0.18, s.y - s.vy * 0.18)
      ctx.stroke()
      if (s.life > 1.1) shooting = null
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) { last = now; return }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      px += (tx - px) * 0.04
      py += (ty - py) * 0.04
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sky()
      drawCurrents(dt)
      drawStars(window.scrollY)
      drawShooting(dt)
    }

    const onMove = (e) => {
      tx = e.clientX / w - 0.5
      ty = e.clientY / h - 0.5
    }

    layout()
    if (reduced) {
      sky()
      drawStars(0)
    } else {
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
