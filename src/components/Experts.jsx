import SectionHead from './SectionHead.jsx'
import { EXPERTS } from '../data/site.js'
import Reveal from '../motion/Reveal.jsx'

// Light "paper" panel. Editorial portrait wall: frames with crop marks, staggered
// heights, name in display type, role in mono. Same people, photos and links.
// Every card is treated the same way: no extra badge on any one portrait.
export default function Experts() {
  return (
    <section className="section experts-section cx-paper" id="experts" aria-labelledby="experts-title">
      <div className="container experts">
        <SectionHead id="experts-title" index="05" label="Experts" title="The people behind the work" />
        <ul className="cx-people">
          {EXPERTS.map((e, index) => (
            <Reveal as="li" key={e.id} className={`cx-person${index % 2 ? ' cx-person--low' : ''}`} style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }}>
              <div className="cx-person__frame">
                {e.image ? (
                  <img src={e.image} alt="" loading="lazy" decoding="async" />
                ) : (
                  <div className="cx-person__placeholder">
                    <span aria-hidden="true">{e.name.split(' ').filter((w) => !/^md$/i.test(w)).map((w) => w[0]).slice(0, 2).join('')}</span>
                    <span className="cx-person__badge">Placeholder · photo pending</span>
                  </div>
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
