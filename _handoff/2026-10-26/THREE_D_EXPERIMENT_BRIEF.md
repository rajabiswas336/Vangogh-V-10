# THREE_D_EXPERIMENT_BRIEF — Vangogh Productions 3D Portfolio Experiment

Handoff date: 2026-10-26. **Status: PROPOSED.**

This is an exploratory design brief for a **separate experimental project**. It is **not** an approved replacement for the existing website (`vangogh-website`). Do not change the existing site.

> **Reference screenshot: [UNKNOWN].** The handoff request mentions "the screenshot reference", but no new 3D screenshot was attached to that message. The only screenshots on file are the owner's 7 earlier inspiration images in `vangogh-website/Reference/`: neon UI, an AI orb, a portfolio sidebar and polaroid-style lists. This brief is therefore written from the request's own description. When the owner supplies the screenshot, compare it against §3–§5. Do not copy every effect in it.

---

## 1. Goal
Test whether an immersive, spatial 3D portfolio can make Vangogh's work feel premium and memorable while still meeting these conditions:
- A visitor can find a project category in 2 clicks or fewer.
- A visitor can read every project label.
- A visitor can reach **"Start a Project"** from anywhere.
- The experience stays smooth on a mid-range phone.

**Success criteria (proposed):**
- LCP under 2.5 s on 4G.
- Steady 60 fps on desktop and at least 45 fps on a mid-range phone.
- No motion for visitors with `prefers-reduced-motion`.
- Fully keyboard operable.
- WCAG AA text contrast.

## 2. Identity carried over (VERIFIED from existing project unless marked)
- **Business:** a Lisbon creative production studio plus digital marketing/branding agency. Voice: confident, human, modern, creative, strategic.
- **Logo:** use the original files only, from `public/logo/` and the approved web copies in `public/logo/web/` (`vangogh-mark-white.png`, `vangogh-wordmark-white.png`, `-blue-black` variants). Never redraw, recolour or distort them.
- **Palette:** **PROPOSED, not yet officially approved.** The Bibles conflict.
  - Navy base: `#0B1530` (Client Bible) or `#10182B` (Master Bible).
  - Brand blue: `#2864D7`.
  - Light blue: `#6BA4FF` (Client Bible) or `#76A8FF` (Master Bible).
  - Gold accent: `#D8B76A` or `#D5B56A`.
  - Off-white: `#F3F6FC` or `#F2F5FA`.
  - For this experiment, "neon blue" = light blue used as a **restrained** glow/edge, with gold only for one or two focal details.
- **Typography currently on the live site:** Fraunces (display), Geist (UI), Geist Mono (labels), Caveat (handwritten accents). This choice is not officially approved either.
- **Portfolio categories (VERIFIED, `src/data/portfolioCategories.js`):**

  | id | Label | Folder | Type | Items |
  |---|---|---|---|---|
  | menu-cards | Menu cards | `01 — Menu Cards` | image | 5 |
  | business-cards | Business cards | `02 — Business Cards` | image | 3 |
  | banners-print | Banners & print | `03 — Banners & Print` | image | 4 |
  | graphic-design | Graphic design | `04 — Graphic Design` | image | 5 |
  | photography | Photography | `05 — Photography` | image | 9 |
  | videography | Videography | `06 — Videography` | video | 2 |

  Assets are in `public/Portfolio Samples/<folder>/`. Use `src/data/portfolio.js` and `portfolioAlt.js` for item and alt-text logic.
- **Services that can be used as filters:**
  - Active: Branding & Graphic Design; Social Media & Digital Marketing; Website Development; Photography; Videography & Motion; AI Creative Production; Tourism Planning.
  - Printing & Signage is **partner-delivered** and must be labelled that way.
  - Student/Visa Guidance and Chatbots/Automation/Marketplace are **PLANNED** and must never be shown as active.
- **Content rules:**
  - No invented clients, reviews, results, awards, prices or expert details.
  - Show client work only with permission. The permission status of the current samples is **[UNKNOWN]**.
  - Exclude the Disney+ clone.

## 3. Concept (PROPOSED): "The Atelier Ring"
The portfolio cards float on a slow **circular carousel ring** in a dark, starry studio space, like canvases hung around an observatory. One card at a time comes to the front, faces the viewer and becomes fully readable. The other cards recede in perspective, dimmed and slightly blurred.

**Scene layers:**
1. **Background:** a deep navy space with a very sparse star field. It can reuse the visual language of the live site's `StarryNight` sky, but much calmer, with no vortices behind the text.
2. **The ring:** 10–14 visible cards on a cylinder (radius about 1.6× the card width). The camera sits slightly above with a tilt of about 6–10°.
3. **The active card:** brought forward on Z, rotated to face the viewer, with a thin light-blue rim light and a soft floor reflection (optional, desktop only).
4. **The UI layer (plain HTML, not 3D):**
   - Logo, category tabs, project title, counter ("03 / 12"), previous/next controls.
   - A "Start a Project" button.
   - An optional NOVA entry point.

**Alternative layouts to test (pick one after a prototype):**
- **A. Ring:** the main proposal, as described above.
- **B. Helix:** cards spiral upward and scrolling moves along the spiral. It is more dramatic but harder to read.
- **C. Gallery arc:** a shallow 120° arc. It is the easiest to read and works best on mobile; it is also the **recommended mobile fallback**.

## 4. Interaction and motion
| Action | Behaviour |
|---|---|
| Drag / swipe | Rotates the ring with inertia, then snaps to the nearest card |
| Mouse wheel / trackpad | Steps one card per notch (debounced); it does not hijack page scroll after the last card |
| Arrow keys ← → | Previous / next card; Home / End = first / last |
| Category tab | The ring re-forms with only that category; cards fly out and in with a 300–500 ms staggered transition |
| Click / Enter on active card | Opens a **project view**: the card scales up to fill the screen (shared-element transition), with the detail panel (title, category, service, description, permission-approved credit) and the gallery |
| Esc / close | Reverses the transition back into the ring |
| Hover (desktop) | Subtle tilt of at most 6° plus a brighter rim; no constant wobble |
| Idle | Optional very slow auto-rotation that stops on first interaction or when the tab is hidden |

**Motion principles:**
- Every animation has a purpose: orientation, feedback or focus.
- Use ease-out cubic curves for 200–600 ms. Cinematic transitions can go to 900 ms at most.
- No bounce on text.
- Glow is used sparingly: one rim light and one accent. Avoid excessive glass and blur effects.

## 5. Navigation and labelling
- Keep a persistent top bar with the logo (left); Work, Services, Experts and About (centre or menu); and **Start a Project** (right, primary).
- Category tabs sit as an HTML `role="tablist"` list. Include an "All" tab, plus an optional service filter.
- Project labels sit **outside the 3D transform** (HTML overlay) so they stay crisp, readable and translatable, with a minimum size of 16 px.
- Show a visible progress counter and a "drag to explore" hint the first time, which then disappears.
- A list/grid view toggle offers a flat, accessible alternative to the ring.

## 6. Responsive behaviour
- **Desktop (≥1024 px):** full ring, hover tilt, reflection, rim lighting.
- **Tablet (600–1023 px):** smaller ring radius, fewer visible cards (around 8), no reflection.
- **Mobile (<600 px):**
  - Gallery arc or a horizontal snap carousel with light CSS 3D (`perspective` + `rotateY`), swipe navigation, and one card at about 80% of the screen width.
  - Tabs scroll horizontally.
  - Keep the "Start a Project" button sticky at the bottom.
- Support portrait and landscape. There must be no horizontal page overflow.

## 7. Technical approach (PROPOSED)
- **Option 1, recommended to try first:** **CSS 3D transforms** (`transform-style: preserve-3d`) driven by React state and requestAnimationFrame.
  - It needs no extra dependency, is lightweight and keeps cards as real DOM, which is accessible.
  - It is good enough for a ring of flat cards.
- **Option 2:** **three.js / React Three Fiber** for real lighting, reflections and depth of field.
  - It is heavier, roughly 150 KB or more gzipped; check this figure when you choose a version.
  - Use it only if Option 1 cannot reach the desired look.
  - Always keep an HTML fallback.
- **Stack:** React + Vite. It is a separate project folder, never inside `vangogh-website`. Data stays separate from components, for example `data/projects.js` adapted from `portfolioCategories.js` and `portfolio.js`.
- **Images:** pre-generate WebP/AVIF thumbnails of about 600–800 px for the ring and full-size images only in the project view. Lazy-load the cards that are not visible. The current source PNGs are up to about 23 MB and **must not** be loaded directly into the ring.
- **Video:** poster image in the ring; play only in the project view; muted with controls.
- **Performance:**
  - Pause rendering when the tab is hidden or the ring is off-screen.
  - Limit the device pixel ratio for any canvas to 1.5 or less.
  - Avoid large `backdrop-filter` areas.
- No backend, external AI, analytics or paid services in the experiment. No secrets in client code.

## 8. Accessibility
- The ring is a labelled region (`aria-roledescription="carousel"`). Each card is a button with its project name, and the active card is announced through `aria-live="polite"`.
- Full keyboard support (see §4), with a visible focus ring in light blue and sufficient contrast.
- **Reduced motion:** no auto-rotate, inertia or fly-in. Cards switch instantly or with a short fade, and the user can switch to the flat grid.
- Contrast: text over images uses a scrim, meeting WCAG AA (4.5:1 for body text).
- All images need meaningful alt text. Video needs a text description.
- Touch targets must be at least 44 px.

## 9. Integration with Vangogh conversion goals
- "Start a Project" must be visible in every state, including the project view.
- The project view ends with "Want something like this? → Start a Project". It can optionally prefill a NOVA route matching the category.
- If NOVA is reused, it must keep its honesty rules: a scripted guide, not AI, nothing sent or stored; it hands off to email or WhatsApp. Expert WhatsApp links come only from `src/data/nova.js` (verified data).

## 10. Out of scope / guardrails
- Do not modify, deploy or replace the existing website.
- Do not publish this experiment without explicit owner approval.
- Do not add fake projects, clients, testimonials or results to fill the ring. If there are too few items, use clearly labelled placeholders.
- Do not regenerate or stylise the logo.

## 11. Open questions for the owner
1. Please supply the specific 3D reference screenshot, and say which elements you like: the ring shape, lighting, labels or transitions.
2. Should the ring show **categories** (6 cards) or **individual projects** (28 items)?
3. Which client works have permission to appear?
4. Should the experiment be a standalone microsite or a possible future "Work" page?
5. Which palette is official: Client Bible or Master Bible values?

## 12. Suggested prototype plan
1. **Static mock:** the ring layout with 6 category cards, using CSS 3D only. Check readability on desktop and mobile.
2. **Interaction:** drag, keys, snap and category filtering, plus reduced-motion mode.
3. **Project view transition:** add the gallery.
4. **Performance pass:** thumbnails, lazy loading and an fps check on a real phone.
5. **QA:** keyboard, screen reader, contrast, overflow, console errors and build.
6. **Owner review:** keep, change or drop. Only then discuss any merge with the main site.
