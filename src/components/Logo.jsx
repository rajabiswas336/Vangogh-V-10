// Official logo, supplied by the owner:
//   dark  = white logo (public/logo/Vangogh Logo F-03.png) for dark backgrounds
//   light = blue logo with black text (public/logo/Vangogh Logo F-01.png) for light backgrounds
// For a readable header, the symbol and the two-line wordmark from the same file sit
// side by side (owner approved adjusting the arrangement on 2026-10-21).
// Shape, colour and letters are unchanged; only empty margin was removed and the
// files were scaled down for speed. Originals in public/logo/ are untouched.
const SRC = {
  dark: { mark: '/logo/web/vangogh-mark-white.png', word: '/logo/web/vangogh-wordmark-white.png' },
  light: { mark: '/logo/web/vangogh-mark-blue-black.png', word: '/logo/web/vangogh-wordmark-blue-black.png' },
}

// size = header row height budget in px (the symbol is ~2/3 of it).
export default function Logo({ size = 72, variant = 'dark' }) {
  const s = SRC[variant] || SRC.dark
  const markH = Math.round(size * 0.68)
  const wordH = Math.round(size * 0.46)
  return (
    <span className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.18), width: 'auto', height: 'auto', background: 'transparent' }}>
      <img src={s.mark} alt="" aria-hidden="true" width="244" height="240" decoding="async" style={{ height: markH, width: 'auto', display: 'block' }} />
      <img src={s.word} alt="Vangogh Productions" width="1259" height="240" decoding="async" style={{ height: wordH, width: 'auto', display: 'block' }} />
    </span>
  )
}
