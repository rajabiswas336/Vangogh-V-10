# Vangogh Productions Website — Current State and Next Steps

Handoff date: 2026-10-26.

Project root: `D:\Vangogh Productions workspace\Brand Stand\vangogh-website`.

**Evidence labels:**
- **[VERIFIED-FILE]**: read from the source files on 2026-10-26.
- **[BROWSER-CLAUDE-22OCT]**: checked by Claude in a live browser on 22 Oct. Not re-checked today.
- **[REPORTED]**: claimed by an earlier agent's report and not re-verified.
- **[UNKNOWN]**: no evidence either way.

Nothing in the website was changed while this handoff was written.

---

## 1. Verified current state

### Source code [VERIFIED-FILE]
- **Stack:** React 19 + Vite 8, Oxlint. Only `react` and `react-dom` at runtime. No backend, database, analytics, external AI or environment secrets in the source.
- **Live page order** (`src/App.jsx`):
  1. StarryNight (fixed canvas background)
  2. Skip link
  3. Header
  4. Hero
  5. WorkPreview (Glass Folders + gallery + lightbox)
  6. ClientStories (polaroid carousel)
  7. Services
  8. Process (`#about`)
  9. Experts
  10. Pricing
  11. CtaBand
  12. Footer
  13. Orb (NOVA)
  14. IntroMurmuration (overlay)
- **Theme:** "Cosmic Atelier". Dark cosmic sections alternate with white "paper" panels. `styles/cosmic.css` loads last and overrides the earlier layers.
- **NOVA:**
  - A scripted keyword guide that matches visitors to experts and hands off to WhatsApp (`wa.me`) links or email.
  - It discloses that it is "not an AI" and "nothing you type leaves this page".
- **Client Stories:** `data/reviews.js` is empty. The carousel shows six portfolio images with "Placeholder · review pending" labels. No invented reviews.
- **Pricing:** `data/pricing.js` shows the standard prices and a computed "New-client offer · 15% off" price.
- **Intro:** plays on **every** page load (`ONCE_PER_SESSION = false`, review mode).
- **Launcher:** `Start Website.bat` exists in the project root.

### Behaviour [BROWSER-CLAUDE-22OCT]
- **Rendering:** the page loaded without a Vite error overlay. Six folders render. All six polaroid images return HTTP 200.
- **Carousel controls:** next/previous wraps around and the arrow keys work.
- **Overflow:** none at 1280 px or 375 px. The active polaroid is centred on mobile.
- **NOVA:**
  - The quick-pick chips route correctly; for example, "I need a logo for my cafe" → visual design experts.
  - The WhatsApp button is labelled.
- **Hero:** the headline is readable over the calmer star field.

## 2. Completed / incomplete / unverified

| Item | Status |
|---|---|
| Cosmic redesign of all live sections | Completed in code; checked in the browser on 22 Oct |
| Equal expert cards (no badge) | Completed; 0 badges found on 22 Oct |
| Glass-folder Work section | Completed; the folder open/fan **animation was not visually confirmed** (browser pane hidden) |
| Client Stories carousel | Completed with placeholders; **real reviews missing** (need written permission) |
| NOVA friendlier flow + keywords | Completed; **NOVA on mobile not checked** |
| Starry Night sky animation | Completed in code; **smoothness and real-time quality not seen by Claude** (rAF frozen in the hidden pane) |
| `npm run lint` / `npm run build` since 21–22 Oct changes | **[UNKNOWN]**: not run (no shell on the owner's PC); the last reported lint/build pass was by Antigravity (batches 27–31) on code that has since changed |
| Production `dist/` | **Stale**: predates the 21–22 Oct changes |
| Lighthouse / contrast audit of the Cosmic theme | **[UNKNOWN]**: not done |
| Cross-browser (Safari, Firefox, real phones) | **[UNKNOWN]** |
| Legal pages (privacy, imprint/terms), cookie policy | **Missing** |
| Hosting / domain / deployment | **Not started**; no approval given |
| Version control (Git) | **None**; only folder backups |

## 3. Known visual and technical problems
1. **The unapproved 15% new-client offer is shown publicly** (`data/pricing.js` → Pricing section).
   - The Master Bible says intro offers of 10–20% need approval and must not stack.
   - The Client Bible shows 10% + 15% stacking. These are conflicting sources.
2. **Team titles on the site differ from the Client Bible** for every expert (set in batch 30 in `data/nova.js`).
3. **Process steps:** the site shows 4; the Client Bible lists 6.
4. **Three different palettes:**
   - Client Bible: `#0B1530 / #2864D7 / #6BA4FF / #D8B76A / #F3F6FC`
   - Master Bible: `#10182B / #2864D7 / #76A8FF / #D5B56A / #F2F5FA`
   - Site tokens: a mix of both
5. **Prices differ between the Bibles.** The site matches the Client Bible exactly; the Master Bible prices are higher.
6. **Client names and work are visible in the portfolio** (e.g. Taverna logos). **Permission status: [UNKNOWN].**
7. **Heavy media:** some portfolio PNGs are about 18–23 MB and expert PNGs about 2–8 MB. Mobile load will suffer.
8. **Intro on every load** is a review setting and would be annoying for real visitors.
9. **Navigation:** the nav has no link to `#stories`.
10. **Favicon:** `public/favicon.svg` is probably the Vite default **[UNKNOWN: not visually checked]**.
11. **Housekeeping:**
    - A 114 MB ffmpeg zip sits in the project root.
    - Duplicate `generate-portfolio.mjs`.
    - Inactive files: `About.jsx`, `HoloBackdrop.jsx`, `styles/futuristic.css`, `WorkPreview - Copy.jsx`, `data/script.js`, `src - Copy/`.
12. **Alt text:** quality across portfolio images has not been audited.
13. **Dev server stability:** the owner's dev server stopped several times. Cause [UNKNOWN]: the terminal was probably closed.

## 4. Latest known design decisions (owner, 22 Oct)
- Full redesign of every section's UI and motion is approved and done ("Cosmic Atelier").
- Keep the original logo files, media, expert photos/details and the service types unchanged. The split mark + wordmark web copies were approved on 21 Oct.
- Use a dark + white combination, not all dark. Background: a Van Gogh Starry Night-like sky with a 3D feel.
- Expert badges: equal for everyone or none. Chosen: **none**.
- Client reviews: placeholders until real, permitted reviews exist.
- NOVA: friendlier, simpler, a guide for everything, but honest (not AI, nothing sent).
- Hosting, domain and client questions: the owner said "no preference". **No deploy approval.**
- The owner wants Claude to decide most things, wants bigger visible changes per batch, and wants fewer small approval questions.

## 5. Recommended next steps (priority order)
**P0: before any public launch**
1. Owner decides on the 15% offer. Until approved, hide it or mark it as conditional.
2. Run `npm.cmd run lint` and `npm.cmd run build` on the owner's PC. Fix any errors and rebuild `dist/`.
3. Confirm written permission for every client name, logo and work sample shown. Remove anything without permission.
4. Owner confirms the correct team titles and the process step count (site vs Client Bible).
5. Pick one official palette (Client Bible vs Master Bible).

**P1: launch readiness**

6. Add privacy policy and imprint/terms pages (EU/Portugal context; legal review recommended — Claude is not a lawyer).
7. Set `ONCE_PER_SESSION = true` in `IntroMurmuration.jsx`.
8. Compress the images (WebP/AVIF, roughly ≤ 500 KB each) and add `width`/`height` attributes.
9. Do a real-device QA pass: mobile NOVA, the carousel swipe, folder animations, reduced motion and contrast (Lighthouse).
10. Choose hosting (e.g. a free static host). This needs owner approval and must not happen without it.

**P2: polish and housekeeping**

11. Add a Stories link to the nav.
12. Replace the favicon with an approved logo-derived icon (owner approval needed).
13. Audit the alt text.
14. Move the ffmpeg zip, duplicates and inactive files into an archive folder after owner approval.
15. Initialise Git locally so changes can be rolled back. Local only; no push without approval.

## 6. Owner decisions still required
- [ ] 15% new-client offer: show, change or hide?
- [ ] Which price list is official (Client Bible = site, or the higher Master Bible)?
- [ ] Official palette and typography sign-off.
- [ ] Correct team titles and process steps.
- [ ] Client permissions for the names, logos and work shown.
- [ ] Real client reviews with written permission (or keep placeholders).
- [ ] Hosting provider, domain and go-live date.
- [ ] Favicon / app icon from the official logo.
- [ ] Whether planned services (Student/Visa Guidance; Chatbots/Automation/Marketplace) stay hidden (current rule: never shown as active).
