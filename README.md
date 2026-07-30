# Umang — Portfolio Website

A single-page personal portfolio built with plain HTML, Tailwind CSS (CDN),
and vanilla JavaScript. No build step, no framework, no dependencies to
install — open `index.html` in a browser and it works.

Design direction: **Modern Editorial Maximalism** — a warm paper palette,
a serif/sans type pairing (Fraunces + Inter), numbered sections, and a
recurring "crop-mark" corner-bracket motif used across cards and images.

---

## 1. Project structure

```
portfolio/
├── index.html        All markup and page content (single page, section by section)
├── css/
│   └── style.css      All custom styles — design tokens, components, animations
├── js/
│   └── script.js       All behavior — nav, dark mode, form validation, etc.
├── assets/
│   ├── images/         Put real images here (currently empty — placeholders are hotlinked)
│   └── resume.pdf       Placeholder resume — replace with the real file
└── README.md           This file
```

Nothing outside these four files needs to change for normal edits. Tailwind
is loaded from a CDN and configured inline in `index.html`'s `<head>`;
Font Awesome, AOS (scroll animation), and Typed.js (hero typing effect)
are also loaded from CDNs.

---

## 2. How to edit content

Everything lives in `index.html`, organized into clearly commented
sections (`<!-- ==== SECTION NAME ==== -->`). Find the section, edit the
text directly. A few common tasks:

### Add or remove a project
Each project is one `<article class="project-card">` block inside
`<div id="projects-grid">`. Copy an existing block, change the image URL,
title, description, tech badges (`<span class="badge">`), and the two
links (Code / Live Demo). Update the `<span class="project-index">`
number to keep the 01–06 sequence consistent, and give the AOS animation
a `data-aos-delay` of `0`, `100`, or `200` depending on its column.

### Add or remove a skill
Skills live in `#skills` as three `.skill-card` blocks (Frontend,
Backend, Tools). Each skill is a `.skill-bar-item` with a label, a
percentage, and a `.skill-bar-fill` div — set `data-width="85"` (etc.)
to control how far the bar fills. The fill animates automatically when
it scrolls into view (see `initSkillBars()` in `script.js`).

### Add or remove an experience entry
Experience is a vertical timeline in `#experience`. Each entry is a
`.timeline-item` with an icon, a date range, a title, and a description.
Copy an existing `.timeline-item` to add a new one — order matters,
since the connecting line runs top to bottom.

### Change the resume file
Replace `assets/resume.pdf` with your real resume, keeping the same
filename — it's linked in three places (`href="assets/resume.pdf"`),
so no other edits are needed if you keep the filename.

### Change images
All images currently point to `https://placehold.co/...` placeholder
URLs so the site works out of the box. To use real images:
1. Drop the image file into `assets/images/`.
2. Update the relevant `src="..."` in `index.html` to
   `assets/images/your-file.jpg`.
3. Keep the existing `alt="..."` text (or update it to match) and the
   `width`/`height` attributes for layout stability.

### Update contact details / social links
Email, location, and status appear in `#contact` and again in the
footer. Social links (GitHub, LinkedIn, Instagram, email) appear in the
hero and the footer — both use the same `.social-icon` class, so update
all instances of a given `href` when you change a handle.

---

## 3. Design system (tokens)

The editorial redesign is driven by a small set of tokens defined in
**two places that must be kept in sync**:

1. `index.html` → the inline `tailwind.config` script in `<head>`
   (controls Tailwind utility classes like `bg-bg`, `text-accent`, etc.)
2. `css/style.css` → the `:root` and `html.dark` custom properties at the
   top of the file (controls everything written in plain CSS, like the
   corner-bracket signature, buttons, and the hero watermark)

| Token          | Light value | Dark value | Used for                          |
|----------------|-------------|------------|------------------------------------|
| `bg` / `--paper`         | `#FDFBF8` | `#100D0B` | Page background |
| `bg-secondary` / `--paper-2` | `#F4EFE7` | `#1A1613` | Alternating section background |
| `text` / `--ink`         | `#141110` | `#F3ECE1` | Body text, headings |
| `muted` / `--muted`      | `#6B6259` | `#A79C8E` | Secondary text |
| `accent` / `--accent`    | `#26408B` | `#5578D6` | Links, icon backgrounds |
| `accent2` / `--accent-2` | `#A9762F` | `#D8AE68` | Editorial highlight — numerals, rules, hover states, corner brackets |
| `border` / `--line`      | `#E4DBCC` | `#2E2822` | Hairline borders |

**To change the color scheme**, edit the hex values in both places
above — search-and-replace the old hex value across both files.

**Typography**: `font-serif` (Fraunces, loaded from Google Fonts) is used
for headings and the section eyebrow numerals; `font-sans` (Inter) is
used for everything else. Both are declared in the `fontFamily` block of
`tailwind.config` and loaded via the `<link>` tag in `<head>`.

**Signature motif**: the corner-bracket ("crop-mark") hover effect is
defined once in `style.css` and automatically applies to `.about-card`,
`.skill-card`, `.project-card`, `.service-card`, `.timeline-content`,
`.contact-info-item`, and any element you add the `.framed` class to.
No per-element setup is needed — just reuse one of those class names.

**Section numbering**: each major section's eyebrow label uses the
`.eyebrow` / `.eyebrow-number` classes, e.g.
`<p class="eyebrow"><span class="eyebrow-number">01</span>About Me</p>`.
If you reorder sections, update the numbers to stay sequential.

---

## 4. Functionality reference

All behavior is in `js/script.js`, split into small named functions
called once from the `DOMContentLoaded` listener at the top of the file.
Each is independent and safe to read in isolation:

| Function                 | Does |
|---------------------------|------|
| `initAOS()`                | Starts the scroll-reveal animation library |
| `initTypedText()`          | Hero typing effect (edit the `strings` array to change the rotating roles) |
| `initNavbarScroll()`       | Adds a background/blur to the navbar once you scroll down |
| `initMobileMenu()`         | Opens/closes the mobile hamburger menu |
| `initSmoothScroll()`       | Smooth-scrolls to sections when a nav link is clicked |
| `initActiveNavHighlight()` | Highlights the current section in the nav as you scroll |
| `initThemeToggle()`        | Dark mode toggle, persisted in `localStorage` under the key `theme` |
| `initSkillBars()`          | Animates skill progress bars once they scroll into view |
| `initProjectFilter()`      | Exposes `window.filterProjects(category)` for future filter buttons — add `data-category="..."` to `.project-card` elements and wire up buttons that call it |
| `initContactForm()`        | Client-side validation (no backend) + success message |
| `initBackToTop()`          | Shows/hides and wires up the back-to-top button |
| `initFooterYear()`         | Sets the footer's copyright year automatically |
| `initMagneticButtons()`    | Subtle cursor-follow effect on any element with the `.magnetic` class (desktop only, respects reduced-motion) |

The contact form does **not** send email anywhere — it validates the
fields client-side and shows a success message. To make it functional,
either wire the `fetch()` call of your choice inside the `submit` handler
in `initContactForm()`, or point the `<form>` at a service like
Formspree/Netlify Forms.

---

## 5. Common edits — quick recipes

**Change the accent color:** update `accent2` in `tailwind.config`
(index.html) and `--accent-2` in `style.css`, both light and dark values.

**Change fonts:** swap the Google Fonts `<link>` in `<head>` and the
`fontFamily.serif` / `fontFamily.sans` arrays in `tailwind.config`.

**Add a new section:** copy an existing `<section>` block (e.g. Services),
give it a unique `id`, add a matching nav link in both the desktop and
mobile menus (`data-section="your-id"` on the desktop link), and it will
automatically pick up scroll-highlighting and smooth scroll — no JS
changes needed.

**Turn on project filtering:** add `data-category="web"` (or similar) to
each `.project-card`, add filter buttons with
`onclick="filterProjects('web')"`, and an "All" button with
`onclick="filterProjects('all')"`. The plumbing already exists in
`initProjectFilter()`.

**Disable dark mode:** remove the two theme-toggle buttons from the
navbar and the `initThemeToggle()` call in `script.js` — the site will
simply stay in light mode (the default).

---

## 6. Browser support & performance notes

- No build step: works by opening `index.html` directly, or serving the
  folder with any static file server.
- All images use `loading="lazy"` except none above the fold need it.
- Respects `prefers-reduced-motion` (disables AOS/CSS transitions and the
  magnetic button effect).
- Dark mode preference is remembered per-browser via `localStorage`.
