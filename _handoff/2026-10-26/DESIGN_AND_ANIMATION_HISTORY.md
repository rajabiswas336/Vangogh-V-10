# Vangogh Productions Website — Design and Animation History

Handoff date: 2026-10-26.

**Evidence labels:**
- **[REPORTED]** is what an earlier agent's report claims. Claude did **not** independently verify these claims.
- **[BROWSER-CLAUDE]** means Claude checked it in a live browser at the time.
- **[REMEMBERED]** comes from conversation memory and has no file evidence.
- **[FILES]** means the backup folder or file exists on disk and was listed on 2026-10-26.

Agents involved over time:
- Claude: planning and design, and from 21 Oct also implementation through the linked computer.
- OpenAI Codex: steps 14–26.
- Google Antigravity: batches 27–32.

The owner has no coding background and pasted prompts between tools until 21 Oct.

---

## Phase 1–3 · Audit, "Daylight Atelier" plan, first homepage (about 14–16 Oct)
- **What changed.**
  - Claude audited the brand assets and proposed three directions.
  - The owner approved **Direction B "Daylight Atelier"**: light, editorial, off-white, navy type, gold accents and a luminous blue AI Orb.
  - Claude produced a design system and component plan, then built a homepage and portfolio gallery, delivered as ZIP packages (`vangogh-homepage-phase3.zip`, `vangogh-gallery-update.zip`) [REMEMBERED].
- **Files.** React + Vite project set up by the owner; portfolio assets in `public/Portfolio Samples/` [FILES].
- **Verified.** Unknown in detail [REMEMBERED].
- **Still relevant.** These approval conditions remain in force:
  - original logo unmodified
  - placeholders labelled
  - no Disney+ clone
  - Orb is a labelled scripted guide
  - enquiry is a local demo
  - provisional palette and fonts
  - no deploy

## Steps 14–26 · Codex implementation (17–18 Oct)
- **What changed.** The detail is [UNKNOWN]: Claude had not seen these reports in source.
  - Pre-edit snapshots exist: `.local-backups/step14…step26-pre-edit-*`, `homepage-refinement-20261017`, `final-visual-qa-20261017`, `final-visual-qa-video-playback-20261017` [FILES].
  - The memory notes a "six-workstream cinematic upgrade": global art direction, hero, portfolio covers and motion, NOVA, shared interactions, and performance/accessibility. The direction moved to **deep midnight navy, electric blue and blue-violet, restrained gold, controlled glass** [REMEMBERED].
- **Uncertain.** Exactly which features came from which step.

## Batch 27 · Live-browser QA and fixes (18 Oct, Antigravity)
- **Report:** `qa-reports/batch27-report.md`. Backup: `.local-backups/batch27-pre-edit-20261018-022901`.
- **Changed** [REPORTED]:
  - `MotionProvider.jsx`: manual video playback while motion is paused.
  - `Header.jsx`: mobile end-of-page header release.
  - `WorkPreview.jsx`: restored the category reel and fixed Banners & Print `&` 404s.
  - Added H.264 playback copies for the `.MOV` videos.
- **Verified** [REPORTED]: 26 images and 2 videos load; NOVA routing matrix of 22 phrasings; reduced motion; build OK; lint 0 errors.
- **Uncertain.** Claude did not re-run these tests.

## Batch 28 · Expressive typography and purposeful motion (18 Oct, Antigravity)
- **Reports:** `qa-reports/batch28-report.md`, `qa-reports/batch28-motion-register.md`. Screenshots: `qa-screenshots/batch28-20261018-024800/`.
- **Changed** [REPORTED]:
  - New `src/styles/typography-motion.css`: fluid type scale, kinetic word rise, heading mask reveals.
  - `Reveal.jsx` variants (default, block, stagger); hero entrance; gold rule.
  - 21 catalogued animations, each with a stated purpose.
- **Verified** [REPORTED]: CLS 0.0004; 7 widths without overflow; 15/15 protected file hashes unchanged.

## Batch 29 · Visible premium upgrade (18 Oct, Antigravity)
- **Report:** `qa-screenshots/batch29-visual-upgrade-20261018-040704/batch29-report.md` (before/after screenshots inside).
- **Changed** [REPORTED]:
  - Hero composition.
  - Services as two-column editorial cards.
  - Expert gallery framing.
  - CTA band composition.
  - Files: `Hero.css`, `App.css`, `typography-motion.css`.
- **Verified** [REPORTED]: no overflow at 7 widths, CLS pass, lint 0 errors.

## Batch 30 · Three-stage visual transformation (18 Oct, Antigravity)
- **Report:** `qa-screenshots/batch30-launch-sprint-20261018-044500/batch30-report.md`.
- **Changed** [REPORTED]:
  - Team role corrections in `nova.js`. The current site titles date from here and differ from the Client Bible.
  - NOVA 4-stage flow plan (`Orb.jsx`, `Nova.css`).
  - New `SplitText.jsx` kinetic headline and `SectionHead` masks.
  - Raja portfolio badge in `Experts.jsx` (removed on 22 Oct, see below).
- **Verified** [REPORTED]: browser checks and a launch-blocker scan.

## Batch 31 · Cinematic sprint (18 Oct, Antigravity)
- **Report:** `qa-screenshots/batch31-cinematic-sprint-20261018-051000/batch31-report.md` (frames and logs inside).
- **Changed** [REPORTED]:
  - Kinetic word timing (line 1: delay 140, stagger 140; line 2: delay 620).
  - Hero backlighting.
  - Safe OG and Twitter metadata in `index.html`.
  - Four files changed.
- **Verified** [REPORTED]: CLS 0.00116; no overflow at 7 widths; 14/15 protected hashes match.

## Batch 32 · "Launch candidate" (18 Oct, Antigravity)
- **Folder:** `qa-screenshots/batch32-launch-candidate-20261018-054500/` (before, after, frames, logs). **No report file exists** [FILES].
- **Claude's reading on 21 Oct** of `logs/hero-layout-1493x820.json`:
  - The hero video frame ran from x=721 to 1624, wider than the 1478 px hero.
  - That meant **146 px of the brand film was clipped** on the right, and the service rail sat 99 px below the fold.
  - No source edits were made in batch 32.

## 21 Oct · Claude Design prototype (design-only)
- **Where:** Claude Design artifact "Vangogh Website Redesign".
- **Content:**
  - Boards: audit, three directions (A Night Cinema, B Daylight Atelier, **C Atelier + Screening Room, recommended**), desktop and mobile homepage prototypes, handoff notes.
  - A "film frame" desktop revision (Bodoni/Fraunces, crop marks, ticker, polaroid-free).
  - A murmuration hero concept board.
- **Owner feedback:**
  - Fonts and colours felt too common.
  - Wanted much bigger changes.
  - Shared the 8-pillar "$10K website" checklist and the reference video.
- **Status:** a superseded prototype, never implemented as drawn.

## 21 Oct · Live implementation begins (Claude, through the linked computer)
Backups: `_design-backups/2026-10-21/` [FILES]. All steps below were **[BROWSER-CLAUDE]** checked at the time unless noted.

1. **Hero crop fix** (`Hero.css`): frame `width:100%; margin-right:0`; shorter hero padding; title capped by viewport height. Verified that the frame stays inside the viewport and the rail sits above the fold (1493×820). Later replaced by the new hero markup.
2. **Logo plate removed** (`Logo.jsx`, `App.css`):
   - The original PNGs are transparent. The white plate came from CSS and has been removed.
   - White logo used on the dark header.
   - Web copies made at 800 px.
3. **Logo readability.** The owner said the logo was unreadable and approved adjusting it.
   - Made trimmed copies, then a **split symbol + two-line wordmark** side-by-side lockup (`public/logo/web/vangogh-mark-*`, `vangogh-wordmark-*`).
   - Verified readable in the header.
4. **Intro murmuration** (`IntroMurmuration.jsx`, `App.jsx`):
   - Flock forms "VANGOGH", then the white logo appears.
   - Changed to replay on every load for review.
   - Timeline tied to real time, plus a safety timeout.
   - **Process note:** two commits briefly failed to reach the computer because the bridge reused a staging path. Claude detected and fixed this by re-reading the files from the dev server.
5. **Fonts and colours** (`index.html`, `index.css`, `App.css`, `Nova.css`, `WorkPreview.css`, `typography-motion.css`):
   - Fraunces, Geist and Geist Mono from Google Fonts.
   - 19 violet glow values changed to brand light blue.
   - Backup: `_design-backups/2026-10-21/step3-fonts-colour/`.
6. **"Signal" futuristic theme** (`styles/futuristic.css`, `HoloBackdrop.jsx`, holo orb and chips in `Hero.jsx`):
   - Glass surfaces, neon edges, star backdrop, cursor light.
   - Verified at 1180 px and 375 px.
   - Backup: `step4-signal-theme/`.
   - **Superseded on 22 Oct.** The files remain but are not imported.

## 22 Oct · "Cosmic Atelier" full redesign (Claude)
The owner's direction:
- Redesign every section's UI and motion.
- Keep the logo, media, experts and service types.
- Use **dark + white, not all dark**.
- Add a **starry-night cosmic background**.

| Pass | Changed | Files | Backup | Verified at the time [BROWSER-CLAUDE] | Uncertain |
|---|---|---|---|---|---|
| Cosmic 1 | New `StarryNight` canvas; new Hero markup (kinetic headline, 3D screen, ticker); Services index; Process constellation and studio glass; Experts portrait wall; CTA orb; new Footer; `SectionHead` index/label; paper panels; `cosmic.css`; `futuristic.css` and `HoloBackdrop` unhooked | `App.jsx`, `Hero.jsx`, `Services.jsx`, `Process.jsx`, `Experts.jsx`, `CtaBand.jsx`, `Footer.jsx`, `SectionHead.jsx`, `WorkPreview.jsx`, `Pricing.jsx`, `StarryNight.jsx`, `styles/cosmic.css` | `_design-backups/2026-10-22-cosmic/` | Owner's own screenshots showed it running. Claude checked loading, no error overlay, and partial views. | The pane was hidden, so animations were not visually confirmed by Claude |
| Pass 2 | Expert cards made equal (Raja badge removed); **Glass Folder** Work section (21st.dev component converted to JSX); NOVA visual upgrade; **Van Gogh-style sky** (vortex brushstrokes, haloed stars, crescent moon, parallax); separate trail layer to stop streaks on scroll | `Experts.jsx`, `GlassFolder.jsx` (new), `WorkPreview.jsx`, `StarryNight.jsx`, `cosmic.css` | `_design-backups/2026-10-22-pass2/` | 6 folders render; 0 badges; no horizontal overflow at 1280; sky and folders seen in screenshots | Folder open and fan animation was not visually confirmed |
| Pass 3 | **Client Stories polaroid carousel** (string, pegs, sway, 3D depth, counter, prev/next, keys, swipe); `reviews.js` (empty, permission-gated); calmer hero stars plus a darker scrim; **NOVA rewrite**: friendlier copy, quick-pick topics, "I'm not sure yet", email chip, typing dots, green WhatsApp button, new step names, **expanded keywords**; Caveat font; polaroid images set to `contain` | `ClientStories.jsx` (new), `data/reviews.js` (new), `Orb.jsx`, `data/nova.js`, `StarryNight.jsx`, `cosmic.css`, `index.html`, `App.jsx` | `_design-backups/2026-10-22-pass3/` | 6 images load (HTTP 200); prev/next/wrap/arrow keys work; no overflow at 1280 and 375; active card centred on mobile; NOVA chips, routing ("logo for my cafe" → Shaikat + Shawan) and WhatsApp label OK; hero headline readable | Sway and transition smoothness; NOVA on mobile not checked |
| Launcher | `Start Website.bat` (double-click → `npm.cmd run dev -- --open`) | project root | — | Written to disk | The owner first opened it in Chrome by mistake; final launch not confirmed by Claude |

## Proposed but never implemented
- Direction C Design-canvas boards and the "film frame" homepage (21 Oct).
- The murmuration as a permanent hero background (only the intro overlay was built).
- Vercel/Netlify deployment plan.
- Brand Bible reconciliation (conflict register and owner questions).
- 15% offer approval workflow.

## Backup and evidence locations (all inside the project root)
- `.local-backups/`: earlier agents' snapshots (step14 … batch32).
- `_design-backups/2026-10-21/`, `…-22-cosmic/`, `…-22-pass2/`, `…-22-pass3/`: Claude's pre-edit copies.
- `qa-reports/`: batch 27 and 28 reports, motion register, hash audits, Bible text extracts.
- `qa-screenshots/batch27…batch32/`: before/after screenshots and frames.
- `Reference/`: the owner's 7 inspiration screenshots (neon UI, AI orb, portfolio sidebar, polaroid-style lists).
