# Vangogh Productions Website — Source Code and Architecture

Handoff date: 2026-10-26 · All facts below come from files read on this date unless marked otherwise.
Project root: `D:\Vangogh Productions workspace\Brand Stand\vangogh-website`
Latest source change on disk: 2026-10-22 (file timestamps). Nothing has changed since.

## 1. Stack and commands

| Item | Value |
|---|---|
| Framework | React `^19.2.8`, React DOM `^19.2.8` |
| Build tool | Vite `^8.3.0` with `@vitejs/plugin-react ^6.1.1` |
| Linter | Oxlint `^1.81.0`; `.oxlintrc.json` enables `react` and `oxc` plugins, `react/rules-of-hooks` = error, `react/only-export-components` = warn |
| Language | JavaScript (JSX). No TypeScript in the app. The `@types/*` packages are installed but unused. |
| Styling | Plain CSS files, no framework |
| Router / state / backend | None. Single page. React state only. |
| Runtime dependencies | React only. External fonts load from Google Fonts in `index.html`. |

Commands (Windows PowerShell needs `npm.cmd` because of the execution policy):

| Purpose | Command |
|---|---|
| Dev server | `npm.cmd run dev` → `http://localhost:5173/` (or double-click `Start Website.bat`) |
| Production build | `npm.cmd run build` → `dist/` |
| Lint | `npm.cmd run lint` |
| Preview build | `npm.cmd run preview` |
| Regenerate portfolio manifest | `node scripts/generate-portfolio.mjs` (writes `src/data/portfolio.generated.js`) |

Last known results, all [REPORTED] by earlier agents and **not re-run since the 21–22 Oct redesign**:
- Build passed.
- Lint showed 0 errors and 3 Fast-Refresh warnings in `MotionProvider.jsx`.

`vite.config.js` includes a custom build plugin, `omit-original-hero-video-from-dist`. It deletes large source media from `dist/` after the build:
- the 127 MB `Brand Intro Hero video.mp4`
- five 14 MB source loops
- five concept board PNGs

## 2. Folder map (what matters)

```
vangogh-website/
├─ index.html                 meta/OG/Twitter tags, Google Fonts link, theme-color
├─ vite.config.js             React plugin + omit-original-hero-video plugin
├─ package.json / package-lock.json / .oxlintrc.json / .gitignore
├─ Start Website.bat          double-click launcher (npm.cmd run dev -- --open)
├─ scripts/generate-portfolio.mjs   builds portfolio manifest from public/Portfolio Samples
├─ generate-portfolio.mjs     duplicate of the script above (housekeeping)
├─ src/
│  ├─ main.jsx               StrictMode + <MotionProvider><App/>
│  ├─ App.jsx                page composition and CSS import order
│  ├─ guide.js               "vangogh:open-guide" event bridge (opens NOVA)
│  ├─ index.css              base tokens (--serif/--sans/--mono, spacing, radius), reset, reduced-motion base
│  ├─ App.css                original component styles (header, buttons, cards, pricing, footer…), 787 lines
│  ├─ styles/typography-motion.css   batch-28 type scale, kinetic words, section-head reveals
│  ├─ styles/cosmic.css      CURRENT design layer, loaded last (538 lines)
│  ├─ styles/futuristic.css  previous "Signal" theme. NOT imported (inactive)
│  ├─ motion/MotionProvider.jsx  reduced-motion, user pause, 2-video playback scheduler
│  ├─ motion/Reveal.jsx      IntersectionObserver reveal wrapper (default/block/stagger)
│  ├─ data/…                 all business content (see §5)
│  └─ components/…           see §3
├─ public/
│  ├─ logo/                  original logo PNGs F-01…F-06 (8333×8333, transparent) + web/ copies
│  ├─ Expert/                expert photos + static portfolio HTML pages
│  ├─ Media/Hero/            hero-background.mp4 (in use), hero-poster.jpg, hero-reflection.jpg, Brand Intro original
│  ├─ Media/Portfolio/       H.264 playback copies of the two .MOV videos + preview poster
│  ├─ Media/Website-Loops/   ambient loop (in use) + source loops (excluded from build)
│  ├─ Media/Website-Concepts/ concept boards + covers/brand-direction-concept.jpg (in use)
│  └─ Portfolio Samples/     six category folders (real client work)
├─ qa-reports/               batch 27/28 reports, motion register, hashes, Bible text extracts
├─ qa-screenshots/           batch 27–32 screenshot folders
├─ .local-backups/           earlier agents' pre-edit snapshots (steps 14–26, batches 27–32)
├─ _design-backups/          Claude's pre-edit backups (2026-10-21, 2026-10-22-cosmic, -pass2, -pass3)
├─ Reference/                owner's 7 inspiration screenshots
├─ dist/                     old build output (stale; date of last build unknown)
├─ src - Copy/               old duplicate of src (housekeeping)
└─ ffmpeg-9.0.2-essentials_build.zip   114 MB tool archive in project root (housekeeping)
```

## 3. Components and responsibilities

**Active components** (imported through `App.jsx`):

| File | Responsibility | Key dependencies |
|---|---|---|
| `App.jsx` | Order: `StarryNight`, skip link, `Header`, `<main>` (`Hero`, `WorkPreview`, `ClientStories`, `Services`, `Process`, `Experts`, `Pricing`, `CtaBand`), `Footer`, `Orb`, `IntroMurmuration`. CSS order: `App.css` → `typography-motion.css` → component CSS → `cosmic.css`. | — |
| `StarryNight.jsx` | Fixed full-screen canvas, the Van Gogh-inspired sky. Brushstroke particles on an offscreen trail canvas; vortex flow field; 4–7 haloed big stars kept out of the headline zone; crescent moon; tiny twinkling stars; scroll and pointer parallax. Pauses on hidden tabs; reduced motion gives one still frame. | none |
| `IntroMurmuration.jsx` | First-view overlay. A canvas flock forms "VANGOGH", scatters, then the white logo appears. Timeline runs on real time with a safety timeout; skip button; locks page scroll while open. **`ONCE_PER_SESSION = false`** (review mode). | `public/logo/web/vangogh-logo-white-tight.png` |
| `Header.jsx` | Sticky header, logo, nav from `NAV`, active-section observer, mobile menu, motion pause toggle, "Start a Project" (→ `openGuide`), end-of-page release on ≤640 px. | `Logo`, `site.js`, `guide.js`, `MotionProvider` |
| `Logo.jsx` | Renders the white (`dark` variant) or blue/black (`light`) **symbol + two-line wordmark side by side** from `public/logo/web/*`. `size` = row height. | — |
| `Hero.jsx` (+ `Hero.css`) | `cx-hero` markup: meta line, `SplitText` kinetic headline, lede, CTAs, scroll cue, 16:9 `cx-screen` with `hero-background.mp4` (poster `hero-poster.jpg`) and HUD labels, service ticker. Video plays through `useVideoSlot('hero-brand-film', 100)`. **Most of `Hero.css` targets the old `.hero__*` / `.frame` markup and is now largely unused.** | `SplitText`, `site.js`, `MotionProvider`, `guide.js` |
| `WorkPreview.jsx` (+ `WorkPreview.css`) | Six `GlassFolder`s (one per category, cover image + 4 real samples). "All …" buttons, featured/category gallery (`WorkTile`, `WorkVideo`), `Lightbox`. `WorkPreview.css` still styles the gallery, tiles and lightbox; its `.category-reel*` rules are obsolete and hidden by `cosmic.css`. | `GlassFolder`, `portfolio.js` |
| `GlassFolder.jsx` | 21st.dev "Glass Folder Cards" converted from TSX to JSX (behaviour unchanged). Generated liquid art, frosted front, pointer tilt, open/fan, menu, own embedded CSS (`GF_CSS`), global Esc/pointerdown listeners only while open. | React only |
| `ClientStories.jsx` | Polaroid 3D carousel. Real reviews come from `reviews.js` (`permission: true` only); otherwise 6 real portfolio images with placeholder text and a tag. Buttons, counter, ArrowLeft/Right, swipe (pointer delta > 40 px). | `reviews.js`, `portfolio.js` |
| `Services.jsx` | Paper panel. Goal filter chips plus an interactive index; hover, focus or click updates the sticky dark detail card. Printing note. | `site.js`, `pricing.js`, `Reveal` |
| `Process.jsx` | Dark section. Ambient video (`ambient-abstract-web.mp4`), 4-step "constellation", studio note (`#about`) with Brand Bible tag and traits. | `MotionProvider`, `Tag`, `site.js` |
| `Experts.jsx` | Paper panel. Staggered portrait wall from `EXPERTS`, role, portfolio link or "pending" text. All cards are treated equally (no badges). | `site.js` → `nova.js` |
| `Pricing.jsx` | Paper panel. Service selector, three tiers each with standard and **new-client offer** price, notes, disclaimer, Printing "Request quote" (opens NOVA). | `pricing.js`, `guide.js` |
| `CtaBand.jsx` | Closing orb glow, "Have a project in mind?", gold "Start a Project" (→ NOVA). | `guide.js`, `Reveal` |
| `Footer.jsx` | Logo, tagline, contact (email with Brand Bible tag, Instagram), placeholder legal line, footer nav, Lisbon coordinates. | `Logo`, `Tag`, `site.js` |
| `Orb.jsx` (+ `Nova.css`) | NOVA assistant: launcher, dialog panel, 4-stage tracker (Tell / Match / Choose / Connect), welcome block, quick-pick chips, "I'm not sure yet", "Email the studio", keyword matching (`matchNovaRoutes`), recommendation cards with WhatsApp draft links, typing indicator, Esc close, restart, focus handling. | `nova.js`, `site.js`, `guide.js`, `Tag` |
| `SectionHead.jsx` | h2 with mask reveal; optional `index` and `label` → mono kicker "02 / Services". | `Reveal` |
| `SplitText.jsx` | Word-mask spans for the kinetic hero headline (visual only, `aria-hidden`; the h1 carries an `aria-label`). | — |
| `WorkTile.jsx`, `WorkVideo.jsx`, `Lightbox.jsx`, `Tag.jsx` | Gallery tile; video tile with codec-failure message; native `<dialog>` lightbox with arrow keys; status label (Verified / Proposed / Placeholder). | — |

**Inactive files** (not imported; safe to archive, but check with the owner first):
- `components/About.jsx` (about content now lives in `Process.jsx`)
- `components/HoloBackdrop.jsx` and `styles/futuristic.css` (previous "Signal" theme)
- `components/WorkPreview - Copy.jsx`
- `data/script.js` (old scripted guide)
- `src - Copy/`

## 4. CSS architecture

There are four layers, applied in import order. Later layers override earlier ones, often with `:root …` specificity or `!important`.

1. **`index.css`.** Original tokens (`--surface --paper --ink --ink-soft --blue --gold --line`, fonts, spacing, radii, motion durations), base element styles, `.container`, `.sr`, `.skip`, the reduced-motion base and `.vp-reveal` states.
2. **`App.css`.** The historical component stylesheet, built up through steps 14–26 with several override blocks (for example a "Step 16" dark header block). It covers header, nav, buttons, chips, cards, pricing, footer and lightbox.
3. **`typography-motion.css`** (batch 28). Fluid type scale tokens, section-head mask reveal and underline, kinetic word rise, hero entrance, and the pause and reduced-motion overrides.
4. **Component CSS.** `Hero.css`, `WorkPreview.css`, `Nova.css`, and the embedded CSS in `GlassFolder.jsx`.
5. **`cosmic.css`** (current design, loaded last).
   - Defines the new tokens (`--night`, `--paper-bg`, `--star`, `--electric`, `--neon`, `--sky`, `--gold-c`…).
   - **Scoped token flipping:** dark scopes (`.header, .hero, #work, .cx-night, .cta, .footer, [class*="orb__"], [class*="nova"], [class*="lightbox"]`) re-map `--ink/--line/--paper` to light-on-dark. Paper scopes (`.cx-paper, .pricing-preview`) restore dark-on-light. This is how the older `App.css` rules read correctly on both surfaces without being rewritten.
   - Contains every `cx-*` component style, the polaroid (`.pol*`), folder (`.cx-folders`) and NOVA overrides, and responsive and reduced-motion rules.

Animation implementation:
- **CSS keyframes:** ticker, orb breathe, rec blink, twinkle, polaroid sway, NOVA spin, aurora and typing.
- **CSS transitions:** cards, services rows, polaroid carousel transforms using `--o`/`--abs` custom properties.
- **Canvas `requestAnimationFrame`:** StarryNight, IntroMurmuration and GlassFolder art painting.
- **Motion controls:** every animation honours `prefers-reduced-motion` and `html[data-motion-paused='true']` (header toggle).
- **Video budget:** `MotionProvider` plays at most two autoplaying videos, chosen by priority and visibility.

## 5. Data files (the content source of truth in code)

| File | Content | Protect? |
|---|---|---|
| `data/site.js` | `CONTACT_EMAIL`, `INSTAGRAM_URL`, `NAV`, `GOALS`, `SERVICES` (7 active), `TRAITS`; re-exports `EXPERTS` from `nova.js` | **Yes, business facts** |
| `data/nova.js` | `NOVA_EXPERTS` (names, roles, images, portfolios, phone, WhatsApp), `NOVA_SERVICE_ROUTES` (id, short label, keywords, expert), `matchNovaRoutes`, `createWhatsAppUrl` | **Yes, contact routing** |
| `data/pricing.js` | `PRICING_SERVICES` (7 services × 3 tiers, standard EUR, offer = round(×0.85)), `QUOTE_ONLY_SERVICES` (Printing) | **Yes, commercial; owner approval needed for any change** |
| `data/portfolioCategories.js` | 6 `WORK_CATEGORIES` (id, label, folder name, kind, expected count) | Yes |
| `data/portfolio.generated.js` | Auto-generated file list with dimensions/codec (do not edit by hand) | Regenerate only |
| `data/portfolio.js` | Builds `PORTFOLIO` items (URL encoding keeps a literal `&` for "Banners & Print"), `FEATURED_PORTFOLIO_SELECTION`, `DISPLAY_PORTFOLIO_CATEGORIES`, `PORTFOLIO_SHOWCASE` (covers + preview files), H.264 playback map for the two `.MOV`s | Yes |
| `data/portfolioAlt.js` | `ALT_OVERRIDES` (empty: all alt text is generic "X sample n of N") | Accessibility gap |
| `data/reviews.js` | `CLIENT_REVIEWS = []` with a documented example entry; `permission: true` required | Add real reviews here |
| `data/script.js` | Old scripted guide (unused) | — |

## 6. Portfolio categories and assets

The URL root is `/Portfolio Samples/<folder>/<file>` (`public/Portfolio Samples`).

| id | Label | Folder | Files | Notes |
|---|---|---|---|---|
| menu-cards | Menu cards | `01 — Menu Cards` | 5 | 1.png, 6.png, Arrozaria menu draft.png, Casa De Dura (1).png, Screenshot 2026-10-17 053344.jpg |
| business-cards | Business cards | `02 — Business Cards` | 3 | 1.png + 2 screenshots |
| banners-print | Banners & print | `03 — Banners & Print` | 4 | 2.png (**23 MB**), Next Level Board -01.png, O CERVEIRENSE Front menu-01.png (**18.7 MB**), WhatsApp image |
| graphic-design | Graphic design | `04 — Graphic Design` | 5 | next level logo (8268² px), Siam Thai Massage logo (8333² px), Taverna do Marisco.png, THAI TIME LOGO 3.png, screenshot |
| photography | Photography | `05 — Photography` | 9 | WhatsApp JPEGs 2026-10-17 |
| videography | Videography | `06 — Videography` | 2 | IMG_1379.MOV, IMG_1409.MOV (HEVC) → played as `/Media/Portfolio/IMG_1379.mp4` and `IMG_1409.mp4` (H.264); poster `IMG_1379-preview.jpg` |

Category covers:
- Graphic design uses `/Media/Website-Concepts/covers/brand-direction-concept.jpg`.
- Videography uses `/Media/Website-Loops/optimized/film-motion-poster.jpg` (concept art, not client work).
- The others use real samples (`PORTFOLIO_SHOWCASE`).

Other media in use:
- `/Media/Hero/hero-background.mp4` (6.5 MB, 59 s, 1920×1080 H.264)
- `/Media/Hero/hero-poster.jpg` (also the OG image)
- `/Media/Website-Loops/ambient-abstract-web.mp4` (Process)
- `/Media/Website-Loops/optimized/film-motion-loop.mp4` was used by the old reel and is now unused.
- Expert photos are in `/public/Expert/<Name>/`. The Arifuzzaman, Nahidul and Shawan images are 2–8 MB PNGs (two are AI-generated per their file names).

Logos (`public/logo/`):
- `F-01` blue + black text, `F-02` blue + white text, `F-03` white. These three are the official variants.
- `F-04`–`F-06` are unofficial.
- `web/` holds the derived copies: full (`*-logo-*`), trimmed (`*-tight`), split symbol (`vangogh-mark-*`) and two-line wordmark (`vangogh-wordmark-*`), each in white and blue-black.

## 7. Integration points that must be preserved

1. `openGuide()` / `GUIDE_EVENT` ("vangogh:open-guide"). Every "Start a Project" and "Request quote" button opens NOVA through this event.
2. `useVideoSlot(id, priority, {autoPlay})`. All autoplay video must register here so the two-video limit and pause toggle keep working.
3. `useMotionAllowed()` / `prefers-reduced-motion` / `html[data-motion-paused]`. Any new animation must respect all three.
4. `createWhatsAppUrl(expert, serviceContext)`. This is the only "send" path, and the visitor sends the message themselves.
5. The portfolio URL encoder in `portfolio.js` (keep the literal `&`) and the H.264 playback map.
6. Section anchors used by `NAV` and CTAs: `#top #work #services #process #experts #pricing #about #enquiry`, plus `#stories`.
7. Honesty copy: the NOVA disclosure, the CTA "local demo… does not send anything", the footer prototype note, the Client Stories placeholder tag and the `Tag` labels.

## 8. Reusing this design safely in a new project

- Copy `StarryNight.jsx`, `IntroMurmuration.jsx`, `GlassFolder.jsx` and `ClientStories.jsx` together with their `cosmic.css` sections. Each needs only React. `IntroMurmuration` and `ClientStories` also import `useMotionAllowed`; replace it with a `matchMedia('(prefers-reduced-motion: reduce)')` check if `MotionProvider` is not brought over.
- Take content from the `data/` files rather than re-typing it, so business facts stay identical.
- Use the logo files in `public/logo/` and `public/logo/web/` as they are.
- Third-party code: `GlassFolder.jsx` comes from a 21st.dev component supplied by the owner. Check its licence terms on 21st.dev before any commercial reuse [UNKNOWN].
