import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const MotionContext = createContext(null)
const STORAGE_KEY = 'vangogh-motion-paused'

function readSavedPause() {
  try { return window.localStorage.getItem(STORAGE_KEY) === 'true' } catch { return false }
}

export function MotionProvider({ children }) {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [userPaused, setUserPausedState] = useState(readSavedPause)
  const slots = useRef(new Map())
  const allowed = !reduced && !userPaused

  const updateGrants = useCallback(() => {
    const eligible = !document.hidden
      ? [...slots.current.values()].filter((slot) => slot.wants && slot.inView).sort((a, b) => b.priority - a.priority)
      : []
    const winners = new Set(eligible.slice(0, 2).map((slot) => slot.id))
    for (const slot of slots.current.values()) {
      const next = winners.has(slot.id)
      if (slot.granted !== next) {
        slot.granted = next
        slot.setGranted(next)
      }
    }
  }, [])

  const registerVideo = useCallback((id, priority, node, setGranted) => {
    const slot = { id, priority, node, setGranted, wants: false, granted: false, inView: !('IntersectionObserver' in window), observer: null }
    slots.current.set(id, slot)
    if ('IntersectionObserver' in window) {
      slot.observer = new IntersectionObserver(([entry]) => {
        slot.inView = entry.isIntersecting
        updateGrants()
      }, { threshold: 0.01, rootMargin: '80px' })
      slot.observer.observe(node)
    }
    updateGrants()
    return () => {
      slot.observer?.disconnect()
      slots.current.delete(id)
      if (slot.granted) setGranted(false)
      updateGrants()
    }
  }, [updateGrants])

  const setVideoIntent = useCallback((id, wants) => {
    const slot = slots.current.get(id)
    if (!slot || slot.wants === wants) return
    slot.wants = wants
    updateGrants()
  }, [updateGrants])

  const setUserPaused = useCallback((value) => {
    setUserPausedState(value)
    try { window.localStorage.setItem(STORAGE_KEY, String(value)) } catch { /* Storage can be unavailable in private browsing. */ }
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = (event) => setReduced(event.matches)
    if (preference.addEventListener) preference.addEventListener('change', update)
    else preference.addListener?.(update)
    return () => {
      if (preference.removeEventListener) preference.removeEventListener('change', update)
      else preference.removeListener?.(update)
    }
  }, [])

  useEffect(() => {
    if (userPaused) document.documentElement.dataset.motionPaused = 'true'
    else delete document.documentElement.dataset.motionPaused
    return () => { delete document.documentElement.dataset.motionPaused }
  }, [userPaused])

  useEffect(() => {
    const update = () => updateGrants()
    document.addEventListener('visibilitychange', update)
    updateGrants()
    return () => document.removeEventListener('visibilitychange', update)
  }, [allowed, updateGrants])

  const value = useMemo(() => ({ reduced, userPaused, setUserPaused, motionAllowed: allowed, registerVideo, setVideoIntent, updateGrants }), [reduced, userPaused, setUserPaused, allowed, registerVideo, setVideoIntent, updateGrants])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotionSettings() {
  const value = useContext(MotionContext)
  if (!value) throw new Error('Motion hooks must be used inside MotionProvider.')
  return value
}

export function useMotionAllowed() {
  return useMotionSettings().motionAllowed
}

export function useVideoSlot(id, priority = 0, { autoPlay = true } = {}) {
  const { motionAllowed, registerVideo, setVideoIntent } = useMotionSettings()
  const [node, setNode] = useState(null)
  const [granted, setGranted] = useState(false)
  const [manualIntent, setManualIntent] = useState(false)
  const intent = autoPlay ? motionAllowed : manualIntent
  const slotPriority = priority + (!autoPlay ? 1000 : 0)

  useEffect(() => {
    if (!node) return undefined
    return registerVideo(id, slotPriority, node, setGranted)
  }, [id, node, slotPriority, registerVideo])

  useEffect(() => setVideoIntent(id, intent), [id, intent, node, setVideoIntent])

  useEffect(() => {
    if (!node) return
    if (granted && intent && !document.hidden) node.play().catch(() => {})
    else node.pause()
  }, [node, granted, intent, motionAllowed])

  const activate = useCallback(() => { if (!autoPlay) setManualIntent(true) }, [autoPlay])
  const deactivate = useCallback(() => { if (!autoPlay) setManualIntent(false) }, [autoPlay])
  return { videoRef: setNode, motionAllowed, granted, activate, deactivate }
}
