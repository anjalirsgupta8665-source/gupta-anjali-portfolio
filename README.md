# Gupta Anjali Rajan — Portfolio

A premium editorial portfolio: warm cream paper, charcoal type, vibrant orange accent.
Pure HTML5 + CSS3 + vanilla JavaScript. **Zero dependencies** — no GSAP, no Three.js, no build step.
The 3D orbital scene is drawn on a `<canvas>` with hand-rolled 3D projection, so the whole site
runs offline and stays fast (verified 60 fps while scrolling).

---

## 1 · File structure — where everything lives

```
portfolio/
├── index.html          → all page content / structure
├── css/
│   └── style.css       → the entire design system & animations
├── js/
│   └── main.js         → all interactions (13 modules, commented)
└── assets/
    ├── profile.jpg      → flip-card portrait (1000×1250)
    └── profile-sm.jpg   → lighter copy for auto-load (520×650)
```

Keep the folder structure intact — `index.html` references `css/style.css` and `js/main.js`
by relative path. Open `index.html` in any browser to run it. To publish, upload the whole
`portfolio/` folder to Netlify / Vercel / GitHub Pages (drag-and-drop works on Netlify).

---

## 2 · What is where (inside each file)

### `index.html`
| Block | Section |
|---|---|
| `<svg class="sprite">` | Icon sprite (arrow, spark, camera, GitHub, LinkedIn, mail) |
| `.loader` | Preloader: name reveal, progress bar, % counter, curtain |
| `.cursor` | Custom cursor (dot + ring + contextual label) |
| `.rail` / `.progress` / `.toast` | Side label, scroll progress bar, toast messages |
| `.nav` | Fixed navbar: brand, pill links, status, CTA, burger |
| `.menu` | Fullscreen navigation (circle-wipe from the burger) |
| `.block#block` | Reserved "theme block" element (scroll-transition hook) |
| `#hero` | Oversized name, intro, CTA, languages, orb + canvas |
| `.marquee` | Scrolling keyword band |
| `#about` | Statement, bio columns, principles, chips, flip portrait card, stats |
| `#education` | Degree headline, core-focus list, facts strip, 2029 watermark |
| `#skills` | Dark section: 4 skill groups + reverse marquee + glow layers |
| `#work` | "The build log" — three active study-track cards (CSS art) |
| `#journey` | Experience timeline + reserved certification slots |
| `#contact` | Big title, "say hello" circle, details, demo form |
| `.footer` | Draggable marquee, sitemap, live Lucknow clock, back-to-top |

### `css/style.css`
Numbered sections at the top of the file (01 tokens → 18 misc).
- **01 tokens** — every color, font, easing and spacing value in one place.
- **03/04** — preloader + cursor states.
- **05** — nav + fullscreen menu (incl. dark-section inversion via `.nav.is-dark`).
- **06** — hero composition.
- **15 responsive** — breakpoints at 1180 / 980 / 680 px.
- **17 reveal engine** — the `[data-reveal]` and `[data-split-words]` animation states.

### `js/main.js`
| Module | Does |
|---|---|
| 02 preloader | name slide-in, eased 000→100 % counter, curtain exit |
| 03 smooth wheel | lerped smooth scrolling (desktop only, respects `<select>`/scrollable panels) |
| 04 cursor | lerped ring + dot, grows on links, "View" on cards, inverts on dark sections |
| 05 magnetic | buttons/circles lean toward the pointer |
| 06 splitter | splits headings into masked word spans for the stagger reveal |
| 07 reveal | IntersectionObserver reveals with sibling stagger |
| 08 anchors / theme | smooth anchor jumps, nav color inversion over dark sections, progress bar, parallax |
| 09 menu | circle-wipe menu, Esc to close, locks scroll |
| 10 flip card | hover/tap 3D flip + auto-detects `assets/profile.jpg` |
| 11 counters/clock | stat count-ups (integers + decimals for scores) + live India clock |
| 12 form | validation + toast (demo only) |
| 13 hero scene | canvas 3D orbital rings, floating dust, pointer parallax — pauses off-screen |
| 14 marquee drag | draggable footer band |

---

## 3 · Things to replace before publishing

Search for these strings in `index.html`:

| Find | Replace with |
|---|---|
| `hello@example.com` | Anjali's real email (appears 4×) |
| `Add your certification` (3×) | real certification name + `Provider · Year` |
| Card 01 + 02 titles/descriptions | swap in real projects as they ship |
| `assets/profile.jpg` / `assets/profile-sm.jpg` | replace with a new photo, keeping the same filenames |

**Already filled in and live:**
- **Photo** — `assets/profile.jpg` (1000×1250, 4:5) on the flip card front; `profile-sm.jpg` is the
  lighter version used by the auto-loader.
- **Location** — Mumbai, Maharashtra (hero, contact, footer, menu, live clock uses Asia/Kolkata).
- **Schooling** — St. Joseph High School with Class X **82.20 %** and Class XII **61.33 %**
  (animated counters + progress meters, decimals supported via `data-decimals`).
- **GitHub** — [github.com/anjalirsgupta8665-source](https://github.com/anjalirsgupta8665-source)
- **LinkedIn** — [linkedin.com/in/anjali-gupta-05191739b](https://www.linkedin.com/in/anjali-gupta-05191739b)

Certifications remain visibly reserved slots, and the work section is a **build log of active study
tracks** — deliberately honest rather than invented case studies.

The contact form is **front-end only**. To make it send: create a free Formspree endpoint and change
`<form class="contact__form" id="contactForm" novalidate>` to
`<form action="https://formspree.io/f/XXXX" method="POST" id="contactForm">`, then delete the
`e.preventDefault()` line in module 12 of `main.js`.

---

## 4 · How to tweak the design

- **Colors** — `:root` in `style.css`: `--cream`, `--ink`, `--orange`, `--dark`.
- **Type scale** — hero: `.hero__title` font-size clamp; section titles each have their own clamp.
- **Motion speed** — `--ease` / `--dur` tokens, marquee `animation: marq 42s` / `70s` on touch.
- **Grain** — `body::after` in section 16b (opacity .5, switch off by deleting the rule).
- **Reduced motion** — everything respects `prefers-reduced-motion`; no extra work needed.

---

## 5 · Accessibility & performance notes

- Semantic landmarks, visible focus rings, `aria-expanded` on the burger, `aria-hidden` on décor.
- Custom cursor and magnetic buttons only activate on `(hover:hover) and (pointer:fine)`.
- The canvas scene stops rendering when the hero scrolls out of view.
- 60 fps measured in headless Chrome while continuously scrolling.
- Fonts (Manrope · Space Grotesk · Instrument Serif) load from Google Fonts; the CSS already
  declares local fallbacks, so the page still reads fine offline.

---

Designed and built as a single-file-per-concern, dependency-free template.
