import { useEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'
import { NAV } from '../data/site.js'
import { openGuide } from '../guide.js'
import { useMotionSettings } from '../motion/MotionProvider.jsx'

export default function Header() {
  const [menu, setMenu] = useState(false)
  const [releaseAtPageEnd, setReleaseAtPageEnd] = useState(false)
  const [compact, setCompact] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const headerRef = useRef(null)
  const navListRef = useRef(null)
  const lensRef = useRef(null)
  const { userPaused, setUserPaused, reduced } = useMotionSettings()
  const close = () => setMenu(false)

  useEffect(() => {
    if (!menu) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menu])

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const targets = NAV.map(({ href }) => document.getElementById(href.slice(1))).filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-18% 0px -65% 0px', threshold: [0, .2, .45, .7] })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 640px)')
    let frame = 0
    const updateEndPosition = () => {
      frame = 0
      const header = headerRef.current
      const heading = document.getElementById('cta-title')
      if (!header || !heading) return
      // The release only applies on phones; skip the layout reads elsewhere.
      if (!mobile.matches) { setReleaseAtPageEnd(false); return }

      const headerHeight = header.offsetHeight
      const headingBounds = heading.getBoundingClientRect()
      const distanceToEnd = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      const headingOverlapsHeader = headingBounds.top < headerHeight && headingBounds.bottom > 0
      const atPageEnd = distanceToEnd <= headerHeight
      const headerHasFocus = header.contains(document.activeElement)
      const release = (atPageEnd || headingOverlapsHeader)
        && !menu
        && !headerHasFocus

      setReleaseAtPageEnd(release)
    }

    // Scroll fires many times per frame; measure at most once per frame.
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateEndPosition) }

    updateEndPosition()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateEndPosition)
    window.addEventListener('focusin', updateEndPosition)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateEndPosition)
      window.removeEventListener('focusin', updateEndPosition)
    }
  }, [menu])

  // Liquid-glass lens: a glass pill that slides to the hovered or focused link
  // and rests on the current section. Desktop only; hidden by CSS on the mobile menu.
  const moveLens = (link) => {
    const lens = lensRef.current
    const list = navListRef.current
    if (!lens || !list) return
    if (!link) { lens.style.opacity = '0'; return }
    const a = link.getBoundingClientRect()
    const b = list.getBoundingClientRect()
    lens.style.width = `${a.width}px`
    lens.style.transform = `translateX(${a.left - b.left}px)`
    lens.style.opacity = '1'
  }
  const restLens = () => moveLens(navListRef.current?.querySelector('a[aria-current]'))

  useEffect(() => {
    restLens()
    window.addEventListener('resize', restLens)
    document.fonts?.ready.then(restLens)
    return () => window.removeEventListener('resize', restLens)
  }, [activeSection])

  // Specular light on the glass follows the pointer.
  const trackLight = (event) => {
    const r = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--glass-x', `${event.clientX - r.left}px`)
    event.currentTarget.style.setProperty('--glass-y', `${event.clientY - r.top}px`)
  }

  return (
    <header
      ref={headerRef}
      className={`header header--glass${releaseAtPageEnd ? ' header--end-release' : ''}${compact ? ' header--compact' : ''}`}
      inert={releaseAtPageEnd}
      onFocusCapture={() => setReleaseAtPageEnd(false)}
    >
      <div className="header__bar container" onPointerMove={trackLight}>
        <a className="header__logo" href="#top" onClick={close}>
          <Logo size={56} />
        </a>
        <div className="header__tools">
          <button
            className="motion-toggle"
            type="button"
            aria-label={userPaused ? 'Resume motion' : 'Pause motion'}
            aria-pressed={userPaused}
            title={reduced ? 'Motion is disabled by your device preference' : userPaused ? 'Resume motion' : 'Pause motion'}
            onClick={() => setUserPaused(!userPaused)}
          ><span aria-hidden="true">{userPaused ? '▶' : 'Ⅱ'}</span></button>
          <button className="menu-btn" type="button" aria-label={menu ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menu} aria-controls="primary-nav" onClick={() => setMenu(!menu)}>
            <span className="menu-btn__bars" aria-hidden="true" />
          </button>
        </div>
        <nav id="primary-nav" className={menu ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
          <ul ref={navListRef} onPointerLeave={restLens} onBlur={restLens}>
            <li className="nav__lens" ref={lensRef} aria-hidden="true" role="presentation" />
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={close} onPointerEnter={(e) => moveLens(e.currentTarget)} onFocus={(e) => moveLens(e.currentTarget)} aria-current={activeSection === n.href.slice(1) ? 'location' : undefined}>{n.label}</a>
              </li>
            ))}
          </ul>
          <button className="btn btn--primary" onClick={() => { close(); openGuide('project') }}>
            Start a Project
          </button>
        </nav>
      </div>
    </header>
  )
}
