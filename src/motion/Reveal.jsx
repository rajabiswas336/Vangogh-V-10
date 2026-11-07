import { useEffect, useRef, useState } from 'react'
import { useMotionAllowed } from './MotionProvider.jsx'

export default function Reveal({ as: Element = 'div', className = '', variant = 'default', children, ...props }) {
  const ref = useRef(null)
  const motionAllowed = useMotionAllowed()
  const [armed, setArmed] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!motionAllowed || !ref.current || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return undefined
    }
    const element = ref.current
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setRevealed(true)
      return undefined
    }
    setArmed(true)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setRevealed(true)
      observer.disconnect()
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [motionAllowed])

  const variantClass = variant && variant !== 'default' ? ` vp-reveal--${variant}` : ''

  return (
    <Element
      ref={ref}
      className={`${className} vp-reveal${variantClass}${armed && !revealed ? ' vp-reveal--pending' : ''}${revealed ? ' vp-reveal--in' : ''}`.trim()}
      {...props}
    >
      {children}
    </Element>
  )
}
