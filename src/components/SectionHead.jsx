import Reveal from '../motion/Reveal.jsx'

// index + label are optional: they render a small mono line such as "02 / Services".
export default function SectionHead({ id, title, index, label, children }) {
  return (
    <Reveal as="div" className="section-head">
      {(index || label) && (
        <p className="cx-kicker">
          {index && <span className="cx-kicker__index">{index}</span>}
          {index && label && <span aria-hidden="true"> / </span>}
          {label}
        </p>
      )}
      <h2 id={id}>
        <span className="section-head__mask">
          <span className="section-head__title">{title}</span>
        </span>
      </h2>
      {children}
    </Reveal>
  )
}
