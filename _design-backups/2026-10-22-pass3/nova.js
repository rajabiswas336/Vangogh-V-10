// NOVA uses local keyword matching only. Keep expert identity, links, routes,
// and WhatsApp destinations together here so routing can be reviewed safely.
export const NOVA_EXPERTS = [
  {
    id: 'e1',
    name: 'Shaikat Majumder',
    role: 'Founder, Creative Designer',
    contactContext: 'Primary contact for visual-production enquiries',
    image: '/Expert/Shaikat Majumder/WhatsApp Image 2026-09-07 at 10.24.51 PM.jpeg',
    portfolio: '/Expert/Portfolios/shaikat-majumder-portfolio.html',
    phone: '+351 920 103 086',
    whatsapp: 'https://wa.me/351920103086',
  },
  {
    id: 'e2',
    name: 'Raja Biswas',
    role: 'Founder, Creative AI Developer',
    contactContext: 'Primary contact for creative-AI enquiries',
    image: '/Expert/Raja Biswas/Screenshot 2026-10-16 191928.jpg',
    portfolio: 'https://rajabiswas.netlify.app/',
    phone: '+91 99331 27070',
    whatsapp: 'https://wa.me/919933127070',
  },
  {
    id: 'e3',
    name: 'Md Arifuzzaman',
    role: 'Marketer & Tour Planner',
    contactContext: 'Suggested contact for tourism-planning enquiries',
    image: '/Expert/MD Arifuzzan/Gemini_Generated_Image_8akp8y8akp8y8akp.png',
    portfolio: '/Expert/Portfolios/md-arifuzzaman-portfolio.html',
    phone: '+351 920 608 763',
    whatsapp: 'https://wa.me/351920608763',
  },
  {
    id: 'e4',
    name: 'Md Nahidul Islam',
    role: 'Software Engineer',
    contactContext: 'Suggested contact for software and technical enquiries',
    image: '/Expert/Md Nahidul Islam/Gemini_Generated_Image_oxorwqoxorwqoxor.png',
    portfolio: '/Expert/Portfolios/md-nahidul-islam-portfolio.html',
    phone: '+33 7 51 41 33 10',
    whatsapp: 'https://wa.me/33751413310',
  },
  {
    id: 'e5',
    name: 'Shawan Majumder',
    role: 'Graphic Designer',
    contactContext: 'Additional graphic-design support',
    image: '/Expert/Shawan Majumder/ChatGPT Image Sep 11, 2026, 08_59_11 AM.png',
    portfolio: '/Expert/Portfolios/shawan-majumder-portfolio.html',
    phone: '+91 80135 47743',
    whatsapp: 'https://wa.me/918013547743',
  },
]

export const NOVA_SERVICE_ROUTES = [
  {
    id: 'visual-design',
    label: 'Branding, graphic design, print, or visual identity',
    serviceContext: 'a branding or graphic-design project',
    expertId: 'e1',
    additionalExpertId: 'e5',
    keywords: ['branding', 'brand identity', 'visual identity', 'graphic design', 'graphic', 'design', 'logo design', 'print design', 'menu design', 'brochure', 'banner', 'signage', 'poster'],
    reason: 'Your request maps to Shaikat’s creative-design profile.',
  },
  {
    id: 'photography',
    label: 'Photography or a photo shoot',
    serviceContext: 'a photography project',
    expertId: 'e1',
    keywords: ['photography', 'photographer', 'photograph', 'photo shoot', 'photoshoot', 'product photos', 'food photography'],
    reason: 'Your request maps to Shaikat for visual-production enquiries.',
  },
  {
    id: 'videography',
    label: 'Videography, motion, or a brand film',
    serviceContext: 'a videography or motion project',
    expertId: 'e1',
    keywords: ['videography', 'video production', 'brand film', 'cinematography', 'motion graphics', 'video', 'reel', 'short film'],
    reason: 'Your request maps to Shaikat for visual-production enquiries.',
  },
  {
    id: 'social-content',
    label: 'Social-media visuals or content production',
    serviceContext: 'social-media content production',
    expertId: 'e1',
    keywords: ['social media content', 'social media visuals', 'social posts', 'campaign visuals', 'content production'],
    reason: 'This route is for creating visual content, rather than managing campaigns.',
  },
  {
    id: 'creative-ai',
    label: 'AI creative production or creative-AI workflows',
    serviceContext: 'creative-AI production',
    expertId: 'e2',
    keywords: ['creative ai', 'ai creative', 'ai visuals', 'ai image', 'ai video', 'ai', 'generative', 'prompt workflow', 'ai workflow', 'artificial intelligence'],
    reason: 'Your request maps to Raja’s creative-AI profile.',
  },
  {
    id: 'tourism',
    label: 'Tourism planning, a trip, or an itinerary',
    serviceContext: 'tourism planning or an itinerary',
    expertId: 'e3',
    keywords: ['tourism', 'itinerary', 'travel planning', 'travel', 'trip planning', 'destination promotion', 'travel itinerary', 'plan a trip'],
    reason: 'Md Arifuzzaman is the contact mapped to tourism-planning enquiries.',
  },
  {
    id: 'software',
    label: 'Software, website, or technical development',
    serviceContext: 'a software or technical project',
    expertId: 'e4',
    keywords: ['software', 'software development', 'web development', 'website development', 'website', 'web app', 'application development', 'technical project', 'coding', 'programming', 'api', 'integration'],
    reason: 'Md Nahidul Islam is the contact mapped to software and technical enquiries.',
  },
]

const normalize = (value) => value
  .toLocaleLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

export function matchNovaRoutes(message) {
  const query = ` ${normalize(message)} `
  if (!query.trim()) return []

  return NOVA_SERVICE_ROUTES
    .map((route) => {
      const matchedKeywords = route.keywords.filter((keyword) => query.includes(` ${normalize(keyword)} `))
      return { route, score: matchedKeywords.length, matchedKeywords }
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function createWhatsAppUrl(expert, serviceContext) {
  const message = `Hi ${expert.name}, I’m interested in discussing ${serviceContext} with Vangogh Productions. Could we talk about the requirements and next steps?`
  return `${expert.whatsapp}?text=${encodeURIComponent(message)}`
}

