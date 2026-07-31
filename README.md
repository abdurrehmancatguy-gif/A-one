# A-One International General Trading — Website

A single-page marketing site for A-One International General Trading. Static HTML,
CSS and vanilla JavaScript — no build step, no dependencies, no framework.

---

## Before this goes live

The site deliberately contains **no company statistics, no address and no phone
number**, because those details were not available when it was built.

| What | Where | Status |
|---|---|---|
| Enquiry email address | `index.html`, `data-mailto-form="info@aonefzco.com"` | **Set** — enquiries are addressed to `info@aonefzco.com` |
| Trade licence details, address, phone | not present anywhere | Add once the licence is issued |

**All body copy is a first draft.** It describes how a trading company of this kind
works; it has not been checked against how *you* actually operate. Read it through
and correct anything that overstates or misstates what A-One does before publishing.
In particular the "Five principles" and FAQ sections make commitments on your behalf.

---

## Running it locally

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>. Any static server works — the site is plain files.

---

## Structure

```
A-one/
├── index.html              Entire site — one page, anchor-linked sections
├── assets/
│   ├── css/style.css       All styling, organised in 13 numbered sections
│   ├── js/main.js          All behaviour, one module per feature
│   └── img/
│       ├── logo.svg        Full stacked lockup (mark + wordmark + tagline)
│       ├── logo-mark.svg   The "A" mark on its own
│       └── favicon.svg     Browser tab icon
└── .claude/launch.json     Local dev-server config
```

Page sections, in order: hero → capability marquee → `#about` → principles →
`#products` → `#services` → `#process` → FAQ → `#contact` → footer.

Every link on the page is an in-page anchor. Nothing navigates away. The nav
highlights the section you are looking at via a scroll-spy in `main.js`.

---

## Brand

The logo was rebuilt as vector paths from the supplied artwork, so it stays sharp at
any size and can be recoloured in CSS. The site runs a **dark base with warm tan
bands** — three surfaces, all derived from the navy and gold in the logo.

**Dark (default)**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0d1622` | Page background |
| `--bg-alt` | `#111d2c` | Principles, FAQ |
| `--bg-deep` | `#09111b` | Marquee, services band, footer |
| `--surface` | `#162232` | Cards, tiles, raised panels |
| `--gold` / `--gold-ink` | `#dfb96b` | Accents and gold text |
| `--ink` | `#eef2f7` | Headings |
| `--body` | `#9dabbd` | Body copy |
| `--muted` | `#8c99ab` | Secondary text |

**Tan band — `.section--light`** (about, products, process)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#d8c6a0` | Warm mid-tan — a real colour, not an off-white |
| `--surface` | `#e3d5b8` | Cards on tan |
| `--ink` | `#16212f` | Headings (9.7:1 on the band) |
| `--body` | `#3b4657` | Body copy |
| `--gold` | `#a8761a` | Rules, bullets, icon fills |
| `--gold-ink` | `#5a4110` | Gold *text* — the pale brand gold fails contrast on tan |

### How the two surfaces work

`.section--light` re-points the same tokens the components already draw from, so
cards, borders, rules and type invert automatically — there are no per-component
light-mode overrides to keep in sync. To flip any section, add or remove the class:

```html
<section class="section section--light" id="products">
```

Two deliberate exceptions:

- **`--gold` vs `--gold-ink`.** Gold splits into a graphic colour and a text
  colour. They are identical on dark; on tan the text variant darkens to a bronze
  that clears 4.5:1. Use `--gold-ink` for anything rendered as type.
- **`.panel`** re-asserts the dark tokens, because the brand visual stays dark
  whichever band it sits in.

Each tan band also carries the A-One mark as an oversized watermark cropped off the
right edge (`.section--light::after`, 5.5% opacity) — brand presence without needing
photography.

Every text/background pair was measured against WCAG AA in both surfaces, including
worst-case stops on gradient backgrounds. There are currently no failures.

The logo mark ships navy in the SVG files so it stays correct on white stationery;
CSS recolours the stroke to `--ink` on screen, and the print stylesheet puts it back
to navy. Every text/background pair on the page was measured against WCAG AA —
there are currently no failures.

Type is **Jost** for display (a close match to the logo's geometric wordmark) and
**Inter** for body text, both loaded from Google Fonts. If you would rather not
depend on Google, download both and swap the `<link>` in `index.html` for local
`@font-face` rules — the CSS fallback stack already degrades to Futura / Century
Gothic / Avenir.

---

## The enquiry form

Because the site is static, the form hands a completed, validated enquiry to the
visitor's own email client via a `mailto:` link. It never claims to have sent or
stored anything it hasn't.

Enquiries are addressed to **`info@aonefzco.com`**, set in `index.html`:

```html
<form class="form" data-mailto-form="info@aonefzco.com" novalidate>
```

**To receive submissions on a server instead** (recommended once you have a domain
and mailbox — `mailto:` is unreliable on phones):

1. Sign up for a form service such as Formspree, or use Netlify Forms if you host there.
2. Give the form an `action` and `method`, and delete the `data-mailto-form` attribute:

```html
<form class="form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

Removing `data-mailto-form` disables the JavaScript handler automatically; the
browser then submits normally. Client-side validation styling stays in place.

---

## Animation

Motion is deliberately restrained: fade-and-rise on scroll, a header that shrinks
and turns solid, a gold wipe on buttons, a slow drift on the hero shapes.

- Reveals use `IntersectionObserver`; anything already on screen at load appears
  immediately rather than flashing in.
- Everything is disabled under `prefers-reduced-motion: reduce`.
- All animation CSS is gated behind an `html.js` class set by an inline script. If
  JavaScript fails or is blocked, nothing is left invisible — the page renders as a
  complete static document.
- Each JS module is wrapped in its own `try/catch`, so one failure cannot take down
  the rest of the page.

---

## Deploying to GitHub Pages

The repo is already on GitHub. In the repository settings → Pages, set the source to
the `main` branch, root folder. The site publishes as-is; there is nothing to build.

---

## Browser support

Modern evergreen browsers. Uses `IntersectionObserver`, CSS custom properties,
`clamp()`, `aspect-ratio`, `overflow: clip` and grid-row transitions — all widely
supported. Older browsers get a plain but complete and readable page.
