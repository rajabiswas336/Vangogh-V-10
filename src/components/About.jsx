import SectionHead from './SectionHead.jsx'
import Tag from './Tag.jsx'
import { TRAITS } from '../data/site.js'

export default function About() {
  return (
    <section className="section container about" id="about" aria-labelledby="about-title">
      <SectionHead id="about-title" title="About the studio">
        <p>
          Vangogh Productions works from Lisbon. The name is inspired by the creativity, originality and courage associated with Vincent van Gogh. There is no official relationship or endorsement. <Tag kind="verified">From the Brand Bible</Tag>
        </p>
      </SectionHead>
      <ul className="traits" aria-label="Brand personality">
        {TRAITS.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <p className="fineprint">The studio story and founder text are placeholders until supplied.</p>
    </section>
  )
}
