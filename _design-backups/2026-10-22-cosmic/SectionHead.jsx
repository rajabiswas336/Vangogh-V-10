import Reveal from '../motion/Reveal.jsx'

export default function SectionHead({ id, title, children }) {
  return (
    <Reveal as="div" className="section-head">
      <h2 id={id}>
        <span className="section-head__mask">
          <span className="section-head__title">{title}</span>
        </span>
      </h2>
      {children}
    </Reveal>
  )
}
