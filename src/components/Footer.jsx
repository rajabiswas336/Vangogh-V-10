import Logo from './Logo.jsx'
import Tag from './Tag.jsx'
import { CONTACT_EMAIL, INSTAGRAM_URL, NAV } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="footer cx-footer">
      <div className="container">
        <div className="cx-footer__top">
          <Logo size={110} />
          <p className="cx-footer__line">Ideas with courage. <em>Production with control.</em></p>
        </div>
        <div className="cx-footer__grid">
          <div>
            <h2 className="cx-footer__h">Contact</h2>
            <p><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a> <Tag kind="verified">Brand Bible</Tag></p>
            <p><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram ↗</a></p>
            <p>Phone, address and company details: <Tag kind="placeholder">Pending confirmation</Tag></p>
          </div>
          <nav aria-label="Footer">
            <h2 className="cx-footer__h">Explore</h2>
            <ul className="cx-footer__nav">
              {NAV.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}
            </ul>
          </nav>
          <div>
            <h2 className="cx-footer__h">Prototype notes</h2>
            <p>Nothing on this page is sent or stored. Colours and typefaces are provisional until verified.</p>
          </div>
        </div>
        <p className="cx-footer__base"><span>Lisbon, Portugal</span><span>38.7223° N, 9.1393° W</span></p>
      </div>
    </footer>
  )
}
