import { useCallback, useEffect, useRef, useState } from 'react'
import Tag from './Tag.jsx'
import { GUIDE_EVENT } from '../guide.js'
import { CONTACT_EMAIL } from '../data/site.js'
import { matchNovaRoutes, NOVA_EXPERTS, NOVA_SERVICE_ROUTES, createWhatsAppUrl } from '../data/nova.js'
import './Nova.css'

const WELCOME = 'Hi, I’m NOVA. I’ll point you to the right person at Vangogh Productions for your project. It takes less than a minute.'
const DISCLOSURE = 'Good to know: I’m a simple guide that matches the words you type to our services, not an AI. Nothing you type leaves this page.'

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
        <span className="nova-card__eyebrow">{secondary ? 'Also helpful' : 'Best match for you'}</span>
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
          Message on WhatsApp <span aria-hidden="true">↗</span>
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
      <p className="nova-card__draft-note">We prepare a short message for you. You can edit it, and nothing is sent until you press send in WhatsApp.</p>
    </article>
  )
}

export default function Orb() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [messages, setMessages] = useState(createWelcomeMessages)
  const [draft, setDraft] = useState('')
  const [routeChoices, setRouteChoices] = useState(NOVA_SERVICE_ROUTES)
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
    setRouteChoices(NOVA_SERVICE_ROUTES)
    setRecommendations([])
    setMatching(false)
    window.clearTimeout(matchingTimer.current)
  }

  useEffect(() => {
    const onOpen = () => {
      setMessages(createWelcomeMessages())
      setDraft('')
      setRouteChoices(NOVA_SERVICE_ROUTES)
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
      text: `Great choice. For ${(route.short ?? route.label).toLowerCase()}, ${primary.name} is the best person to talk to. Tap below to start a chat. You’ll see the message before anything is sent.`,
    }])
  }

  const chooseRoute = (route, addVisitorMessage = true) => {
    if (addVisitorMessage) setMessages((current) => [...current, { who: 'visitor', text: route.short ?? route.label }])
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
    setMessages((current) => [...current, { who: 'nova', text: 'Finding the right person', status: true }])
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
        text: 'Thanks! I’m not completely sure which area that is. Tap the closest option below, or simply email the studio and a real person will reply:',
        link: { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      }])
      return
    }

    const distinctExperts = [...new Set(matches.slice(0, 2).map(({ route }) => route.expertId))]
    if (matches.length > 1 && matches[0].score === matches[1].score && distinctExperts.length > 1) {
      setRouteChoices(matches.filter(({ score }) => score === matches[0].score).map(({ route }) => route))
      setMessages((current) => [...current, {
        who: 'nova',
        text: 'That could fit a couple of areas. Which one should we start with?',
      }])
      return
    }

    const otherMatches = matches.slice(1).filter(({ route, score }) => route.expertId !== matches[0].route.expertId && score >= matches[0].score - 1)
    recommend(matches[0].route, otherMatches)
    }, 260)
  }

  const notSure = () => {
    setMessages((current) => [...current,
      { who: 'visitor', text: 'I’m not sure yet' },
      { who: 'nova', text: 'No problem at all. Tell me in a few words what you’d like to achieve, for example “more customers from Instagram”, “a new menu for my restaurant” or “a video for my brand”.' },
    ])
    setRouteChoices([])
    input.current?.focus()
  }

  const restart = () => reset()
  const toggle = () => {
    if (open) close()
    else {
      setClosing(false)
      setOpen(true)
    }
  }

  const started = messages.some((message) => message.who === 'visitor')
  const flowStage = recommendations.length > 0 ? 4 : routeChoices.length > 0 && started ? 3 : matching || started ? 2 : 1

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
                <p>Your guide to the right expert</p>
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
                <span className="nova__flow-label">1 · Tell</span>
              </div>
              <span className={`nova__flow-connector ${flowStage >= 2 ? 'is-active' : ''}`} aria-hidden="true" />
              <div className={`nova__flow-node ${flowStage >= 2 ? 'is-active' : ''}`}>
                <span className="nova__flow-dot" aria-hidden="true" />
                <span className="nova__flow-label">2 · Match</span>
              </div>
              <span className={`nova__flow-connector ${flowStage >= 3 ? 'is-active' : ''}`} aria-hidden="true" />
              <div className={`nova__flow-node ${flowStage >= 3 ? 'is-active' : ''}`}>
                <span className="nova__flow-dot" aria-hidden="true" />
                <span className="nova__flow-label">3 · Choose</span>
              </div>
              <span className={`nova__flow-connector ${flowStage >= 4 ? 'is-active' : ''}`} aria-hidden="true" />
              <div className={`nova__flow-node ${flowStage >= 4 ? 'is-active' : ''}`}>
                <span className="nova__flow-dot" aria-hidden="true" />
                <span className="nova__flow-label">4 · Connect</span>
              </div>
            </div>
          </div>

          <div className="orb__log" role="log" aria-live="polite" aria-relevant="additions text" ref={logBox}>
            {!started && (
              <div className="nova__hello">
                <span className="nova__hello-orb" aria-hidden="true" />
                <p className="nova__hello-title">How can we help today?</p>
                <p className="nova__hello-sub">Pick a topic below or describe your idea in your own words.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <p key={`${message.who}-${index}`} className={`msg${message.who === 'visitor' ? ' msg--you' : ''}${message.quiet ? ' msg--quiet' : ''}${message.status ? ' nova-status' : ''}`} style={{ animationDelay: `${Math.min(index * 45, 180)}ms` }}>
                {message.text}{message.status && <span className="nova__typing" aria-hidden="true"><i /><i /><i /></span>}{message.link && <> <a href={message.link.href}>{message.link.label}</a></>}
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
              <div className="orb__options" role="group" aria-label="Choose a topic">
                {routeChoices.map((route) => (
                  <button key={route.id} className="chip" type="button" onClick={() => chooseRoute(route)}>{route.short ?? route.label}</button>
                ))}
                {!started && <button className="chip chip--soft" type="button" onClick={notSure}>I’m not sure yet</button>}
                <a className="chip chip--soft" href={`mailto:${CONTACT_EMAIL}`}>Email the studio</a>
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
              placeholder="Type your idea, e.g. a logo for my café"
              autoComplete="off"
            />
            <button className="nova__send" type="submit" disabled={!draft.trim() || matching} aria-label="Send">
              <span aria-hidden="true">↑</span>
            </button>
          </form>
          <p className="nova__footnote"><Tag kind="proposed">Private</Tag><span>Nothing you type is stored or sent. WhatsApp opens only if you choose it.</span></p>
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
