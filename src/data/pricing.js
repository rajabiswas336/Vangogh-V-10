// Public EUR pricing proposal selected from the Client Brand Bible.
// New-client offer prices use one consistent rule: nearest whole euro
// (Math.round) after applying a single 15% reduction to the listed price.
const packageTier = (tier, standardPriceEUR, deliverables, billingModel = 'One-off project') => ({
  tier,
  standardPriceEUR,
  newClientOfferPriceEUR: Math.round(standardPriceEUR * 0.85),
  billingModel,
  deliverables,
})

export const PRICING_SERVICES = [
  {
    id: 'branding',
    label: 'Branding & Graphic Design',
    billingModel: 'One-off project',
    fixedPackagePrice: true,
    packages: [
      packageTier('Basic', 135, ['One focused design deliverable or a small set', 'One creative direction', 'One revision']),
      packageTier('Standard', 405, ['Compact visual kit or campaign set, up to 5 assets', 'Two rounds of revisions']),
      packageTier('Premium', 855, ['Starter brand system or campaign suite, up to 10 agreed assets', 'Usage sheet', 'Two rounds of revisions']),
    ],
    notes: 'Additional directions, assets or revisions may require a revised scope. Usage rights and final handover are agreed in writing.',
  },
  {
    id: 'social',
    label: 'Social Media Management',
    billingModel: 'Monthly retainer',
    fixedPackagePrice: true,
    packages: [
      packageTier('Basic', 315, ['One platform', 'Up to 8 content pieces per month', 'Captions, calendar, scheduling and a basic summary'], 'Monthly retainer'),
      packageTier('Standard', 585, ['Up to 2 platforms and 12 pieces per month', 'Includes up to 4 short videos', 'Community checks and a monthly report'], 'Monthly retainer'),
      packageTier('Premium', 945, ['Up to 3 platforms and 16 pieces per month', 'Includes up to 6 short videos', 'Agreed community management, strategy review and report'], 'Monthly retainer'),
    ],
    notes: 'Paid media spend and third-party tool charges are separate unless listed in the agreed scope.',
  },
  {
    id: 'web',
    label: 'Website Development',
    billingModel: 'One-off project',
    fixedPackagePrice: true,
    packages: [
      packageTier('Basic', 585, ['1–3 responsive pages', 'Contact form', 'Basic on-page SEO', 'Two rounds of revisions']),
      packageTier('Standard', 1125, ['4–6 responsive pages', 'Contact form and analytics setup', 'SEO foundations', 'Two rounds of revisions']),
      packageTier('Premium', 2160, ['7–10 pages with a tailored layout', 'Advanced features as agreed', 'Analytics and SEO foundations', 'Three rounds of revisions']),
    ],
    notes: 'Domain, hosting, maintenance and third-party charges are separate unless the written quote includes them. Ongoing SEO is not included.',
  },
  {
    id: 'photo',
    label: 'Photography',
    billingModel: 'Session',
    fixedPackagePrice: true,
    packages: [
      packageTier('Basic', 225, ['Up to 1 hour', '8 edited selects', 'Nearby location'], 'Session'),
      packageTier('Standard', 405, ['Up to 2 hours', '20 edited selects', 'Shot list and colour grading'], 'Session'),
      packageTier('Premium', 765, ['Up to 4 hours', '40 edited selects', 'Expanded shot list'], 'Session'),
    ],
    notes: 'RAW files are excluded unless stated. Travel, studio, styling or model fees, delivery timing and usage rights are agreed separately where applicable.',
  },
  {
    id: 'video',
    label: 'Videography & Motion',
    billingModel: 'One-off project',
    fixedPackagePrice: true,
    packages: [
      packageTier('Basic', 405, ['Compact shoot', 'One edited vertical video up to 30 seconds']),
      packageTier('Standard', 765, ['Up to a half-day shoot', 'Two edits up to 45 seconds each', 'Subtitles and social exports']),
      packageTier('Premium', 1440, ['Up to one shoot day', 'Three shorts, or one main edit plus two cutdowns']),
    ],
    notes: 'Crew, locations, shoot hours, formats, music, raw footage, talent, drone work, rush delivery and usage rights are scoped in the written quote.',
  },
  {
    id: 'ai',
    label: 'AI Creative',
    billingModel: 'One-off project',
    fixedPackagePrice: true,
    packages: [
      packageTier('Basic', 108, ['One simple AI-assisted visual or short edit', 'One format', 'One revision']),
      packageTier('Standard', 315, ['Up to 3 assets or one video up to 20 seconds', 'Two revisions']),
      packageTier('Premium', 675, ['Up to 5 assets or one 30–45 second video plus a cutdown', 'Consistency quality check']),
    ],
    notes: 'Tool credits may be separate if not listed. Work receives human quality review; reach, virality and exact generated output are not guaranteed.',
  },
  {
    id: 'tourism',
    label: 'Tourism Planning',
    billingModel: 'Consultation',
    fixedPackagePrice: true,
    packages: [
      packageTier('Basic', 81, ['One consultation up to 60 minutes', 'Notes'], 'Consultation'),
      packageTier('Standard', 198, ['Tailored short itinerary', 'Route logic, activity ideas and useful links'], 'One-off project'),
      packageTier('Premium', 405, ['Detailed multi-day itinerary', 'Practical timing and destination content ideas', 'One review'], 'One-off project'),
    ],
    notes: 'Bookings, tickets, transport and accommodation are excluded unless separately agreed and permitted.',
  },
]

export const QUOTE_ONLY_SERVICES = [
  {
    id: 'printing',
    label: 'Printing & Signage',
    billingModel: 'Supplier quote',
    fixedPackagePrice: false,
    notes: 'Partner-delivered. Final pricing depends on the supplier, materials, format and agreed scope.',
  },
]
