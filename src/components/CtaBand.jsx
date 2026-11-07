import { openGuide } from '../guide.js'
import Reveal from '../motion/Reveal.jsx'

// Closing signal over the night sky: a large orb glow, a big question, one action.
export default function CtaBand() {
  return (
    <section className="cta cx-cta" id="enquiry" aria-labelledby="cta-title">
      <span className="cx-cta__orb" aria-hidden="true" />
      <Reveal as="div" className="container cx-cta__inner">
        <p className="cx-kicker"><span className="cx-kicker__index">07</span><span aria-hidden="true"> / </span>Start a Project</p>
        <h2 id="cta-title">Have a project <em>in mind?</em></h2>
        <p>Tell us what you want to make. The guided enquiry is a local demo in this prototype and does not send anything.</p>
        <button className="cx-btn cx-btn--gold" onClick={() => openGuide('project')}>Start a Project <span aria-hidden="true">→</span></button>
      </Reveal>
    </section>
  )
}
