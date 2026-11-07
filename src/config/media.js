// Where videos, portfolio images and expert photos are served from.
// Empty by default: files ship with the site from public/.
// To move media to a CDN later, set VITE_MEDIA_BASE to its address (no trailing slash).
const base = (import.meta.env.VITE_MEDIA_BASE ?? '').replace(/\/$/, '')

export const mediaUrl = (path) => `${base}${path}`
