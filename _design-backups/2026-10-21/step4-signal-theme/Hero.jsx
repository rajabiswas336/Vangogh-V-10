import { useCallback, useRef, useState } from 'react'
import { openGuide } from '../guide.js'
import { SERVICES } from '../data/site.js'
import { useMotionAllowed, useVideoSlot } from '../motion/MotionProvider.jsx'
import SplitText from './SplitText.jsx'
import './Hero.css'

export default function Hero() {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const motionAllowed = useMotionAllowed()
  const { videoRef, motionAllowed: videoMotionAllowed } = useVideoSlot('hero-brand-film', 100)
  const frameRef = useRef(null)
  const frameRaf = useRef(0)
  const pointer = useRef({ x: 50, y: 50 })

  const resetFrame = useCallback(() => {
    if (frameRaf.current) cancelAnimationFrame(frameRaf.current)
    frameRaf.current = 0
    frameRef.current?.style.setProperty('--hero-tilt', '0deg')
    frameRef.current?.style.setProperty('--hero-tilt-y', '0deg')
    frameRef.current?.style.setProperty('--hero-spot-x', '50%')
    frameRef.current?.style.setProperty('--hero-spot-y', '50%')
  }, [])

  const moveFrame = useCallback((event) => {
    if (!motionAllowed || !window.matchMedia('(pointer: fine)').matches || frameRaf.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointer.current = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height }
    frameRaf.current = requestAnimationFrame(() => {
      const { x, y } = pointer.current
      frameRef.current?.style.setProperty('--hero-tilt', `${((.5 - y) * 5).toFixed(2)}deg`)
      frameRef.current?.style.setProperty('--hero-tilt-y', `${((x - .5) * 5).toFixed(2)}deg`)
      frameRef.current?.style.setProperty('--hero-spot-x', `${(x * 100).toFixed(1)}%`)
      frameRef.current?.style.setProperty('--hero-spot-y', `${(y * 100).toFixed(1)}%`)
      frameRaf.current = 0
    })
  }, [motionAllowed])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__note">Lisbon, Portugal <span aria-hidden="true">·</span> Creative production &amp; digital growth</p>
          <h1 id="hero-title" className="hero__title" aria-label="Ideas with courage. Production with control.">
            <span className="line">
              <SplitText text="Ideas with courage." delay={140} stagger={140} />
            </span>
            <span className="line line--accent">
              <SplitText text="Production with control." delay={620} stagger={140} />
            </span>
          </h1>
          <span className="hero__rule" aria-hidden="true" />
          <p className="hero__lede">
            A creative partner for brands that want to be seen, understood and remembered.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => openGuide('project')}>Start a Project <span aria-hidden="true">↗</span></button>
            <a className="btn btn--ghost" href="#work">Explore selected work</a>
          </div>
          <ul className="hero__service-rail" aria-label="Active services">
            {SERVICES.map((service) => <li key={service.id}><a href="#services">{service.name}</a></li>)}
          </ul>
        </div>
        <figure
          ref={frameRef}
          className={`frame${videoPlaying ? ' frame--playing' : ''}${motionAllowed ? ' frame--interactive' : ''}`}
          aria-hidden="true"
          onPointerMove={moveFrame}
          onPointerLeave={resetFrame}
        >
          {videoMotionAllowed && !videoFailed && (
            <video
              className="frame__video"
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster="/Media/Hero/hero-poster.jpg"
              aria-hidden="true"
              tabIndex={-1}
              onPlaying={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              onError={() => {
                setVideoPlaying(false)
                setVideoFailed(true)
              }}
            >
              <source src="/Media/Hero/hero-background.mp4" type="video/mp4" />
            </video>
          )}
          <div className="frame__art" aria-hidden="true" />
          <span className="frame__specular" aria-hidden="true" />
        </figure>
      </div>
      <div className="hero__reflection" aria-hidden="true" />
    </section>
  )
}
