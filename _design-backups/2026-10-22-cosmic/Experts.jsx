import SectionHead from './SectionHead.jsx'
import { EXPERTS } from '../data/site.js'
import Reveal from '../motion/Reveal.jsx'

export default function Experts() {
  return (
    <section className="section experts-section" id="experts" aria-labelledby="experts-title">
      <div className="container experts">
        <SectionHead id="experts-title" title="The people behind the work" />
        <ul className="cards cards--experts">
          {EXPERTS.map((e, index) => (
            <Reveal
              as="li"
              key={e.id}
              className={`card card--expert${e.id === 'e2' ? ' card--expert-raja' : ''}`}
              style={{ transitionDelay: `${Math.min(index * 50, 200)}ms` }}
            >
              <div className={`expert__portrait${e.id === 'e2' ? ' expert__portrait--raja' : ''}`}>
                <img src={e.image} alt="" loading="lazy" decoding="async" />
                {e.id === 'e2' && (
                  <span className="expert__tech-badge" aria-label="Specialization: Creative AI & Web Development">
                    <span className="expert__tech-dot" aria-hidden="true" /> Creative AI &amp; Web
                  </span>
                )}
              </div>
              <div className="expert__details">
                <h3>{e.name}</h3>
                {e.role && <p className="expert__role">{e.role}</p>}
                {e.portfolio ? (
                  <a
                    className="expert__portfolio"
                    href={e.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${e.name}'s portfolio (opens in a new tab)`}
                  >
                    View Portfolio <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="expert__portfolio expert__portfolio--pending">
                    Portfolio link pending confirmation
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
