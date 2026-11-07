import SectionHead from './SectionHead.jsx'
import Tag from './Tag.jsx'
import Reveal from '../motion/Reveal.jsx'
import { useVideoSlot } from '../motion/MotionProvider.jsx'
import { TRAITS } from '../data/site.js'

const STEPS = [
  {
    number: '01',
    title: 'Define the brief',
    description: 'Agree the project goals, scope and what the finished work needs to include.',
  },
  {
    number: '02',
    title: 'Plan the work',
    description: 'Shape the creative direction and deliverables around the agreed scope.',
  },
  {
    number: '03',
    title: 'Create & review',
    description: 'Develop the work and review it within the rounds confirmed for the project.',
  },
  {
    number: '04',
    title: 'Deliver with clarity',
    description: 'Confirm final handover and usage rights in writing.',
  },
]

function ProcessAmbience() {
  const { videoRef, motionAllowed } = useVideoSlot('process-ambience', 50)

  return (
    <div className="process-ambience" aria-hidden="true">
      {motionAllowed && (
        <video ref={videoRef} muted loop playsInline preload="none" tabIndex={-1} onError={(event) => { event.currentTarget.hidden = true }}>
          <source src="/Media/Website-Loops/ambient-abstract-web.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  )
}

export default function Process() {
  return (
    <section className="section process-section" id="process" aria-labelledby="process-title">
      <ProcessAmbience />
      <div className="container">
        <SectionHead id="process-title" title="How we work">
          <p>A clear, collaborative route from project brief to agreed delivery.</p>
        </SectionHead>
        <Reveal as="ol" className="process-steps">
          {STEPS.map((step, index) => (
            <Reveal as="li" className="process-step" key={step.number} style={{ transitionDelay: `${Math.min(index * 70, 210)}ms` }}>
              <span className="process-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </Reveal>
        <div className="studio-note" id="about">
          <div className="studio-note__copy">
            <p className="eyebrow">The studio</p>
            <h3>Creative work from Lisbon.</h3>
            <p>
              Vangogh Productions works from Lisbon. The name is inspired by the creativity, originality and courage associated with Vincent van Gogh. There is no official relationship or endorsement.{' '}
              <Tag kind="verified">From the Brand Bible</Tag>
            </p>
            <p className="fineprint">The studio story and founder text are placeholders until supplied.</p>
          </div>
          <ul className="traits" aria-label="Brand personality">
            {TRAITS.map((trait) => <li key={trait}>{trait}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
