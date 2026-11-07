// One image thumbnail. The button's name carries the description, so the img itself is decorative.
export default function WorkTile({ item, onOpen }) {
  return (
    <li className="work-item">
      <button className="work-tile" onClick={onOpen} aria-label={`View larger: ${item.alt}`}>
        <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
        <span className="work-tile__label">{item.label}</span>
      </button>
    </li>
  )
}
