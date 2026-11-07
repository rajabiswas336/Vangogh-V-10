import { useEffect, useMemo, useRef, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import WorkTile from './WorkTile.jsx'
import WorkVideo from './WorkVideo.jsx'
import Lightbox from './Lightbox.jsx'
import GlassFolder from './GlassFolder.jsx'
import { FEATURED_PORTFOLIO, PORTFOLIO_SHOWCASE, DISPLAY_PORTFOLIO_CATEGORIES, PORTFOLIO } from '../data/portfolio.js'
import { useMotionAllowed } from '../motion/MotionProvider.jsx'
import './WorkPreview.css'
import { mediaUrl } from '../config/media.js'

// Category covers that already existed for the reel.
const CATEGORY_COVERS = {
  'graphic-design': '/Media/Website-Concepts/covers/brand-direction-concept.jpg',
  videography: '/Media/Website-Loops/optimized/film-motion-poster.jpg',
}

const coverOf = (category) =>
  (CATEGORY_COVERS[category.id] && mediaUrl(CATEGORY_COVERS[category.id])) ?? (category.cover?.kind === 'image' ? category.cover.src : category.coverPoster)

// Up to four real samples per folder. Videos use their poster when one exists.
function filesOf(category) {
  const pool = [...category.previews, ...category.items.filter((item) => !category.previews.includes(item))]
  return pool.slice(0, 4).map((item) => ({
    id: item.id,
    name: item.label,
    meta: item.kind === 'video' ? 'Video' : 'Image',
    image: item.kind === 'image' ? item.src : item.file === 'IMG_1379.MOV' ? category.coverPoster : undefined,
    art: item.kind === 'video' && item.file !== 'IMG_1379.MOV' ? 'dusk' : undefined,
  }))
}

function useFolderWidth() {
  const get = () => (typeof window === 'undefined' ? 340 : window.innerWidth < 420 ? window.innerWidth - 56 : window.innerWidth < 760 ? 300 : 340)
  const [width, setWidth] = useState(get)
  useEffect(() => {
    const on = () => setWidth(get())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return width
}

export default function WorkPreview() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const galleryRef = useRef(null)
  const motionAllowed = useMotionAllowed()
  const folderWidth = useFolderWidth()

  const categories = useMemo(() => DISPLAY_PORTFOLIO_CATEGORIES
    .map(({ id }) => PORTFOLIO_SHOWCASE.find((item) => item.id === id))
    .filter(Boolean), [])
  const selectedItems = useMemo(() => activeCategory === 'all'
    ? FEATURED_PORTFOLIO
    : PORTFOLIO.find((item) => item.id === activeCategory)?.items ?? [], [activeCategory])
  const imageItems = selectedItems.filter((item) => item.kind === 'image')
  const imageIndex = new Map(imageItems.map((item, index) => [item.id, index]))
  const activeLabel = activeCategory === 'all'
    ? 'Featured work'
    : DISPLAY_PORTFOLIO_CATEGORIES.find((category) => category.id === activeCategory)?.label

  const scrollToGallery = () => window.requestAnimationFrame(() =>
    galleryRef.current?.scrollIntoView({ behavior: motionAllowed ? 'smooth' : 'instant', block: 'start' }))

  const showCategory = (category) => {
    setActiveCategory(category.id)
    setLightboxIndex(null)
    scrollToGallery()
  }

  // A file chosen inside an open folder: images open in the lightbox, videos
  // jump to the gallery where they play.
  const openFile = (category, file) => {
    const items = PORTFOLIO.find((item) => item.id === category.id)?.items ?? []
    const item = items.find((entry) => entry.id === file.id)
    setActiveCategory(category.id)
    if (item?.kind === 'image') {
      const images = items.filter((entry) => entry.kind === 'image')
      setLightboxIndex(images.findIndex((entry) => entry.id === item.id))
    } else {
      setLightboxIndex(null)
      scrollToGallery()
    }
  }

  return (
    <section className="section work-section" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead id="work-title" index="01" label="Work" title="Selected work">
          <p>Six disciplines, six folders. Hover to lean the glass, click to open it, then choose a sample.</p>
        </SectionHead>

        <ul className="cx-folders" aria-label="Portfolio categories">
          {categories.map((category, index) => (
            <li key={category.id} className="cx-folders__item">
              <GlassFolder
                label={category.label}
                meta={`${category.items.length} samples`}
                tone="dark"
                image={coverOf(category)}
                art="none"
                files={filesOf(category)}
                action="more"
                menu={[{ label: 'Show all samples', onSelect: () => showCategory(category) }]}
                width={folderWidth}
                appear={motionAllowed}
                appearDelay={index * 110}
                onFileSelect={(file) => openFile(category, file)}
              />
              <button type="button" className="cx-folders__all" onClick={() => showCategory(category)}>
                <span className="cx-folders__num">{String(index + 1).padStart(2, '0')}</span> All {category.label.toLowerCase()} <span aria-hidden="true">↗</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="cx-gallery-head" ref={galleryRef}>
          <p className="cx-kicker"><span className="cx-kicker__index">{activeCategory === 'all' ? '★' : '→'}</span><span aria-hidden="true"> / </span>{activeLabel}</p>
          {activeCategory !== 'all' && (
            <button type="button" className="cx-btn cx-btn--ghost" onClick={() => { setActiveCategory('all'); setLightboxIndex(null) }}>
              Show featured work
            </button>
          )}
        </div>

        <div className="work-panel" aria-live="polite">
          {selectedItems.length ? (
            <ul className={`work-grid${activeCategory === 'all' ? ' work-grid--showcase' : ''}`} aria-label={`${activeLabel} samples`}>
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
