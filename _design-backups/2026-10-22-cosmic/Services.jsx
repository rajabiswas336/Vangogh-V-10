import SectionHead from './SectionHead.jsx'
import { GOALS, SERVICES } from '../data/site.js'
import { QUOTE_ONLY_SERVICES } from '../data/pricing.js'
import { useState } from 'react'
import Reveal from '../motion/Reveal.jsx'

export default function Services() {
  const [goal, setGoal] = useState('all')
  const shown = SERVICES.filter((service) => goal === 'all' || service.goals.includes(goal))

  return (
    <section className="section services-overview" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead id="services-title" title="Expertise & services">
          <p>Creative production and digital services, shaped around the work your project needs.</p>
        </SectionHead>
        <div className="chips" role="group" aria-label="Filter services by goal">
          {GOALS.map((item) => (
            <button key={item.id} className="chip" aria-pressed={goal === item.id} onClick={() => setGoal(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="sr" role="status">{shown.length} services shown</p>
        <ul className="service-grid">
          {shown.map((service, index) => (
            <Reveal as="li" key={service.id} className="card service-card" style={{ transitionDelay: `${Math.min(index * 45, 180)}ms` }}>
              <span className="service-card__index" aria-hidden="true">{String(SERVICES.indexOf(service) + 1).padStart(2, '0')}</span>
              <h3>{service.name}</h3>
              <p>{service.blurb}</p>
              <ul className="service-card__goals" aria-label="Relevant project goals">
                {service.goals.map((goalId) => <li key={goalId}>{GOALS.find((item) => item.id === goalId)?.label}</li>)}
              </ul>
            </Reveal>
          ))}
        </ul>
        <div className="services-overview__foot">
          <p><strong>{QUOTE_ONLY_SERVICES[0].label}</strong> · Quote-based to match supplier, materials and scope.</p>
          <a className="text-link" href="#pricing">Explore packages <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  )
}
