import { useEffect, useRef } from 'react'

// Fixed space backdrop for the "Signal" theme: slow star drift, a faint grid
// and a soft light that trails the cursor. Purely decorative.
export default function HoloBackdrop() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let raf = 0, x = 0, y = 0
    const onMove = (e) => {
      x = e.clientX; y = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--cx', `${x}px`)
        el.style.setProperty('--cy', `${y}px`)
        raf = 0
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div className="holo-backdrop" ref={ref} aria-hidden="true">
      <div className="holo-backdrop__stars" />
      <div className="holo-backdrop__grid" />
      <div className="holo-backdrop__cursor" />
    </div>
  )
}
