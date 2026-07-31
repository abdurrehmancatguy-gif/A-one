# A-One International General Trading — Website

A single-page marketing site for A-One International General Trading. Static HTML,
CSS and vanilla JavaScript — no build step, no dependencies, no framework.

---

## Before this goes live

The site deliberately contains **no company statistics, no address, no phone number
and no email address**, because those details were not available when it was built.
Two things need your input:

| What | Where | Status |
|---|---|---|
| Enquiry email address | `index.html`, `data-mailto-form="REPLACE-WITH-YOUR-EMAIL"` | **Required** — the form cannot deliver until this is set |
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

Every link on the page is an in-page anchor. Nothing navigates away.

---

## Brand

The logo was rebuilt as vector paths from the supplied artwork, so it stays sharp at
any size and can be recoloured in CSS. Colours were sampled from it:

| Token | Value | Use |
|---|---|---|
| `--navy` | `#1a2a40` | Logo stroke, headings, dark sections |
| `--gold` | `#dfb96b` | Logo triangle, accents, primary button |
| `--gold-deep` | `#c39a45` | Small gold text that needs more contrast |
| `--navy-deep` | `#101b29` | Footer |

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

**To use it as-is:** set the address in `index.html`:

```html
<form class="form" data-mailto-form="enquiries@yourdomain.com" novalidate>
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
