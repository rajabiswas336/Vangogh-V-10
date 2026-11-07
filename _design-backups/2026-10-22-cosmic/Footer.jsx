import Logo from './Logo.jsx'
import Tag from './Tag.jsx'
import { CONTACT_EMAIL, INSTAGRAM_URL } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <Logo size={120} />
        <div>
          <h2 className="footer__h">Contact</h2>
          <p><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a> <Tag kind="verified">Brand Bible</Tag></p>
          <p><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a></p>
          <p>Phone, address and company details: <Tag kind="placeholder">Pending confirmation</Tag></p>
        </div>
        <div>
          <h2 className="footer__h">Prototype notes</h2>
          <p>Nothing on this page is sent or stored. Colours and typefaces are provisional until verified.</p>
        </div>
      </div>
    </footer>
  )
}
