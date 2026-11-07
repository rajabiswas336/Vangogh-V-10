import { useEffect, useRef } from 'react'

// Uses the browser's built-in <dialog>: it traps focus, closes on Esc and restores focus for us.
export default function Lightbox({ items, index, onClose, onChange }) {
  const dialog = useRef(null)
  const item = items[index]

  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [])

  const step = (d) => onChange((index + d + items.length) % items.length)
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') step(-1)
    if (e.key === 'ArrowRight') step(1)
  }

  return (
    <dialog ref={dialog} className="lightbox" aria-label={`Larger view: ${item.label}`} onClose={onClose} onKeyDown={onKey}>
      <div className="lightbox__stage" onClick={(e) => e.target === e.currentTarget && dialog.current.close()}>
        <img className="lightbox__img" src={item.src} alt={item.alt} />
        <div className="lightbox__bar">
          {items.length > 1 && <button className="lightbox__btn" onClick={() => step(-1)} aria-label="Previous image">‹</button>}
          <p className="lightbox__count" aria-live="polite">{item.label} ({index + 1} of {items.length})</p>
          {items.length > 1 && <button className="lightbox__btn" onClick={() => step(1)} aria-label="Next image">›</button>}
          <button className="lightbox__btn lightbox__btn--close" onClick={() => dialog.current.close()}>Close</button>
        </div>
      </div>
    </dialog>
  )
}
