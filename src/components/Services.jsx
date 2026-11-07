import { useState } from 'react'
import SectionHead from './SectionHead.jsx'
import { GOALS, SERVICES } from '../data/site.js'
import { QUOTE_ONLY_SERVICES } from '../data/pricing.js'
import Reveal from '../motion/Reveal.jsx'

// Light "paper" panel. An index of the seven services: hover, focus or tap a
// name and the detail card on the left updates. Goal chips filter the list.
export default function Services() {
  const [goal, setGoal] = useState('all')
  const [activeId, setActiveId] = useState(SERVICES[0].id)
  const shown = SERVICES.filter((service) => goal === 'all' || service.goals.includes(goal))
  const active = shown.find((s) => s.id === activeId) || shown[0] || SERVICES[0]
  const activeIndex = SERVICES.indexOf(active)

  return (
    <section className="section services-overview cx-paper" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead id="services-title" index="02" label="Services" title="One studio, seven ways in.">
          <p>Creative production and digital services, shaped around the work your project needs.</p>
        </SectionHead>

        <div className="cx-chips" role="group" aria-label="Filter services by goal">
          {GOALS.map((item) => (
            <button key={item.id} className="cx-chip" aria-pressed={goal === item.id} onClick={() => setGoal(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="sr" role="status">{shown.length} services shown</p>

        <div className="cx-services">
          <Reveal as="aside" className="cx-services__detail" aria-live="polite">
            <span className="cx-services__num" aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')}</span>
            <h3>{active.name}</h3>
            <p>{active.blurb}</p>
            <ul className="cx-services__goals" aria-label="Relevant project goals">
              {active.goals.map((goalId) => <li key={goalId}>{GOALS.find((item) => item.id === goalId)?.label}</li>)}
            </ul>
            <a className="cx-btn cx-btn--ink" href="#pricing">See packages <span aria-hidden="true">→</span></a>
          </Reveal>

          <ul className="cx-services__list">
            {shown.map((service) => {
              const n = String(SERVICES.indexOf(service) + 1).padStart(2, '0')
              const on = service.id === active.id
              return (
                <li key={service.id}>
                  <button
                    type="button"
                    className={`cx-services__item${on ? ' is-active' : ''}`}
                    aria-pressed={on}
                    onMouseEnter={() => setActiveId(service.id)}
                    onFocus={() => setActiveId(service.id)}
                    onClick={() => setActiveId(service.id)}
                  >
                    <span className="cx-services__item-num" aria-hidden="true">{n}</span>
                    <span className="cx-services__item-name">{service.name}</span>
                    <span className="cx-services__item-arrow" aria-hidden="true">→</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="cx-services__foot">
          <p><strong>{QUOTE_ONLY_SERVICES[0].label}</strong> · Quote-based to match supplier, materials and scope.</p>
          <a className="cx-link" href="#pricing">Explore packages <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  )
}
