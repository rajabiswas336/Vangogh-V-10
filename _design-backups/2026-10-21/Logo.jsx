export default function Logo({ size = 64 }) {
  return (
    <span className="logo" style={{ '--logo': `${size}px` }}>
      <img
        src="/logo/Vangogh%20Logo%20F-01.png"
        alt="Vangogh Productions"
        width="8000"
        height="8000"
        decoding="async"
      />
    </span>
  )
}