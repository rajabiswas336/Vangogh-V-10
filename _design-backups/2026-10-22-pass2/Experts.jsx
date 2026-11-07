import SectionHead from './SectionHead.jsx'
import { EXPERTS } from '../data/site.js'
import Reveal from '../motion/Reveal.jsx'

// Light "paper" panel. Editorial portrait wall: frames with crop marks, staggered
// heights, name in display type, role in mono. Same people, photos and links.
export default function Experts() {
  return (
    <section className="section experts-section cx-paper" id="experts" aria-labelledby="experts-title">
      <div className="container experts">
        <SectionHead id="experts-title" index="05" label="Experts" title="The people behind the work" />
        <ul className="cx-people">
          {EXPERTS.map((e, index) => (
            <Reveal as="li" key={e.id} className={`cx-person${index % 2 ? ' cx-person--low' : ''}`} style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }}>
              <div className="cx-person__frame">
                <img src={e.image} alt="" loading="lazy" decoding="async" />
                {e.id === 'e2' && (
                  <span className="cx-person__badge" aria-label="Specialization: Creative AI & Web Development">
                    <span className="cx-dot" aria-hidden="true" /> Creative AI &amp; Web
                  </span>
                )}
              </div>
              <div className="cx-person__text">
                <h3>{e.name}</h3>
                {e.role && <p className="cx-person__role">{e.role}</p>}
                {e.portfolio ? (
                  <a className="cx-link" href={e.portfolio} target="_blank" rel="noopener noreferrer" aria-label={`View ${e.name}'s portfolio (opens in a new tab)`}>
                    View portfolio <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="cx-person__pending">Portfolio link pending confirmation</span>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
