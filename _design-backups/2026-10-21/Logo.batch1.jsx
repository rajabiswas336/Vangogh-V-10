// variant "dark" = white logo for dark backgrounds, "light" = blue logo with black text for light backgrounds.
// Both are web-sized copies of the original supplied files (public/logo/Vangogh Logo F-03.png and F-01.png).
// The originals are untouched. No background plate: the supplied PNGs are transparent.
const SOURCES = {
  dark: '/logo/web/vangogh-logo-white.png',
  light: '/logo/web/vangogh-logo-blue-black.png',
}

export default function Logo({ size = 64, variant = 'dark' }) {
  return (
    <span className="logo" style={{ '--logo': `${size}px` }}>
      <img
        src={SOURCES[variant] || SOURCES.dark}
        alt="Vangogh Productions"
        width="800"
        height="800"
        decoding="async"
      />
    </span>
  )
}
