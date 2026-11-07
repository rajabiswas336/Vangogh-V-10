import { useState } from 'react'
import SectionHead from './SectionHead.jsx'
import { openGuide } from '../guide.js'
import { PRICING_SERVICES, QUOTE_ONLY_SERVICES } from '../data/pricing.js'

const euro = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function PackageTier({ item }) {
  const suffix = item.billingModel === 'Monthly retainer' ? ' / month' : ''

  return (
    <article className={`pricing-tier${item.tier === 'Standard' ? ' pricing-tier--standard' : ''}`}>
      <h4>{item.tier}</h4>
      <div className="pricing-tier__prices">
        <span className="pricing-tier__standard">Standard</span>
        <strong className="pricing-tier__price">{euro.format(item.standardPriceEUR)}{suffix}</strong>
      </div>
      <div className="pricing-tier__offer">
        <span className="pricing-tier__offer-label">New-client offer · 15% off</span>
        <strong className="pricing-tier__price">{euro.format(item.newClientOfferPriceEUR)}{suffix}</strong>
      </div>
      <p className="pricing-tier__billing-note">{item.billingModel}</p>
      <details>
        <summary>View inclusions</summary>
        <ul className="pricing-tier__deliverables">
          {item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
        </ul>
      </details>
    </article>
  )
}

export default function Pricing() {
  const [activeId, setActiveId] = useState(PRICING_SERVICES[0]?.id ?? '')
  const selected = PRICING_SERVICES.find((service) => service.id === activeId) ?? PRICING_SERVICES[0]

  return (
    <section className="section pricing-preview" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHead id="pricing-title" index="06" label="Pricing" title="Packages, with scope in view">
          <p>Explore starting prices and inclusions. Final quotes depend on the agreed scope.</p>
        </SectionHead>
        <div className="pricing-layout">
          <nav className="pricing-nav" aria-label="Choose a service package">
            {PRICING_SERVICES.map((service) => (
              <button
                className="pricing-nav__item"
                type="button"
                key={service.id}
                aria-pressed={activeId === service.id}
                onClick={() => setActiveId(service.id)}
              >
                <span>{service.label}</span><span aria-hidden="true">↗</span>
              </button>
            ))}
            {QUOTE_ONLY_SERVICES.map((service) => (
              <button
                className="pricing-nav__item"
                type="button"
                key={service.id}
                onClick={() => openGuide('project')}
              >
                <span>{service.label}</span><span className="pricing-nav__quote">Request quote</span>
              </button>
            ))}
          </nav>
          {selected && (
            <article className="pricing-service" aria-labelledby="selected-pricing-title">
              <header className="pricing-service__head">
                <div>
                  <h3 id="selected-pricing-title">{selected.label}</h3>
                  <p>{selected.notes}</p>
                </div>
                <span className="pricing-service__billing">{selected.billingModel}</span>
              </header>
              <div className="pricing-tiers" aria-label={`${selected.label} packages`}>
                {selected.packages.map((item) => <PackageTier key={item.tier} item={item} />)}
              </div>
              <p className="pricing-disclaimer">Offer amounts are calculated as 15% off the displayed standard price, rounded to the nearest whole euro. Applicable taxes are additional where applicable.</p>
            </article>
          )}
        </div>
        <div className="pricing-quote">
          <div>
            <h3>Need a tailored scope?</h3>
            <p>Tell us what you have in mind and use the package details as a starting point for a conversation.</p>
          </div>
          <button className="btn btn--gold" onClick={() => openGuide('project')}>Discuss a project <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </section>
  )
}
