import { useState } from 'react'
import { openGuide } from '../guide.js'
import { SERVICES } from '../data/site.js'
import { useVideoSlot } from '../motion/MotionProvider.jsx'
import SplitText from './SplitText.jsx'
import './Hero.css'
import { mediaUrl } from '../config/media.js'

// Cosmic hero: oversized editorial headline over the starry sky, the brand film
// in a floating "screen" with a soft orb glow, and a slow service ticker.
export default function Hero() {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const { videoRef, motionAllowed: videoMotionAllowed } = useVideoSlot('hero-brand-film', 100)
  const ticker = [...SERVICES, ...SERVICES]

  return (
    <section className="hero cx-hero" id="top" aria-labelledby="hero-title">
      <div className="cx-hero__inner">
        <p className="cx-hero__meta">
          <span className="cx-dot" aria-hidden="true" /> Lisbon, Portugal
          <span aria-hidden="true" className="cx-hero__sep">/</span> Creative production &amp; digital growth
        </p>

        <h1 id="hero-title" className="cx-hero__title" aria-label="Ideas with courage. Production with control.">
          <span className="cx-hero__line">
            <SplitText text="Ideas with courage." delay={140} stagger={110} />
          </span>
          <span className="cx-hero__line cx-hero__line--accent">
            <SplitText text="Production with control." delay={560} stagger={110} />
          </span>
        </h1>

        <div className="cx-hero__grid">
          <div className="cx-hero__copy">
            <p className="cx-hero__lede">A creative partner for brands that want to be seen, understood and remembered.</p>
            <div className="cx-hero__actions">
              <button className="cx-btn cx-btn--primary" onClick={() => openGuide('project')}>
                Start a Project <span aria-hidden="true">→</span>
              </button>
              <a className="cx-btn cx-btn--ghost" href="#work">Explore selected work</a>
            </div>
            <a className="cx-hero__scroll" href="#work">
              <span className="cx-hero__scroll-line" aria-hidden="true" /> Scroll to explore
            </a>
          </div>

          <figure className={`cx-screen${videoPlaying ? ' is-playing' : ''}`} aria-hidden="true">
            <span className="cx-screen__orb" />
            <div className="cx-screen__frame">
              {videoMotionAllowed && !videoFailed && (
                <video
                  className="cx-screen__video"
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={mediaUrl('/Media/Hero/hero-poster.jpg')}
                  aria-hidden="true"
                  tabIndex={-1}
                  onPlaying={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                  onError={() => { setVideoPlaying(false); setVideoFailed(true) }}
                >
                  <source src={mediaUrl('/Media/Hero/hero-background.mp4')} type="video/mp4" />
                </video>
              )}
              <span className="cx-screen__hud cx-screen__hud--tl"><span className="cx-rec" /> Brand film</span>
              <span className="cx-screen__hud cx-screen__hud--br">16:9</span>
            </div>
          </figure>
        </div>
      </div>

      <div className="cx-ticker" aria-label="Active services">
        <ul className="cx-ticker__track">
          {ticker.map((service, i) => (
            <li key={`${service.id}-${i}`} aria-hidden={i >= SERVICES.length ? 'true' : undefined}>
              <a href="#services" tabIndex={i >= SERVICES.length ? -1 : undefined}>{service.name}</a>
              <span className="cx-ticker__star" aria-hidden="true">✦</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
