import { useEffect } from 'react'

// Marks <main> sections and the footer that are out of view with .is-offscreen,
// so their looping CSS animations stop costing frames while the page scrolls.
export default function usePauseOffscreen() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const targets = document.querySelectorAll('main > section, body > #root > footer, footer.footer')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-offscreen', !entry.isIntersecting)
    }, { rootMargin: '200px 0px' })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])
}
