export default function SplitText({ text, className = '', delay = 0, stagger = 75 }) {
  const words = text.split(' ')

  return (
    <span className={`kinetic-line ${className}`.trim()} aria-hidden="true">
      {words.map((word, i) => (
        <span key={i} className="kinetic-word-mask">
          <span
            className="kinetic-word"
            style={{ animationDelay: `${delay + i * stagger}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  )
}
