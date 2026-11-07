import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import { CLIENT_REVIEWS } from '../data/reviews.js'
import { FEATURED_PORTFOLIO, PORTFOLIO } from '../data/portfolio.js'
import { useMotionAllowed } from '../motion/MotionProvider.jsx'

// Client Stories: polaroids pinned to a line, a 3D carousel with the active card
// in front. Real reviews come from data/reviews.js (permission required). Until
// then each card shows a real portfolio image and an honest placeholder.
const MAX = 6

function buildSlides() {
  const real = CLIENT_REVIEWS.filter((r) => r.permission && r.quote && r.image)
  if (real.length) {
    return real.map((r) => ({
      id: r.id, image: r.image, caption: r.client, title: r.project || r.client,
      text: `“${r.quote}”`, by: [r.client, r.role].filter(Boolean).join(' · '), placeholder: false,
    }))
  }
  const images = FEATURED_PORTFOLIO.filter((item) => item.kind === 'image')
  const extra = PORTFOLIO.flatMap((c) => c.items).filter((item) => item.kind === 'image' && !images.includes(item))
  return [...images, ...extra].slice(0, MAX).map((item, i) => {
    const category = PORTFOLIO.find((c) => c.items.includes(item))
    return {
      id: item.id, image: item.src, alt: item.alt, caption: category?.label ?? 'Our work',
      title: `${category?.label ?? 'Project'} · story ${String(i + 1).padStart(2, '0')}`,
      text: 'A client review for this project will appear here once it has been received and approved.',
      by: null, placeholder: true,
    }
  })
}

// Small, stable tilt per card so the line looks hand-hung.
const TILTS = [-3.2, 2.4, -1.6, 3, -2.6, 1.8, -2.2, 2.8]

export default function ClientStories() {
  const slides = useMemo(buildSlides, [])
  const [active, setActive] = useState(0)
  const motionAllowed = useMotionAllowed()
  const count = slides.length
  const drag = useRef(null)

  const go = useCallback((delta) => setActive((a) => (a + delta + count) % count), [count])

  useEffect(() => { if (active >= count) setActive(0) }, [active, count])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }
  const onPointerDown = (e) => { drag.current = { x: e.clientX } }
  const onPointerUp = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    drag.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  if (!count) return null
  const current = slides[active]

  return (
    <section className="section cx-night cx-stories" id="stories" aria-labelledby="stories-title">
      <div className="container">
        <SectionHead id="stories-title" label="Client stories" title="Client stories, pinned to the line.">
          <p>Real projects, pinned to the line. Client reviews are added here only with their permission.</p>
        </SectionHead>
      </div>

      <div
        className={`pol${motionAllowed ? '' : ' pol--still'}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client stories"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current = null }}
      >
        <svg className="pol__line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 14 Q 500 62 1020 14" />
        </svg>
        <ul className="pol__stage">
          {slides.map((slide, i) => {
            let offset = i - active
            if (offset > count / 2) offset -= count
            if (offset < -count / 2) offset += count
            const abs = Math.abs(offset)
            const hidden = abs > 2
            return (
              <li
                key={slide.id}
                className={`pol__card${offset === 0 ? ' is-active' : ''}${hidden ? ' is-hidden' : ''}`}
                style={{ '--o': offset, '--abs': abs, '--tilt': `${TILTS[i % TILTS.length]}deg`, '--delay': `${(i % 4) * -1.3}s` }}
                aria-hidden={offset !== 0}
              >
                <button
                  type="button"
                  className="pol__frame"
                  tabIndex={offset === 0 ? -1 : hidden ? -1 : 0}
                  onClick={() => offset !== 0 && setActive(i)}
                  aria-label={offset === 0 ? undefined : `Show ${slide.title}`}
                >
                  <span className="pol__peg" aria-hidden="true" />
                  <span className="pol__photo">
                    <img src={slide.image} alt={offset === 0 ? (slide.alt ?? slide.caption) : ''} loading="lazy" decoding="async" draggable={false} />
                  </span>
                  <span className="pol__caption">{slide.caption}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="container pol__info">
          <div className="pol__text" aria-live="polite">
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            {current.by && <p className="pol__by">{current.by}</p>}
            {current.placeholder && <span className="pol__tag">Placeholder · review pending</span>}
          </div>
          <div className="pol__controls">
            <span className="pol__count" aria-label={`Story ${active + 1} of ${count}`}>
              {String(active + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(count).padStart(2, '0')}
            </span>
            <button type="button" className="pol__btn" onClick={() => go(-1)} aria-label="Previous story">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className="pol__btn" onClick={() => go(1)} aria-label="Next story">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
