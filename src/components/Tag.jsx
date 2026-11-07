// Status label so unverified content is always visible.
const KINDS = { verified: 'Verified', proposed: 'Proposed', placeholder: 'Placeholder' }

export default function Tag({ kind = 'placeholder', children }) {
  return <span className={`tag tag--${kind}`}>{children || KINDS[kind]}</span>
}
