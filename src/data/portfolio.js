import { WORK_CATEGORIES } from './portfolioCategories.js'
import { PORTFOLIO_FILES } from './portfolio.generated.js'
import { ALT_OVERRIDES } from './portfolioAlt.js'
import { PORTFOLIO_WEB_IMAGES } from './portfolio.web.generated.js'
import { mediaUrl } from '../config/media.js'

// Every path segment is encoded, so spaces, "—" and "&" in folder names work in URLs.
// Vite serves this public folder only when its literal ampersand remains in
// the URL; encoding it as %26 produces a 404 for the Banners & Print assets.
const url = (...parts) => mediaUrl('/' + parts.map((part) => encodeURIComponent(part).replace(/%26/g, '&')).join('/'))

// HEVC originals stay in the manifest; browsers use these H.264 playback copies.
const VIDEO_PLAYBACK_URLS = {
  'IMG_1379.MOV': '/Media/Portfolio/IMG_1379.mp4',
  'IMG_1409.MOV': '/Media/Portfolio/IMG_1409.mp4',
}

export const PORTFOLIO = WORK_CATEGORIES.map((cat) => {
  const files = PORTFOLIO_FILES[cat.folder] ?? []
  const items = files.map((f, i) => {
    const label = `${cat.singular} sample ${i + 1}`
    // Web-sized WebP copy when one exists; the original stays in Portfolio Samples.
    const web = PORTFOLIO_WEB_IMAGES[`${cat.folder}/${f.file}`]
    return {
      id: `${cat.id}-${i}`,
      file: f.file,
      src: web ? url(...web.src.slice(1).split('/')) : url('Portfolio Samples', cat.folder, f.file),
      label,
      alt: ALT_OVERRIDES[`${cat.folder}/${f.file}`] ?? `${label} of ${files.length}`,
      width: web?.w ?? f.w,
      height: web?.h ?? f.h,
      codec: f.codec,
      kind: cat.kind,
      playbackSrc: VIDEO_PLAYBACK_URLS[f.file] && mediaUrl(VIDEO_PLAYBACK_URLS[f.file]),
      playbackCodec: VIDEO_PLAYBACK_URLS[f.file] ? 'H.264 (AVC)' : f.codec,
    }
  })
  return { ...cat, items }
})

// Editorial opening mix: lead with distinct disciplines, then show more work.
// Keep filenames and order here so the homepage presentation is maintained centrally.
export const FEATURED_PORTFOLIO_SELECTION = [
  ['graphic-design', 'Taverna do Marisco.png'],
  ['photography', 'WhatsApp Image 2026-10-17 at 5.50.55 AM.jpeg'],
  ['videography', 'IMG_1379.MOV'],
  ['banners-print', '2.png'],
  ['menu-cards', '1.png'],
  ['business-cards', '1.png'],
  ['photography', 'WhatsApp Image 2026-10-17 at 5.50.58 AM.jpeg'],
  ['videography', 'IMG_1409.MOV'],
]

// Put the disciplines in the opening preview row first, then retain any
// remaining categories in their established order.
export const DISPLAY_PORTFOLIO_CATEGORIES = [...new Set([
  ...FEATURED_PORTFOLIO_SELECTION.map(([categoryId]) => categoryId),
  ...WORK_CATEGORIES.map(({ id }) => id),
])]
  .map((categoryId) => WORK_CATEGORIES.find((category) => category.id === categoryId))
  .filter(Boolean)

export const FEATURED_PORTFOLIO = FEATURED_PORTFOLIO_SELECTION
  .map(([categoryId, file]) => PORTFOLIO.find((category) => category.id === categoryId)?.items.find((item) => item.file === file))
  .filter(Boolean)

// Cover choice and interactive preview order stay editable alongside the
// featured sequence. Every entry below maps to a file already in the manifest.
const SHOWCASE_CONFIG = [
  { id: 'menu-cards', title: 'Menu cards', coverFile: '1.png', previewFiles: ['1.png', '6.png', 'Arrozaria menu draft.png'] },
  { id: 'business-cards', title: 'Business cards', coverFile: '1.png', previewFiles: ['1.png', 'Screenshot 2026-10-17 053526.jpg', 'Screenshot 2026-10-17 053807.jpg'] },
  { id: 'banners-print', title: 'Banners & print', coverFile: '2.png', previewFiles: ['2.png', 'Next Level Board -01.png', 'O CERVEIRENSE Front menu-01.png'] },
  { id: 'graphic-design', title: 'Graphic design', coverFile: 'Taverna do Marisco.png', previewFiles: ['Taverna do Marisco.png', 'Siam Thai Massage Lisboa logo Final-01.png', 'THAI TIME LOGO 3.png'] },
  { id: 'photography', title: 'Photography', coverFile: 'WhatsApp Image 2026-10-17 at 5.50.55 AM.jpeg', previewFiles: ['WhatsApp Image 2026-10-17 at 5.50.55 AM.jpeg', 'WhatsApp Image 2026-10-17 at 5.50.58 AM.jpeg', 'WhatsApp Image 2026-10-17 at 5.50.59 AM.jpeg'] },
  { id: 'videography', title: 'Videography', coverFile: 'IMG_1379.MOV', coverPoster: '/Media/Portfolio/IMG_1379-preview.jpg', previewFiles: ['IMG_1379.MOV', 'IMG_1409.MOV'] },
]

export const PORTFOLIO_SHOWCASE = SHOWCASE_CONFIG.map((config) => {
  const category = PORTFOLIO.find((item) => item.id === config.id)
  const previews = config.previewFiles.map((file) => category?.items.find((item) => item.file === file)).filter(Boolean)
  const cover = category?.items.find((item) => item.file === config.coverFile) ?? previews[0] ?? category?.items[0]

  return {
    ...category,
    label: config.title,
    cover,
    coverPoster: config.coverPoster && mediaUrl(config.coverPoster),
    previews: previews.length ? previews : category?.items.slice(0, 1) ?? [],
  }
})
