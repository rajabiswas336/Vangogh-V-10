# Vangogh Productions — Project Master Context

Handoff date: 2026-10-26 · Prepared by Claude (documentation only; no website files were changed)
Project root: `D:\Vangogh Productions workspace\Brand Stand\vangogh-website`

## How to read the evidence labels

| Label | Meaning |
|---|---|
| **[SOURCE]** | Read directly from a project file on 2026-10-26. |
| **[BIBLE-C]** / **[BIBLE-M]** | Read from the text extracts of the Client Brand Bible / Master AI Brand Bible (`qa-reports/client-brand-bible-extracted.txt`, `qa-reports/master-brand-bible-extracted.txt`). The original PDFs were not re-read today. |
| **[BROWSER 22-Oct]** | Checked by Claude in a live browser on 2026-10-22 (last browser check). Not re-checked today. |
| **[REPORTED]** | Stated in an earlier agent report (Antigravity / Codex). Not independently verified by Claude. |
| **[OWNER]** | Decision or instruction the owner (Saikat) gave in conversation. |
| **[PROPOSED]** | Suggestion not yet approved. |
| **[PLACEHOLDER]** / **[PLANNED]** / **[UNKNOWN]** | Missing content / future service / insufficient evidence. |

---

## 1. Business identity

| Item | Value | Evidence |
|---|---|---|
| Brand | Vangogh Productions | [BIBLE-M] |
| Base | Lisbon, Portugal | [BIBLE-M] [BIBLE-C] |
| Positioning | Creative production studio + digital marketing/branding agency | [BIBLE-M] |
| Client-facing line | "A creative partner for brands that want to be seen, understood and remembered." | [BIBLE-C] [SOURCE `index.html`, `Hero.jsx`] |
| Inspiration | Creativity, originality and courage associated with Vincent van Gogh; no official relationship or endorsement | [BIBLE-M] [BIBLE-C] [SOURCE `Process.jsx`] |
| Personality | Confident, creative, modern, human, strategic, experimental | [BIBLE-M] [SOURCE `site.js` `TRAITS`] |
| Voice | "Confident & Human"; clear English by default; no inflated promises, no virality guarantees | [BIBLE-M] |
| Production model | Remote AI/digital work plus on-location photo and video in Lisbon and Portugal | [BIBLE-C] |
| Ambition | "Phased creative/technology ecosystem" | [BIBLE-M] |

### Target audience
[UNKNOWN] as a formal written segment. The Bibles describe "businesses" and brands; the site's portfolio is mainly Lisbon restaurants, food, hospitality and local businesses ([SOURCE] portfolio file names). Treat any narrower audience as a proposal.

### Contact details

| Channel | Value | Evidence |
|---|---|---|
| Email | vangoghproductions.eu@gmail.com | [SOURCE `site.js`] [BIBLE-C] |
| Instagram | https://www.instagram.com/vangogh_productions/ | [SOURCE `site.js`] [BIBLE-C] |
| LinkedIn | https://www.linkedin.com/in/vangogh-productions-219173403/ | [BIBLE-C] [BIBLE-M]. Not used on the site. |
| Facebook | https://www.facebook.com/profile.php?id=61582253826656 | [BIBLE-C]. Not used on the site. |
| Website | https://www.vangoghproductions.com/ | [BIBLE-C] [BIBLE-M]. Whether this domain is live or owned is [UNKNOWN]. |
| Phone, address, legal company details | Not on the site; footer shows "Pending confirmation" | [SOURCE `Footer.jsx`] [PLACEHOLDER] |

## 2. Services and status

From [SOURCE `src/data/site.js`], matching [BIBLE-C] and [BIBLE-M] status tables.

| Service (site name) | Status | Site summary |
|---|---|---|
| Branding & Graphic Design | Active | Concepts, layouts, assets and brand guidelines. |
| Social Media & Digital Marketing | Active | Strategy, content calendars, content and reporting. |
| Website Development | Active | Site structure, responsive design, code and quality checks. |
| Photography | Active | Shot lists, lighting plans and retouching guidance. |
| Videography & Motion | Active | Scripts, storyboards, edit plans and sound. |
| AI Creative Production | Active | Prompting, generation, variants and human quality checks. |
| Tourism Planning | Active | Itinerary research and destination content. |
| Printing & Signage | Partner-delivered, supplier quote | [SOURCE `pricing.js` `QUOTE_ONLY_SERVICES`] |
| Student / Visa Guidance | **Planned**. Must never be advertised as active. | [BIBLE-C] [BIBLE-M] |
| Chatbots / AI automation / creative marketplace | **Planned**. Must never be advertised as active. | [BIBLE-C] [BIBLE-M] |

Goal filters used on the site ([SOURCE `site.js` `GOALS`]): All services · Build a brand · Reach an audience · Launch a website · Create images or film · Plan a trip.

## 3. Team and contact routing

Source of the site's team data: [SOURCE `src/data/nova.js` `NOVA_EXPERTS`] (re-exported as `EXPERTS` from `site.js`).

| ID | Name | Role on the site | Role in Client Bible [BIBLE-C] | Portfolio link | WhatsApp routing |
|---|---|---|---|---|---|
| e1 | Shaikat Majumder | Founder, Creative Designer | Co-Founder & Creative Director (also "Sam") | `/Expert/Portfolios/shaikat-majumder-portfolio.html` | wa.me/351920103086 |
| e2 | Raja Biswas | Founder, Creative AI Developer | Co-Founder & AI Technology Lead | https://rajabiswas.netlify.app/ | wa.me/919933127070 |
| e3 | Md Arifuzzaman | Marketer & Tour Planner | Tour Planner & Tourism Development Specialist (**provisional title**) | `/Expert/Portfolios/md-arifuzzaman-portfolio.html` | wa.me/351920608763 |
| e4 | Md Nahidul Islam | Software Engineer | Software Engineer & Web Developer | `/Expert/Portfolios/md-nahidul-islam-portfolio.html` | wa.me/33751413310 |
| e5 | Shawan Majumder | Graphic Designer | Graphic Designer & Branding Specialist | `/Expert/Portfolios/shawan-majumder-portfolio.html` | wa.me/918013547743 |

- **Inconsistency:** every role title on the site differs from the Client Bible. The owner must choose one set before launch.
- Shaikat and Raja are peer co-founders; no hierarchy is implied [BIBLE-C].
- These WhatsApp numbers are published business routing in client-side code [SOURCE]. Whether each person consents to public display is [UNKNOWN].
- **NOVA routing** [SOURCE `nova.js` `NOVA_SERVICE_ROUTES`]:
  - Branding, graphic design and print, plus photography, videography and social content, go to **Shaikat** (Shawan is an additional design contact).
  - Creative AI goes to **Raja**.
  - Tourism goes to **Md Arifuzzaman**.
  - Software and websites go to **Md Nahidul Islam**.
  - Campaign management or anything unmatched goes to the studio email.

## 4. Website goals, sitemap and user journeys

- **Primary goal:** qualified project enquiries. Main CTA: "Start a Project" [OWNER].
- **Structure:** a single page in `App.jsx` order [SOURCE]:

| # | Section (component) | Anchor | Surface |
|---|---|---|---|
| — | Intro: bird-flock murmuration forming "VANGOGH", then the white logo (`IntroMurmuration`) | overlay | dark |
| — | Header (`Header`) | — | dark glass |
| 0 | Hero (`Hero`) | `#top` | dark sky |
| 01 | Work, 6 glass folders + gallery + lightbox (`WorkPreview`) | `#work` | dark sky |
| — | Client Stories, polaroid carousel (`ClientStories`) | `#stories` | dark sky |
| 02 | Services index (`Services`) | `#services` | light "paper" panel |
| 03 | Process, constellation timeline + studio note (`Process`) | `#process`, `#about` | dark |
| 05 | Experts portrait wall (`Experts`) | `#experts` | light panel |
| 06 | Pricing (`Pricing`) | `#pricing` | light panel |
| 07 | CTA "Have a project in mind?" (`CtaBand`) | `#enquiry` | dark |
| — | Footer (`Footer`) | — | dark |
| — | NOVA floating assistant (`Orb`) | fixed | dark glass |

- **Navigation** [SOURCE `site.js` `NAV`]: Home, Work, Services, Process, Experts, Pricing, About. There is no nav link to Client Stories.
- **Journeys:**
  1. Hero → "Start a Project" → NOVA → topic → expert card → WhatsApp draft (the visitor sends it themselves).
  2. Hero → Work folders → open folder → file → lightbox.
  3. Services index → "See packages" → Pricing → "Start a Project" (opens NOVA).
  4. NOVA → "Email the studio" (mailto).

## 5. Design system (current, provisional)

All colours and fonts remain **provisional** until the owner approves them [OWNER] [BIBLE-M] [BIBLE-C].

- **Fonts** [SOURCE `index.html`, `index.css`, `cosmic.css`], loaded from Google Fonts:
  - Fraunces (display, `--serif`)
  - Geist (text, `--sans`)
  - Geist Mono (labels, `--mono`)
  - Caveat (handwritten polaroid captions)
- **Colour tokens** [SOURCE `src/styles/cosmic.css` `:root`]:
  - Night: `--night #070a18`, `--night-2 #0d1430`
  - Paper: `--paper-bg #f6f4ef`, `--paper-ink #0b1022`, `--paper-soft #4a5168`
  - Text on dark: `--star #eef1ff`, `--star-soft #aab3d9`
  - Blues and gold: `--electric #2864d7`, `--electric-deep #1f4fc0`, `--neon #4d86ff`, `--sky #8fb2ff`, `--gold-c #d5b56a`
  - Accent glows: indigo `#2e3192`, electric `#0050e8`, cyan `#6fe3ff`, violet `#8a6bff`, warm gold `#e7cc8a`. These come from the logo gradient and appear as literals in the CSS.
- **Bible palettes for comparison:**
  - Master: `#10182B` / `#2864D7` / `#76A8FF` / `#D5B56A` / `#F2F5FA` [BIBLE-M]
  - Client: `#0B1530` / `#2864D7` / `#6BA4FF` / `#D8B76A` / `#F3F6FC` [BIBLE-C]
  - The two Bibles conflict with each other, and the site uses a third set. All three are marked "proposed / working".
- **Surfaces:** "Cosmic Atelier". Dark sections float over an animated Van Gogh-inspired starry sky; Services, Experts and Pricing sit on light paper panels with 24–44 px radius [SOURCE].
- **Spacing and layout tokens** [SOURCE `index.css`]: `--max 1200px`, `--gutter clamp(1.25rem,5vw,4.5rem)`, `--section-space clamp(5rem,9vw,8.5rem)`, radius `--radius-sm…xl` = 0.75 / 1.25 / 1.75 / 2.25 rem.
- **Responsive breakpoints in `cosmic.css`:** 1100 px (experts 3 columns), 900 px (single-column hero, services, studio; 2-column process), 700 px (mobile polaroids and folders), 600 px (stacked buttons, smaller header logo).
- **Logo** [SOURCE `Logo.jsx`, `public/logo/`]:
  - Official variants [OWNER]: blue logo + black text (`F-01`), blue logo + white text (`F-02`), white logo (`F-03`).
  - `F-04`–`F-06` (black, icon-only, wordmark-only) are **not official**.
  - The header and footer use the white symbol and two-line wordmark side by side. These are web copies in `public/logo/web/`, trimmed of empty margin and scaled down. The owner approved this re-arrangement for readability on 2026-10-21 [OWNER]. The originals are untouched.

## 6. Brand Bible references and known inconsistencies

| # | Topic | Client Bible | Master Bible | Website | Status |
|---|---|---|---|---|---|
| 1 | Prices | "After 10% reduction" prices, e.g. Branding Basic €135 | Higher reference prices, e.g. Branding Basic €150, Website Basic €650 | Uses the Client Bible prices exactly | Owner approval needed |
| 2 | New-client offer | Extra 15% off, applied **after** the 10% (sequential, effective 23.5%) | "Intro offer 10–20% only on selected launch offers… **No stacking**" | **Publicly shows** "New-client offer · 15% off" on every tier | **Conflict; launch blocker** |
| 3 | Palette | `#0B1530`… | `#10182B`… | cosmic tokens (§5) | Owner approval needed |
| 4 | Team titles | See §3 | — | Shorter titles | Owner must pick |
| 5 | Process steps | 6 steps: Discover, Scope, Plan, Produce, Review, Deliver | — | 4 steps: Define the brief, Plan the work, Create & review, Deliver with clarity | Content decision |
| 6 | Bible version | File named "v4 Warm Ivory"; text says "Version 3.0 · 16 October 2026" | Updated 16 Oct 2026 [OWNER] | — | Clarify |
| 7 | Fonts | "Editorial headings + clean sans" | Same; licensed fonts unconfirmed | Fraunces / Geist (Google Fonts, free licence) | Owner approval needed |

The owner asked for a full reconciliation (conflict register, recommendations, structured questions, then final Bibles). It has **not** been done yet.

## 7. Animation, motion and interaction concepts

Implemented (see `DESIGN_AND_ANIMATION_HISTORY.md` for evidence):

1. **Intro murmuration.** About 3,000 canvas starlings gather into "VANGOGH", scatter, and the white logo fades in.
   - Total length about 7 s, with a skip button and click-anywhere to skip.
   - Skipped entirely when reduced motion is on.
   - Currently replays on **every** load (`ONCE_PER_SESSION = false`, review mode).
2. **StarryNight sky.** A fixed canvas inspired by "The Starry Night" (1889, public domain), painted in code rather than copied:
   - Swirling brushstroke particles on a trail layer, with large stars in rotating halo rings.
   - A crescent moon, three depths of twinkling stars, and scroll/pointer parallax.
   - Big stars are kept out of the headline zone. Reduced motion draws one still frame.
3. **Hero:**
   - Kinetic word-rise headline ("Ideas with courage. / Production with control.") with an italic gradient second line.
   - Brand film inside a 16:9 "screen" with an orb glow and a slight 3D tilt that flattens on hover.
   - A service ticker marquee that pauses on hover.
4. **Work glass folders.** An adapted 21st.dev "Glass Folder Cards" component:
   - Frosted-glass folders tilt to the pointer and lean on hover.
   - Clicking opens a folder and fans out its files; choosing a file opens the lightbox.
5. **Client Stories polaroids.** Cards hang from a gold string with wooden pegs and sway gently.
   - 3D carousel: the active card is in front; side cards are rotated, smaller and dimmer.
   - Previous/Next buttons, a counter, arrow keys and swipe.
6. **Services index.** Hover or focus updates a dark detail card; rows shift and show an arrow.
7. **Process constellation.** Twinkling star nodes sit on a glowing gradient line; an ambient video plays behind at low opacity.
8. **Section reveals.** `Reveal.jsx` fade/translate and heading mask reveals from batch 28.
9. **NOVA.**
   - Planet launcher with a rotating aurora ring and an orbiting moon.
   - Glass panel with a gradient edge and drifting aurora.
   - Floating welcome orb, typing dots and a glowing step tracker.
10. **Global pause toggle** in the header (`MotionProvider`, `html[data-motion-paused]`) and full `prefers-reduced-motion` support.

**Proposed but not implemented:**
- The Design-canvas prototypes from 21 Oct (Direction C "Atelier + Screening Room", the film-frame homepage and the murmuration hero board). They live in the Claude Design artifact "Vangogh Website Redesign" and were superseded by the implemented Cosmic design.
- The earlier "Daylight Atelier" direction was approved in Phase 1. It was later replaced by the owner's instructions: cinematic dark (18 Oct), then dark + white with a starry night (21 Oct) [OWNER].

## 8. Functionality

| Feature | Behaviour | Evidence |
|---|---|---|
| NOVA assistant | Local keyword matching (no AI, no network). Topic quick-picks, an "I'm not sure yet" helper and an email link. Expert recommendation cards with **WhatsApp draft** links (`wa.me/...?text=`). Nothing is sent until the visitor presses send in WhatsApp. Esc closes. "Start over" resets. | [SOURCE `Orb.jsx`, `nova.js`] [BROWSER 22-Oct: routing for "logo for my cafe" → Shaikat + Shawan] |
| Enquiry | No form backend. "Start a Project" opens NOVA through the `vangogh:open-guide` event (`guide.js`). The CTA text says the enquiry "is a local demo… does not send anything". | [SOURCE] |
| Navigation | Sticky glass header with an active-section highlight. Mobile menu button. Header hides at page end on ≤640 px. Motion pause toggle. | [SOURCE `Header.jsx`] |
| Portfolio | 6 categories, 26 images + 2 videos. Featured mix, category galleries, lightbox (`<dialog>`), H.264 playback copies for the `.MOV` files. | [SOURCE] [REPORTED batch 27: all images load] |
| Client Stories | Uses `src/data/reviews.js`. It is empty, so 6 real portfolio images are shown with "Placeholder · review pending". A review only appears with `permission: true`. | [SOURCE] [BROWSER 22-Oct] |
| Pricing | Service tabs, three tiers each, offer price, notes and a disclaimer. Printing is quote-only. | [SOURCE `Pricing.jsx`] |

## 9. Pricing data (as coded today)

Source: [SOURCE `src/data/pricing.js`]. EUR; standard → new-client offer (`Math.round(standard × 0.85)`).

| Service | Tiers | Billing |
|---|---|---|
| Branding & Graphic Design | Basic €135 → €115 · Standard €405 → €344 · Premium €855 → €727 | One-off project |
| Social Media Management | Basic €315 → €268 · Standard €585 → €497 · Premium €945 → €803 | Monthly retainer |
| Website Development | Basic €585 → €497 · Standard €1125 → €956 · Premium €2160 → €1836 | One-off project |
| Photography | Basic €225 → €191 · Standard €405 → €344 · Premium €765 → €650 | Session |
| Videography & Motion | Basic €405 → €344 · Standard €765 → €650 · Premium €1440 → €1224 | One-off project |
| AI Creative | Basic €108 → €92 · Standard €315 → €268 · Premium €675 → €574 | One-off project |
| Tourism Planning | Basic €81 → €69 · Standard €198 → €168 · Premium €405 → €344 | Consultation (Standard and Premium tiers say "One-off project") |
| Printing & Signage | Supplier quote | Partner-delivered |

These match the Client Bible's "after 10%" and "extra 15% off" columns exactly (checked against `client-brand-bible-extracted.txt`). **Do not change prices without owner approval.**

## 10. Restrictions (must carry into any new project)

1. Never redraw, recolour, stretch or regenerate the logo. Use only the original files or the approved web copies.
2. No invented clients, reviews, testimonials, results, awards, prices or expert details.
3. Show client names, logos or work only with permission. The current portfolio shows client brand names (e.g. Taverna do Marisco, Siam Thai Massage, Thai Time, Arrozaria, O Cerveirense, Next Level, Casa de Dura). Permission is [UNKNOWN].
4. Exclude the Disney+ clone from the public portfolio [OWNER].
5. NOVA must stay honest: a scripted keyword guide, not AI. Nothing is sent or stored.
6. Never claim an enquiry was sent or stored without a real, tested backend.
7. Planned services must not be advertised as active.
8. No deploy, publish, purchase, commit or push without the owner's explicit approval.
9. No secrets in client code. (None found; the project has no API keys.)

## 11. Technical stack (summary)

React 19.2 + Vite 8.3 + `@vitejs/plugin-react` 6, Oxlint 1.81. No router, no CSS framework, no runtime dependencies beyond React. Plain CSS. No backend. Details are in `SOURCE_CODE_AND_ARCHITECTURE.md`.

## 12. Hosting and deployment

- **Not deployed.** No hosting account, deployment config or CI exists in the project [SOURCE].
- **Local only:**
  - `Start Website.bat` runs `npm.cmd run dev -- --open`.
  - Dev URL: `http://localhost:5173/`.
  - On Windows PowerShell use `npm.cmd`.
- **Proposed:** Vercel or Netlify free tier on a temporary subdomain first, then a custom domain. The owner must create the account. The owner answered "no preference" to the hosting and domain questions on 2026-10-21.
- **No Git repository:** history is protected only by folder backups.

## 13. Known issues and launch requirements (short list)

Full prioritised list: `CURRENT_STATE_AND_NEXT_STEPS.md`.

- The new-client offer is shown publicly while unapproved and in conflict between the Bibles.
- Lint and production build have **not** been run since the 21–22 Oct redesign.
- Client-name permissions, team titles, the palette and the fonts are unconfirmed.
- No legal pages (privacy, imprint/company details), no real enquiry destination beyond WhatsApp and email, no analytics, no official favicon (`public/favicon.svg` dates from template creation and is likely the default; [UNKNOWN] content).
- Heavy media: some portfolio PNGs are 18–23 MB and some expert PNGs 7–8 MB.
- The intro replays on every load (review mode).
