import SectionHead from './SectionHead.jsx'
import Tag from './Tag.jsx'
import Reveal from '../motion/Reveal.jsx'
import { useVideoSlot } from '../motion/MotionProvider.jsx'
import { TRAITS } from '../data/site.js'
import { mediaUrl } from '../config/media.js'

const STEPS = [
  { number: '01', title: 'Define the brief', description: 'Agree the project goals, scope and what the finished work needs to include.' },
  { number: '02', title: 'Plan the work', description: 'Shape the creative direction and deliverables around the agreed scope.' },
  { number: '03', title: 'Create & review', description: 'Develop the work and review it within the rounds confirmed for the project.' },
  { number: '04', title: 'Deliver with clarity', description: 'Confirm final handover and usage rights in writing.' },
]

function ProcessAmbience() {
  const { videoRef, motionAllowed } = useVideoSlot('process-ambience', 50)
  return (
    <div className="process-ambience" aria-hidden="true">
      {motionAllowed && (
        <video ref={videoRef} muted loop playsInline preload="none" tabIndex={-1} onError={(event) => { event.currentTarget.hidden = true }}>
          <source src={mediaUrl('/Media/Website-Loops/ambient-abstract-web.mp4')} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

// Dark cosmic section: a constellation timeline. Each step is a star on one
// glowing line; the studio note sits below as a glass panel.
export default function Process() {
  return (
    <section className="section process-section cx-night" id="process" aria-labelledby="process-title">
      <ProcessAmbience />
      <div className="container">
        <SectionHead id="process-title" index="03" label="Process" title="How we work">
          <p>A clear, collaborative route from project brief to agreed delivery.</p>
        </SectionHead>

        <Reveal as="ol" className="cx-constellation">
          {STEPS.map((step, index) => (
            <li className="cx-constellation__step" key={step.number} style={{ '--i': index }}>
              <span className="cx-constellation__star" aria-hidden="true" />
              <span className="cx-constellation__num">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </Reveal>

        <Reveal as="div" className="cx-studio" id="about">
          <div className="cx-studio__copy">
            <p className="cx-kicker"><span className="cx-kicker__index">04</span><span aria-hidden="true"> / </span>The studio</p>
            <h3>Creative work from Lisbon.</h3>
            <p>
              Vangogh Productions works from Lisbon. The name is inspired by the creativity, originality and courage associated with Vincent van Gogh. There is no official relationship or endorsement.{' '}
              <Tag kind="verified">From the Brand Bible</Tag>
            </p>
            <p className="fineprint">The studio story and founder text are placeholders until supplied.</p>
          </div>
          <ul className="cx-traits" aria-label="Brand personality">
            {TRAITS.map((trait) => <li key={trait}>{trait}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
