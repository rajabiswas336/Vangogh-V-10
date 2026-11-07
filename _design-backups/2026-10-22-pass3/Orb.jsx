import { useCallback, useEffect, useRef, useState } from 'react'
import Tag from './Tag.jsx'
import { GUIDE_EVENT } from '../guide.js'
import { CONTACT_EMAIL } from '../data/site.js'
import { matchNovaRoutes, NOVA_EXPERTS, NOVA_SERVICE_ROUTES, createWhatsAppUrl } from '../data/nova.js'
import './Nova.css'

const WELCOME = 'Hi, I’m NOVA — your creative project guide. Tell me a little about what you’re planning, and I’ll help you find the right service and the right person to speak with.'
const DISCLOSURE = 'I use local service-keyword matching, not AI. I may ask you to clarify. Nothing you type is sent or stored here.'

const createWelcomeMessages = () => [
  { who: 'nova', text: WELCOME },
  { who: 'nova', text: DISCLOSURE, quiet: true },
]

function Recommendation({ expert, route, reason, secondary = false }) {
  const messageContext = route.serviceContext
  const contactRole = expert.role ?? expert.contactContext

  return (
    <article className={`nova-card${secondary ? ' nova-card--secondary' : ''}`}>
      <div className="nova-card__copy">
        <span className="nova-card__eyebrow">{secondary ? 'Optional additional contact' : 'Suggested contact'}</span>
        <h3>{expert.name}</h3>
        <p className="nova-card__role">{contactRole}</p>
        <p>{reason}</p>
      </div>
      <div className="nova-card__actions">
        <a
          className="btn btn--primary nova-card__whatsapp"
          href={createWhatsAppUrl(expert, messageContext)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open a WhatsApp draft about ${messageContext} for ${expert.name} (opens in a new tab)`}
        >
          Open WhatsApp draft <span aria-hidden="true">↗</span>
        </a>
        {expert.portfolio && (
          <a
            className="nova-card__portfolio"
            href={expert.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${expert.name}’s portfolio (opens in a new tab)`}
          >
            View portfolio <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
      <p className="nova-card__draft-note">Opens WhatsApp with a prepared message. Nothing is sent until you press send there.</p>
    </article>
  )
}

export default function Orb() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [messages, setMessages] = useState(createWelcomeMessages)
  const [draft, setDraft] = useState('')
  const [routeChoices, setRouteChoices] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [matching, setMatching] = useState(false)
  const button = useRef(null)
  const input = useRef(null)
  const logBox = useRef(null)
  const closingTimer = useRef(0)
  const matchingTimer = useRef(0)

  const finalizeClose = useCallback(() => {
    window.clearTimeout(closingTimer.current)
    window.clearTimeout(matchingTimer.current)
    setOpen(false)
    setClosing(false)
    setMatching(false)
    button.current?.focus()
  }, [])

  const close = useCallback(() => {
    if (open && !closing) {
      setClosing(true)
      window.clearTimeout(closingTimer.current)
      closingTimer.current = window.setTimeout(finalizeClose, 260)
    }
  }, [open, closing, finalizeClose])

  const reset = () => {
    setMessages(createWelcomeMessages())
    setDraft('')
    setRouteChoices([])
    setRecommendations([])
    setMatching(false)
    window.clearTimeout(matchingTimer.current)
  }

  useEffect(() => {
    const onOpen = () => {
      setMessages(createWelcomeMessages())
      setDraft('')
      setRouteChoices([])
      setRecommendations([])
      setMatching(false)
      setClosing(false)
      setOpen(true)
    }
    window.addEventListener(GUIDE_EVENT, onOpen)
    return () => window.removeEventListener(GUIDE_EVENT, onOpen)
  }, [])

  useEffect(() => () => {
    window.clearTimeout(closingTimer.current)
    window.clearTimeout(matchingTimer.current)
  }, [])

  useEffect(() => {
    if (open && !closing) input.current?.focus()
  }, [open, closing, matching])

  useEffect(() => {
    if (!open) return undefined
    const onEscape = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [open, closing, close])

  useEffect(() => {
    if (logBox.current) logBox.current.scrollTop = logBox.current.scrollHeight
  }, [messages, routeChoices, recommendations])

  const finishClose = (event) => {
    if (event.target !== event.currentTarget || event.animationName !== 'nova-panel-out') return
    finalizeClose()
  }

  const recommend = (route, otherMatches = []) => {
    const primary = NOVA_EXPERTS.find((expert) => expert.id === route.expertId)
    if (!primary) return

    const chosen = [{ expert: primary, route, reason: route.reason, secondary: false }]
    const alreadyShown = new Set([primary.id])

    const optionalMatch = otherMatches.find(({ route: otherRoute }) => !alreadyShown.has(otherRoute.expertId))
    if (optionalMatch && chosen.length < 2) {
      const otherExpert = NOVA_EXPERTS.find((expert) => expert.id === optionalMatch.route.expertId)
      if (otherExpert) {
        chosen.push({ expert: otherExpert, route: optionalMatch.route, reason: optionalMatch.route.reason, secondary: true })
        alreadyShown.add(otherExpert.id)
      }
    }

    if (chosen.length === 1 && route.additionalExpertId) {
      const additional = NOVA_EXPERTS.find((expert) => expert.id === route.additionalExpertId)
      if (additional) {
        chosen.push({
          expert: additional,
          route,
          reason: 'Shawan is listed as an additional graphic-design contact if another design perspective would help.',
          secondary: true,
        })
      }
    }

    setRouteChoices([])
    setRecommendations(chosen.slice(0, 2))
    setMessages((current) => [...current, {
      who: 'nova',
      text: `For ${route.label.toLowerCase()}, I’d start with ${primary.name}. You can review the draft message before deciding whether to send it.`,
    }])
  }

  const chooseRoute = (route, addVisitorMessage = true) => {
    if (addVisitorMessage) setMessages((current) => [...current, { who: 'visitor', text: route.label }])
    recommend(route)
  }

  const submit = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setMessages((current) => [...current, { who: 'visitor', text }])
    setDraft('')
    input.current?.focus()
    setRecommendations([])
    setMatching(true)
    setMessages((current) => [...current, { who: 'nova', text: 'Matching your request to a service…', status: true }])
    window.clearTimeout(matchingTimer.current)
    matchingTimer.current = window.setTimeout(() => {
      setMatching(false)
      setMessages((current) => current.filter((message) => !message.status))
      if (open && !closing) input.current?.focus()
      const matches = matchNovaRoutes(text)
    if (!matches.length) {
      setRouteChoices(NOVA_SERVICE_ROUTES)
      setMessages((current) => [...current, {
        who: 'nova',
        text: 'I couldn’t confidently match that to a contact. Which area is closest? For campaign management or another request without a mapped specialist, you can contact the studio by email.',
        link: { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      }])
      return
    }

    const distinctExperts = [...new Set(matches.slice(0, 2).map(({ route }) => route.expertId))]
    if (matches.length > 1 && matches[0].score === matches[1].score && distinctExperts.length > 1) {
      setRouteChoices(matches.filter(({ score }) => score === matches[0].score).map(({ route }) => route))
      setMessages((current) => [...current, {
        who: 'nova',
        text: 'A couple of areas could fit. Which one would you like to focus on first?',
      }])
      return
    }

    const otherMatches = matches.slice(1).filter(({ route, score }) => route.expertId !== matches[0].route.expertId && score >= matches[0].score - 1)
    recommend(matches[0].route, otherMatches)
    }, 260)
  }

  const restart = () => reset()
  const toggle = () => {
    if (open) close()
    else {
      setClosing(false)
      setOpen(true)
    }
  }

  const flowStage = recommendations.length > 0 ? 4 : routeChoices.length > 0 ? 3 : matching ? 2 : 1

  return (
    <div className="orb">
      {open && (
        <section
          id="nova-panel"
          className={`orb__panel${closing ? ' is-closing' : ''}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby="nova-title"
          onKeyDown={(event) => event.key === 'Escape' && close()}
          onAnimationEnd={finishClose}
        >
          <header className="orb__head">
            <div className="nova__identity">
              <span className="nova__mark" aria-hidden="true"><span /></span>
              <div>
                <h2 id="nova-title">NOVA</h2>
                <p>Creative project guide</p>
              </div>
            </div>
            <div className="nova__head-actions">
              <button className="nova__restart" type="button" onClick={restart}>Start over</button>
              <button className="orb__close" type="button" onClick={close} aria-label="Close NOVA">×</button>
            </div>
          </header>

          <div className="nova__flow-plan" aria-label="NOVA interaction flow pipeline">
            <div className="nova__flow-track">
              <div className={`nova__flow-node ${flowStage >= 1 ? 'is-active' : ''}`}>
                <span className="nova__flow-dot" aria-hidden="true" />
                <span className="nova__flow-label">1. Brief</span>
              </div>
              <span className={`nova__flow-connector ${flowStage >= 2 ? 'is-active' : ''}`} aria-hidden="true" />
              <div className={`nova__flow-node ${flowStage >= 2 ? 'is-active' : ''}`}>
                <span className="nova__flow-dot" aria-hidden="true" />
                <span className="nova__flow-label">2. Match</span>
              </div>
              <span className={`nova__flow-connector ${flowStage >= 3 ? 'is-active' : ''}`} aria-hidden="true" />
              <div className={`nova__flow-node ${flowStage >= 3 ? 'is-active' : ''}`}>
                <span className="nova__flow-dot" aria-hidden="true" />
                <span className="nova__flow-label">3. Route</span>
              </div>
              <span className={`nova__flow-connector ${flowStage >= 4 ? 'is-active' : ''}`} aria-hidden="true" />
              <div className={`nova__flow-node ${flowStage >= 4 ? 'is-active' : ''}`}>
                <span className="nova__flow-dot" aria-hidden="true" />
                <span className="nova__flow-label">4. Direct Contact</span>
              </div>
            </div>
          </div>

          <div className="orb__log" role="log" aria-live="polite" aria-relevant="additions text" ref={logBox}>
            {messages.map((message, index) => (
              <p key={`${message.who}-${index}`} className={`msg${message.who === 'visitor' ? ' msg--you' : ''}${message.quiet ? ' msg--quiet' : ''}${message.status ? ' nova-status' : ''}`} style={{ animationDelay: `${Math.min(index * 45, 180)}ms` }}>
                {message.text}{message.link && <> <a href={message.link.href}>{message.link.label}</a></>}
              </p>
            ))}

            {recommendations.length > 0 && (
              <div className="nova__recommendations" aria-label="Suggested contacts">
                {recommendations.map(({ expert, route, reason, secondary }) => (
                  <Recommendation key={expert.id} expert={expert} route={route} reason={reason} secondary={secondary} />
                ))}
              </div>
            )}

            {routeChoices.length > 0 && (
              <div className="orb__options" role="group" aria-label="Choose a service area">
                {routeChoices.map((route) => (
                  <button key={route.id} className="chip" type="button" onClick={() => chooseRoute(route)}>{route.label}</button>
                ))}
              </div>
            )}
          </div>

          <form className="nova__composer" onSubmit={submit}>
            <label className="sr" htmlFor="nova-message">Describe your project</label>
            <input
              id="nova-message"
              ref={input}
              type="text"
              value={draft}
              maxLength={500}
              disabled={matching}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="What are you planning?"
              autoComplete="off"
            />
            <button className="nova__send" type="submit" disabled={!draft.trim() || matching} aria-label="Match your project description">
              <span aria-hidden="true">↑</span>
            </button>
          </form>
          <p className="nova__footnote"><Tag kind="proposed">Local prototype</Tag><span>WhatsApp opens only when you choose it. You review and send the message yourself.</span></p>
        </section>
      )}
      <button
        ref={button}
        className="orb__btn"
        type="button"
        aria-expanded={open}
        aria-controls={open ? 'nova-panel' : undefined}
        aria-label={open ? 'Close NOVA creative project guide' : 'Open NOVA creative project guide'}
        onClick={toggle}
      >
        <span className="orb__core" aria-hidden="true" />
      </button>
    </div>
  )
}
