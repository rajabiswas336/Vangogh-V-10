import { GOALS, SERVICES, CONTACT_EMAIL } from './site.js'

// The guide follows this fixed script. It uses no AI and no network.
const goalNodes = Object.fromEntries(
  GOALS.filter((g) => g.id !== 'all').map((g) => {
    const names = SERVICES.filter((s) => s.goals.includes(g.id)).map((s) => s.name)
    return [
      'goal-' + g.id,
      {
        text: `For “${g.label.toLowerCase()}”, the active services are: ${names.join('; ')}. This is a pointer to the service list, not a quote. This prototype shows no prices or timelines.`,
        options: [
          { label: 'Try another goal', to: 'find' },
          { label: 'Start a project', to: 'project' },
        ],
      },
    ]
  }),
)

export const SCRIPT = {
  start: {
    text: 'Hi. I am a scripted prototype guide, not an AI. I can point you to a service or explain how a project enquiry will work. What would you like to do?',
    options: [
      { label: 'Find a service', to: 'find' },
      { label: 'Start a project', to: 'project' },
      { label: 'What is this guide?', to: 'about' },
    ],
  },
  find: {
    text: 'What are you trying to do?',
    options: [
      ...GOALS.filter((g) => g.id !== 'all').map((g) => ({ label: g.label, to: 'goal-' + g.id })),
      { label: 'Print or signage', to: 'print' },
    ],
  },
  print: {
    text: 'Printing and signage is delivered through partners, not produced in-house. The final cost depends on a supplier quote.',
    options: [
      { label: 'Try another goal', to: 'find' },
      { label: 'Start a project', to: 'project' },
    ],
  },
  project: {
    text: 'The guided enquiry is planned for the next build phase. This prototype cannot send or store anything you type, and it will not claim otherwise. If you want to reach the studio now, use the email below.',
    link: { label: CONTACT_EMAIL, href: 'mailto:' + CONTACT_EMAIL },
    options: [
      { label: 'Find a service', to: 'find' },
      { label: 'Back to start', to: 'start' },
    ],
  },
  about: {
    text: 'I follow a fixed script written for this prototype. I cannot answer open questions, I use no AI service, and nothing you click is sent anywhere.',
    options: [{ label: 'Back to start', to: 'start' }],
  },
  ...goalNodes,
}
