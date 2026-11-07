// All homepage content lives here, apart from the components.
// verification: 'verified' (Brand Bible) | 'proposed' | 'placeholder'
export { NOVA_EXPERTS as EXPERTS } from './nova.js'

export const CONTACT_EMAIL = 'vangoghproductions.eu@gmail.com' // verified: Brand Bible
export const INSTAGRAM_URL = 'https://www.instagram.com/vangogh_productions/' // verified: Brand Bible

export const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Experts', href: '#experts' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

export const GOALS = [
  { id: 'all', label: 'All services' },
  { id: 'brand', label: 'Build a brand' },
  { id: 'audience', label: 'Reach an audience' },
  { id: 'web', label: 'Launch a website' },
  { id: 'visuals', label: 'Create images or film' },
  { id: 'travel', label: 'Plan a trip' },
]

// Active services only (Brand Bible, section 03). Short summaries adapted from the Bible.
export const SERVICES = [
  { id: 'branding', name: 'Branding & Graphic Design', goals: ['brand'], blurb: 'Concepts, layouts, assets and brand guidelines.' },
  { id: 'social', name: 'Social Media & Digital Marketing', goals: ['audience'], blurb: 'Strategy, content calendars, content and reporting.' },
  { id: 'web', name: 'Website Development', goals: ['web'], blurb: 'Site structure, responsive design, code and quality checks.' },
  { id: 'photo', name: 'Photography', goals: ['visuals'], blurb: 'Shot lists, lighting plans and retouching guidance.' },
  { id: 'video', name: 'Videography & Motion', goals: ['visuals'], blurb: 'Scripts, storyboards, edit plans and sound.' },
  { id: 'ai', name: 'AI Creative Production', goals: ['audience', 'visuals'], blurb: 'Prompting, generation, variants and human quality checks.' },
  { id: 'tourism', name: 'Tourism Planning', goals: ['travel'], blurb: 'Itinerary research and destination content.' },
]

export const WORK_PLACEHOLDERS = [
  { id: 'w1', title: 'Project slot 1' },
  { id: 'w2', title: 'Project slot 2' },
  { id: 'w3', title: 'Project slot 3' },
]

// Personality traits: Brand Bible, section 01.
export const TRAITS = ['Confident', 'Creative', 'Modern', 'Human', 'Strategic', 'Experimental']
