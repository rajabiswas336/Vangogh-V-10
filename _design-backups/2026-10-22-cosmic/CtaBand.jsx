import { openGuide } from '../guide.js'
import { useEffect, useRef, useState } from 'react'
import { useMotionAllowed } from '../motion/MotionProvider.jsx'

export default function CtaBand() {
  const ref = useRef(null)
  const motionAllowed = useMotionAllowed()
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (!motionAllowed || !ref.current || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [motionAllowed])

  return (
    <section ref={ref} className={`cta${entered && motionAllowed ? ' cta--entered' : ''}`} id="enquiry" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <h2 id="cta-title">Have a project in mind?</h2>
        <p>Tell us what you want to make. The guided enquiry is a local demo in this prototype and does not send anything.</p>
        <button className="btn btn--gold" onClick={() => openGuide('project')}>Start a Project</button>
      </div>
    </section>
  )
}
