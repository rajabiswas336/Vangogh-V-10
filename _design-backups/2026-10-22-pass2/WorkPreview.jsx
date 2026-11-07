import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import WorkTile from './WorkTile.jsx'
import WorkVideo from './WorkVideo.jsx'
import Lightbox from './Lightbox.jsx'
import { FEATURED_PORTFOLIO, PORTFOLIO_SHOWCASE, DISPLAY_PORTFOLIO_CATEGORIES, PORTFOLIO } from '../data/portfolio.js'
import { useMotionAllowed, useVideoSlot } from '../motion/MotionProvider.jsx'
import './WorkPreview.css'

const CATEGORY_CONCEPTS = {
  'graphic-design': { cover: '/Media/Website-Concepts/covers/brand-direction-concept.jpg' },
  videography: {
    cover: '/Media/Website-Loops/optimized/film-motion-poster.jpg',
    motion: '/Media/Website-Loops/optimized/film-motion-loop.mp4',
  },
}
const STACK_CATEGORIES = new Set(['menu-cards', 'business-cards', 'banners-print'])

function CategoryPanel({ category, index, activeIndex, selectedCategory, previewingIndex, motionAllowed, onActivate, onPreview, onSelect }) {
  const [previewIndex, setPreviewIndex] = useState(0)
  const [cycled, setCycled] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const { videoRef, motionAllowed: videoMotionAllowed } = useVideoSlot(`reel-${category.id}`, 35)
  const concept = CATEGORY_CONCEPTS[category.id]
  const active = activeIndex === index
  const userPreview = previewingIndex === index && active
  const workPreview = motionAllowed && active && (userPreview || cycled)
  const sequence = category.previews
  const preview = sequence[previewIndex % sequence.length] ?? category.cover
  const nearActive = Math.abs(activeIndex - index) <= 1
  const stack = STACK_CATEGORIES.has(category.id) ? category.previews.slice(0, 3) : []
  const conceptMotion = Boolean(concept?.motion && active && !workPreview && videoMotionAllowed && !videoFailed)
  const sampleVideo = Boolean(workPreview && preview?.kind === 'video' && videoMotionAllowed && !videoFailed)

  useEffect(() => {
    if (!active || !motionAllowed || sequence.length < 2) return undefined
    const timer = window.setInterval(() => {
      setPreviewIndex((current) => (current + 1) % sequence.length)
      setCycled(true)
    }, 4600)
    return () => window.clearInterval(timer)
  }, [active, motionAllowed, sequence.length])

  const coverImage = concept?.cover ?? (category.cover?.kind === 'image' ? category.cover.src : category.coverPoster)
  const coverWidth = category.cover?.width ?? 960
  const coverHeight = category.cover?.height ?? 540

  return (
    <li className={`category-reel__slide${active ? ' is-active' : ''}${selectedCategory === category.id ? ' is-selected' : ''}`}>
      <button
        className={`category-reel__panel${concept ? ' is-concept' : ''}${workPreview ? ' is-work-preview' : ''}`}
        type="button"
        aria-pressed={selectedCategory === category.id}
        aria-label={`View work from ${category.label}, ${category.items.length} samples`}
        onPointerEnter={() => { onActivate(index); onPreview(index) }}
        onPointerLeave={() => onPreview(null, index)}
        onFocus={() => { onActivate(index); onPreview(index) }}
        onBlur={() => onPreview(null, index)}
        onClick={() => onSelect(category, index)}
      >
        <span className={`category-reel__media${STACK_CATEGORIES.has(category.id) ? ' is-stacked' : ''}${category.id === 'photography' ? ' is-photography' : ''}`}>
          {stack.length > 0 ? (
            <span className="category-reel__stack" aria-hidden="true">
              {stack.map((item, itemIndex) => (
                <img
                  key={item.id}
                  className={`category-reel__stack-item category-reel__stack-item--${itemIndex + 1}`}
                  src={item.src}
                  alt=""
                  width={item.width}
                  height={item.height}
                  loading={nearActive ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ))}
            </span>
          ) : coverImage ? (
            <img
              className="category-reel__cover"
              src={coverImage}
              alt=""
              width={coverWidth}
              height={coverHeight}
              loading={nearActive ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : null}
          {conceptMotion && (
            <video
              ref={videoRef}
              className="category-reel__motion"
              muted loop playsInline preload="none" poster={concept.cover}
              aria-hidden="true" tabIndex={-1}
              onError={() => setVideoFailed(true)}
            ><source src={concept.motion} type="video/mp4" /></video>
          )}
          {workPreview && preview?.kind === 'image' && (
            <img
              className="category-reel__work-image"
              src={preview.src}
              alt=""
              width={preview.width}
              height={preview.height}
              loading="eager"
              decoding="async"
            />
          )}
          {sampleVideo && (
            <video
              ref={videoRef}
              className="category-reel__work-video"
              muted loop playsInline preload="none" poster={category.coverPoster}
              aria-hidden="true" tabIndex={-1}
              onError={() => setVideoFailed(true)}
            ><source src={preview.playbackSrc ?? preview.src} type="video/mp4" /></video>
          )}
          {workPreview && preview?.kind === 'video' && videoFailed && category.coverPoster && (
            <img className="category-reel__work-image" src={category.coverPoster} alt="" width={960} height={540} />
          )}
          <span className={`category-reel__provenance${concept && !workPreview ? ' is-concept' : ''}`}>
            {workPreview ? 'Work preview' : concept ? 'Concept' : 'Portfolio'}
          </span>
          {workPreview && <span className="category-reel__progress" aria-hidden="true" />}
          <span className="category-reel__caption">
            <span className="category-reel__caption-top">{String(index + 1).padStart(2, '0')} / 06</span>
            <span className="category-reel__title">{category.label}</span>
            <span className="category-reel__caption-bottom">
              <span>{category.items.length} samples</span>
              <span className="category-reel__affordance">View work <span aria-hidden="true">↗</span></span>
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}

export default function WorkPreview() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const [previewingIndex, setPreviewingIndex] = useState(null)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [reelInView, setReelInView] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const trackRef = useRef(null)
  const galleryRef = useRef(null)
  const scrollRaf = useRef(0)
  const motionAllowed = useMotionAllowed()
  const categories = useMemo(() => DISPLAY_PORTFOLIO_CATEGORIES
    .map(({ id }) => PORTFOLIO_SHOWCASE.find((item) => item.id === id))
    .filter(Boolean), [])
  const selectedItems = useMemo(() => activeCategory === 'all'
    ? FEATURED_PORTFOLIO
    : PORTFOLIO.find((item) => item.id === activeCategory)?.items ?? [], [activeCategory])
  const imageItems = selectedItems.filter((item) => item.kind === 'image')
  const imageIndex = new Map(imageItems.map((item, index) => [item.id, index]))

  const stopAutoAdvance = useCallback(() => setAutoAdvance(false), [])
  const stopReelOnInteraction = useCallback((event) => {
    if (event.target.closest('.category-reel__rotation')) return
    stopAutoAdvance()
  }, [stopAutoAdvance])
  const activatePanel = useCallback((index) => setActiveIndex(index), [])
  const updatePreview = useCallback((index, departingIndex) => {
    if (Number.isInteger(index)) setPreviewingIndex(index)
    else setPreviewingIndex((current) => current === departingIndex ? null : current)
  }, [])

  const scrollToPanel = useCallback((index, behavior = 'smooth') => {
    const panel = trackRef.current?.children[index]
    panel?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' })
  }, [])

  const goToIndex = useCallback((index) => {
    const next = (index + categories.length) % categories.length
    setActiveIndex(next)
    scrollToPanel(next, motionAllowed ? 'smooth' : 'instant')
  }, [categories.length, motionAllowed, scrollToPanel])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => setReelInView(entry.intersectionRatio > .6), { threshold: [.6, .7, .8] })
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!autoAdvance || !motionAllowed || !reelInView || document.hidden) return undefined
    const timer = window.setInterval(() => goToIndex(activeIndex + 1), 5000)
    return () => window.clearInterval(timer)
  }, [autoAdvance, motionAllowed, reelInView, activeIndex, goToIndex])

  useEffect(() => () => {
    if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
  }, [])

  const handleTrackScroll = () => {
    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0
      const track = trackRef.current
      if (!track) return
      const center = track.getBoundingClientRect().left + track.clientWidth / 2
      let nearest = 0
      let distance = Infinity
      Array.from(track.children).forEach((slide, index) => {
        const bounds = slide.getBoundingClientRect()
        const nextDistance = Math.abs(bounds.left + bounds.width / 2 - center)
        if (nextDistance < distance) { distance = nextDistance; nearest = index }
      })
      setActiveIndex(nearest)
    })
  }

  const selectCategory = (category, index) => {
    setActiveIndex(index)
    setPreviewingIndex(index)
    setActiveCategory(category.id)
    setLightboxIndex(null)
    window.requestAnimationFrame(() => galleryRef.current?.scrollIntoView({ behavior: motionAllowed ? 'smooth' : 'instant', block: 'start' }))
  }

  const showFeatured = () => {
    setActiveCategory('all')
    setLightboxIndex(null)
    window.requestAnimationFrame(() => galleryRef.current?.scrollIntoView({ behavior: motionAllowed ? 'smooth' : 'instant', block: 'start' }))
  }

  const handleReelKey = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goToIndex(activeIndex + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToIndex(activeIndex - 1) }
    if (event.key === 'Home') { event.preventDefault(); goToIndex(0) }
    if (event.key === 'End') { event.preventDefault(); goToIndex(categories.length - 1) }
  }

  return (
    <section className="section work-section" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead id="work-title" index="01" label="Work" title="Selected work">
          <p>Explore each discipline through its category cover, then open the authentic portfolio samples.</p>
        </SectionHead>

        <div
          className={`category-reel${motionAllowed ? '' : ' is-motion-paused'}`}
          role="region"
          aria-roledescription="carousel"
          aria-label="Portfolio categories"
          onPointerEnterCapture={stopReelOnInteraction}
          onPointerDownCapture={stopReelOnInteraction}
          onFocusCapture={stopAutoAdvance}
          onTouchStartCapture={stopReelOnInteraction}
          onKeyDownCapture={stopAutoAdvance}
          onKeyDown={handleReelKey}
          onWheel={stopAutoAdvance}
        >
          <ul className="category-reel__track" ref={trackRef} onScroll={handleTrackScroll} aria-label="Six portfolio categories">
            {categories.map((category, index) => (
              <CategoryPanel
                key={category.id}
                category={category}
                index={index}
                activeIndex={activeIndex}
                selectedCategory={activeCategory}
                previewingIndex={previewingIndex}
                motionAllowed={motionAllowed}
                onActivate={activatePanel}
                onPreview={updatePreview}
                onSelect={selectCategory}
              />
            ))}
          </ul>
          <div className="category-reel__controls" aria-label="Portfolio reel controls">
            <button className="category-reel__arrow" type="button" onClick={() => goToIndex(activeIndex - 1)} aria-label="Previous portfolio category">← <span>Previous</span></button>
            <button className="category-reel__rotation" type="button" aria-pressed={!autoAdvance} onClick={() => setAutoAdvance((current) => !current)}>
              <span aria-hidden="true">{autoAdvance ? 'Ⅱ' : '▶'}</span> {autoAdvance ? 'Pause' : 'Resume'}
            </button>
            <div className="category-reel__dots" role="group" aria-label="Go to a portfolio category">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  className="category-reel__dot"
                  type="button"
                  aria-label={`Go to ${category.label}`}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  onClick={() => goToIndex(index)}
                />
              ))}
            </div>
            <button className="category-reel__arrow" type="button" onClick={() => goToIndex(activeIndex + 1)} aria-label="Next portfolio category"><span>Next</span> →</button>
          </div>
          <button className="category-reel__featured" type="button" onClick={showFeatured}>Show featured work <span aria-hidden="true">↗</span></button>
        </div>

        <div className="work-panel" aria-live="polite" ref={galleryRef}>
          {selectedItems.length ? (
            <ul className={`work-grid${activeCategory === 'all' ? ' work-grid--showcase' : ''}`} aria-label={activeCategory === 'all' ? 'Featured portfolio samples' : `${DISPLAY_PORTFOLIO_CATEGORIES.find((category) => category.id === activeCategory)?.label} samples`}>
              {selectedItems.map((item) => item.kind === 'video' ? (
                <WorkVideo key={item.id} item={item} />
              ) : (
                <WorkTile key={item.id} item={item} onOpen={() => setLightboxIndex(imageIndex.get(item.id))} />
              ))}
            </ul>
          ) : <p>No samples found in this category.</p>}
        </div>

        {lightboxIndex !== null && imageItems[lightboxIndex] && (
          <Lightbox items={imageItems} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />
        )}
      </div>
    </section>
  )
}
