import SectionHead from './SectionHead.jsx'
import Tag from './Tag.jsx'
import { WORK_PLACEHOLDERS } from '../data/site.js'

export default function WorkPreview() {
  return (
    <section className="section container" id="work" aria-labelledby="work-title">
      <SectionHead id="work-title" title="Selected work">
        <p>Projects appear here only with client permission and verified details.</p>
      </SectionHead>
      <ul className="cards cards--work">
        {WORK_PLACEHOLDERS.map((w) => (
          <li key={w.id} className="card card--work">
            <div className="work-thumb" aria-hidden="true" />
            <h3>{w.title}</h3>
            <Tag kind="placeholder">No approved work yet</Tag>
          </li>
        ))}
      </ul>
    </section>
  )
}
