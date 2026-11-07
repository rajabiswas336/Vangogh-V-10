// Official logo variants, supplied by the owner:
//   dark  = white logo (public/logo/Vangogh Logo F-03.png) for dark backgrounds
//   light = blue logo with black text (public/logo/Vangogh Logo F-01.png) for light backgrounds
// The web copies in public/logo/web/*-tight.png only remove the empty transparent
// margin and are scaled down for speed. Shape and colour are unchanged.
const SOURCES = {
  dark: '/logo/web/vangogh-logo-white-tight.png',
  light: '/logo/web/vangogh-logo-blue-black-tight.png',
}

// size = rendered height in px. Width follows the logo's own proportions.
export default function Logo({ size = 64, variant = 'dark' }) {
  return (
    <span className="logo" style={{ '--logo': `${size}px`, width: 'auto' }}>
      <img
        src={SOURCES[variant] || SOURCES.dark}
        alt="Vangogh Productions"
        width="426"
        height="480"
        decoding="async"
        style={{ height: `${size}px`, width: 'auto' }}
      />
    </span>
  )
}
