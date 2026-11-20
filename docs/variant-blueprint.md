# NaijaPath web: variant blueprint

The architecture, assets and content of the NaijaPath marketing site, **without its design**.
Use it to build a new visual variant of the same website for the client: same pages, same
content, same behaviour and integrations, different look.

- **In scope:** stack, folder structure, layers and their rules, routes, page structure (what
  is on each page and in what order), data flow, API contracts, configuration, accessibility and
  performance requirements, the asset inventory, and every line of content.
- **Out of scope (each variant decides):** colours, typography, spacing, layout grids, radii,
  shadows, imagery treatment, iconography style, motion and animation. Where this document
  mentions a component, it describes what it does, never how it looks.

Snapshot of the `master` branch on 2026-11-20. The day-to-day component catalogue is
`docs/index.md`; the build gotchas are in `AGENTS.md`. When those and this document disagree,
the code wins: re-check before relying on a detail.

---

## 1. What the website is

**NaijaPath** is Nigeria's first digital career service platform. It makes career guidance
accountable: every session is professionally delivered, documented and tracked, from the first
appointment to the last report.

It is a **quality-assurance platform**, not a marketplace, a mentorship app or a job board. The
differentiator is the **5-Stage Delivery Standard** (Scheduling, Intake, Delivery,
Documentation, Reporting), applied to every session.

| Audience | What they come to do | Primary action |
|---|---|---|
| Beneficiaries (individuals in Nigeria and the diaspora, often young, often on mobile data) | Book a verified practitioner, prepare, get structured guidance, leave with a documented action plan | Find Career Guidance / Book a Session |
| Project clients (development organisations, government programmes, corporate CSR) | Commission career services for a cohort, monitor delivery, report outcomes to funders | Commission a Programme |
| Career practitioners | Join a verified network and practise under a managed delivery standard | Join as a Career Practitioner |

This repository is the **marketing site** only. Booking, accounts, commissioning, practitioner
sign-up and stories belong to the platform app; the site links to those routes or posts to that
app's API through a proxy.

---

## 2. Technology stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Nuxt 4 (Vue 3.5, Vue Router 5) | SSR on, homepage prerendered at build |
| Language | TypeScript 6 (strict) | `nuxt typecheck` (vue-tsc) |
| Styling engine | Tailwind CSS v4 (`@tailwindcss/vite`) | Engine only; the theme is design and is replaced per variant |
| Class utilities | `clsx` + `tailwind-merge` (`cn()`), `class-variance-authority` | Variant props for primitives |
| Headless UI | Reka UI 2 | Dialog (mobile menu), Tabs (sign in / sign up) |
| Forms | vee-validate 4 + yup + `@vee-validate/yup` | Schema validation |
| HTTP | axios (one shared client) | Talks only to the same-origin proxy |
| Images | `@nuxt/image` | AVIF/WebP, responsive srcsets, generated at build |
| Fonts | `@nuxt/fonts` | Self-hosted at build (the family is a design choice) |
| Icons | `lucide-static` (raw SVG strings) + authored brand marks | Semantic name registry |
| Motion (optional) | GSAP + ScrollTrigger + SplitText, Lenis | Lazy, client-only, never loaded under reduced motion |
| Lint / format | oxlint, oxfmt, knip | `npm run check` |
| Git hooks | husky + nano-staged | Formats staged files |
| Browser checks | playwright-core driving installed Edge | Used by `scripts/content-lock.mjs` and ad-hoc checks |
| Runtime | Node ≥ 22.18 | |

There is no unit-test suite by design. Verification is `npm run check`, the scripts in §11, and a
real browser at 320 / 375 / 768 / 1024 / 1280 / 1440 / 1920 px.

---

## 3. Repository layout

```
naijapath/
├─ app/
│  ├─ app.vue                     Root: route announcer + <NuxtPage>; adds the `js` class before paint
│  ├─ error.vue                   Error / 404 page with a way back home
│  ├─ pages/                      File-based routes (thin: SEO + compose feature components)
│  │  ├─ index.vue                /                 → <MhHome>
│  │  ├─ sign-in.vue              /sign-in          → sign in / sign up
│  │  ├─ contact.vue              /contact          → contact form
│  │  ├─ book-a-session.vue       /book-a-session   → session request form
│  │  └─ design-system.vue        /design-system    → dev-only reference (404 in production)
│  ├─ features/marketing/
│  │  ├─ home/                    Homepage feature slice
│  │  │  ├─ domain/               Content + routes (no Vue): home-copy, home-microcopy,
│  │  │  │                        home-routes, home-testimonials
│  │  │  ├─ composition/          Behaviour (auto-imported): use-mh-newsletter,
│  │  │  │                        use-mh-stage-path, use-mh-count-up
│  │  │  ├─ ui/mh-home/           One component per section → <MhHome…>
│  │  │  └─ index.ts              Barrel: domain exports only
│  │  └─ pages/                   Standalone pages slice
│  │     ├─ domain/               pages-microcopy, pages-routes (paths + API endpoints)
│  │     ├─ composition/          use-mp-submit, use-mp-sign-in, use-mp-sign-up,
│  │     │                        use-mp-contact, use-mp-session-request
│  │     └─ ui/mp-pages/          site-nav, shell, split, auth-tabs, forms, fields → <MpPages…>
│  ├─ components/n/               Design-system primitives (N-prefixed, one folder each)
│  ├─ composables/                useCustomFetchNoAuth, useScrollMotion, useInViewOnce, useWhatsappHref
│  ├─ utils/                      cn, icons, status, dates, api-envelope, scroll, easing, motion-state
│  ├─ plugins/motion.client.ts    Lazy motion bundle (optional per variant)
│  ├─ types/api.ts                ApiResponse envelope type
│  └─ assets/css/tailwind.css     Design tokens + utilities (DESIGN: replace per variant)
├─ server/routes/backend/[...path].ts   Same-origin API proxy
├─ public/                        Static assets (§9)
├─ scripts/                       contrast.mjs, content-lock.mjs, generate-brand-assets.mjs
├─ content-lock.md                Rendered-copy snapshot the content check compares against
├─ IMAGE_CREDITS.md               Source and licence of every image
├─ PRODUCT.md                     Product brief (users, purpose, positioning)
├─ AGENTS.md                      Rules and gotchas
├─ docs/index.md                  Component and composable catalogue
├─ nuxt.config.ts                 Modules, routing rules, runtime config, image/font config
└─ .env.example                   Environment variables (§7.4)
```

### What a variant keeps, and what it replaces

| Keep as-is (architecture + content) | Replace (design) |
|---|---|
| `features/*/domain/**` (all content, routes, endpoints) | `assets/css/tailwind.css` (tokens, utilities) |
| `features/*/composition/**` (behaviour) | Templates and classes in `features/*/ui/**` |
| `composables/**`, `utils/**` (except visual mappings) | Visual classes in `components/n/**` and their `*-variants.ts` |
| `server/**`, `types/**` | `plugins/motion.client.ts` and motion code (optional) |
| `pages/*.vue` SEO blocks | `.impeccable/` direction files, `pages/design-system.vue` |
| `public/` content assets (§9), `IMAGE_CREDITS.md` | `scripts/contrast.mjs` colour list (rebuild for the new palette) |
| `nuxt.config.ts` (except the font family) | Font family in `nuxt.config.ts → fonts` |

---

## 4. Architecture

### 4.1 Layers

```
pages/*.vue            Route + SEO only. Composes one feature root.
   │
features/<slice>/ui    Presentation. Reads content from domain, behaviour from composition.
   │                   One component per section or part. No fetch calls, no business rules.
   ├── composition     Behaviour: form state, validation, submission, derived state.
   │                   Auto-imported. Uses composables/ and utils/.
   └── domain          Plain TypeScript data: copy, microcopy, routes, endpoints, testimonials.
                       No Vue, no side effects. The only thing the slice barrel exports.

components/n           Generic primitives (Button, Link, Input, Card…), content-free.
composables, utils     Cross-cutting: HTTP client, links/scroll, icons, dates, status.
server/routes/backend  Same-origin proxy to the platform API.
```

Rules that keep variants swappable:

1. **Content never lives in templates.** Every visible string comes from a `domain/` file.
2. **Approved copy and microcopy are separate.** Brief copy goes in `home-copy.ts` (verbatim,
   locked); any string the brief does not contain goes in `*-microcopy.ts` and needs the
   client's review.
3. **Paths and endpoints live in `*-routes.ts`.** Markup links through `NLink` with those
   constants, never a hard-coded URL.
4. **The barrel (`index.ts`) exports domain only.** UI and composition are never imported across
   slices through it.
5. **Pages are thin.** They set SEO and render one feature root.

### 4.2 Component naming (Nuxt auto-registration)

Nuxt names auto-registered components from their folder path:

- `components/n/button/NButton.vue` → `<NButton>`.
- `features/marketing/home/ui/mh-home/hero.vue` → `<MhHomeHero>`.
- `features/marketing/pages/ui/mp-pages/site-nav.vue` → `<MpPagesSiteNav>`.

A file whose name does not start with its folder's name gets a longer name
(`n/field/NLabel.vue` → `NFieldNLabel`), and `<NLabel>` then **renders nothing, silently**.
Typecheck does not catch it. Keep one folder per part, named after the part.

Every `features/**/ui` folder is registered by a glob that runs once at config load: **adding a
new `ui/` folder needs a dev-server restart.**

### 4.3 Primitives (`components/n/`): roles, not looks

| Part | Role |
|---|---|
| `NLink` | The only link primitive. `#id` / `/#id` → smooth scroll + focus move + URL update. External → new tab + screen-reader hint. File extensions → download. Routes this app owns → client routing; others → plain document link. |
| `NButton` | Button or link-styled-as-button (`to`). Variant props: `color`, `variant`, `size`. All sizes ≥ 44 px tall. |
| `NTextLink` | Call-to-action text link with trailing arrow. |
| `NLabel`, `NInput`, `NTextarea`, `NSelect`, `NCheckbox`, `NFieldError` | Form controls. Labels always visible; required = marker + screen-reader text; errors linked with `aria-describedby`, never colour alone; 16 px input text (no iOS zoom). |
| `NCard` (+ Header / Title / Description / Action / Content / Footer) | Card structure; `as` for semantics. |
| `NSheet` | Section panel wrapper; `tone` marks dark surfaces (`data-surface="dark"`). |
| `NEyebrow`, `NSectionLabel` | Small label above a heading (a `<p>`, never a heading). |
| `NStat` (+ Value / Label / Caption) | Figures with tabular numbers. |
| `NPill`, `NStatus` | Labels; status always icon/dot **and** text. |
| `NRating` | Stars with `role="img"` and a label; always next to the numeric score. |
| `NIcon` | Semantic icon by name from `utils/icons.ts`. Decorative unless given a `label`. |
| `NAvatar` | Initials or neutral silhouette (placeholders only). |
| `NLogo` | Client wordmark (`public/brand/`). |
| `NContainer` | Max-width content container. |
| `NSkipLink` | First focusable element; jumps to `#main`. |

### 4.4 Cross-cutting utilities

| Utility | Contract |
|---|---|
| `useCustomFetchNoAuth()` | The single axios instance. Base URL `runtimeConfig.public.apiBaseUrl` (`/backend`), 15 s timeout, JSON, `withCredentials: true`. |
| `normalizeApiError(err, fallback)` | → `{ kind: client \| server \| network \| unknown, status?, message }`. Uses the server's `message` when present. |
| `unwrapApiResponse(res, fallback)` | Throws when `status: false` (which arrives on HTTP 200) or when there is no response. **Every write goes through it**, so a rejection can never render as success. |
| `useWhatsappHref(text?)` | `wa.me` link from `NUXT_PUBLIC_WHATSAPP_NUMBER`, or `null` while unset (callers fall back to `/contact`). |
| `utils/icons.ts` | Semantic name → SVG. Templates say `<NIcon name="partners">`, never import a library. |
| `utils/status/` | Raw backend status string → alias table → canonical status → `{ label, icon, tone }`. |
| `utils/date-formatters.ts` | `APP_TIME_ZONE = "Africa/Lagos"`; `formatTime`, `formatDate`, `toIsoInZone` via built-in `Intl` (server and browser output match). Never format at a call site. |
| `utils/scroll.ts` | `scrollToSection(id)`: native smooth scroll + focus move; no scroll-jacking. |
| `useScrollMotion`, `useInViewOnce` | Optional motion hooks. A variant may drop motion entirely. |

---

## 5. Routes and pages

| Route | File | Rendering | Indexed | Purpose |
|---|---|---|---|---|
| `/` | `pages/index.vue` | **Prerendered at build** | Yes (canonical, OG, Twitter, Organization JSON-LD) | Homepage, sections 01–09 |
| `/sign-in` | `pages/sign-in.vue` | SSR | **No** (`noindex, nofollow`) | Sign in / Sign up tabs; `?mode=sign-up` opens Sign up |
| `/contact` | `pages/contact.vue` | SSR | Yes (canonical, OG) | Contact form |
| `/book-a-session` | `pages/book-a-session.vue` | SSR | Yes (canonical, OG) | Session request form |
| `/design-system` | `pages/design-system.vue` | Dev only | No | Design reference (replace per variant) |
| any other | `error.vue` | SSR | No | Error / not-available page with a way home |

### 5.1 Link targets

In-page anchors (homepage section ids):

| Constant | Path | Section id |
|---|---|---|
| `HOME_ROUTES.forYou` | `/#for-you` | `for-you` |
| `HOME_ROUTES.howItWorks` | `/#how-it-works` | `how-it-works` |
| `HOME_ROUTES.commissionSection` | `/#commission` | `commission` |
| `HOME_ROUTES.join` | `/#join` | `join` |
| `HOME_ROUTES.careerBrief` | `/#career-brief` | `career-brief` |
| (hero) | `/#top` | `top` |
| (intro + numbers) | `/#trust` | `trust` |
| (stories) | `/#stories` | `stories` |
| (main landmark) | `#main` | `main` |

Routes owned by this build: `/`, `/sign-in`, `/contact`, `/book-a-session`.

Platform-app routes the site links to (**outside this build; confirm with the platform team**):
`/find-career-guidance`, `/commission-a-programme`, `/join-as-a-career-practitioner`,
`/stories`, `/beneficiaries`, `/partner-organisations`, `/code-of-conduct`, `/about`,
`/privacy-policy`, `/terms-of-service`, and `/dashboard` (where sign-in hands over).

File slot: `/downloads/naijapath-programme-brochure.pdf` (not supplied yet).

---

## 6. Page anatomy (structure, not design)

Order, landmarks, content slots and behaviour that every variant must provide. Copy references
point to §10.

### 6.1 Homepage `/`

Landmarks: skip link → `<header>` → `<main id="main">` → `<footer>`; the chat launcher sits
outside `<main>`.

| # | Section (component) | Anchor id | Content | Behaviour |
|---|---|---|---|---|
| 01 | Header (`site-header`, + `mobile-menu`) | — | Logo (→ home), 4 nav links + Contact + Sign In, Book a Session CTA | Full nav needs ≈ 1440 px at 16 px text; below that, CTA + menu button opening a full-screen menu (lazy dialog). Nav shows which section is in view (`aria-current="location"`). |
| 02 | Hero (`hero`) | `top` | Tag, H1 (set as two approved lines), Find Career Guidance CTA, Commission a Programme link, badge "100% Funded Seats Available", location line, hero photo | The page's only H1; LCP image (eager, high priority). |
| 2.3 | Intro + numbers (`trust-bar`, `trust-stat`) | `trust` | Hero subheadline split into a title sentence and a supporting sentence; 4 trust stats; rating 4.9 / 5.0 + "98% Recommendation Rate" | Counts up once when visible (350+, 45+); the final value is always in the HTML. |
| 04 | For You (`beneficiaries`, `agreed-actions-card`) | `for-you` | Label, headline, 2 body paragraphs, CTA, supporting note, beneficiary photo, sample "Agreed Actions" session record | The record is labelled an illustration of the platform. |
| 05 | Commission (`commission`, `cohort-dashboard-card`) | `commission` | Label, headline, 3 body paragraphs, 4 features, 2 CTAs (Commission, Download Brochure), sample cohort dashboard | Dashboard visibly marked "Sample data"; chart has a text summary for screen readers. |
| 06 | How it works (`how-it-works`) | `how-it-works` | Label, headline, subheadline, 5 numbered stages | Ordered list. |
| 07 | Stories (`social-proof`, `testimonial-card`) | `stories` | Label, headline, subheadline, testimonials, Read More Stories | Renders real testimonials; sample cards only in dev and visibly labelled (§10.5). Previous / next controls. |
| 08 | Join (`join`, `audience-card`) | `join` | Label, headline, 3 audience cards | One per audience, each with its CTA. |
| 09 | Footer (`site-footer`, `newsletter-form`) | `career-brief` (newsletter) | Logo, tagline, location line, social icons, Career Brief sign-up, 3 link columns, copyright | Social icons render as non-links while their URL is empty. |
| — | Chat assistant (`assistant`, `assistant-panel`) | — | Floating "Chat with us" launcher + scripted panel | §6.5. |

### 6.2 Sign in `/sign-in`

- Navigation bar (`site-nav`, shared by all standalone pages).
- Content: H1 "Welcome back", lead, then **tabs** "Sign in" | "Sign up" (Reka Tabs: arrow keys,
  roles). Both panels stay mounted (input survives switching); the inactive one is hidden from
  the keyboard and assistive technology.
- **Sign in** is email-first: email → "Continue" (validates the email) → password field appears
  and takes focus → "Sign in". Show-password toggle (`aria-pressed`). On failure the password is
  cleared without raising a new error.
- **Sign up**: full name, email, password (≥ 8 characters, hint shown), terms line linking to
  Terms of Service and Privacy Policy, "Create account".
- After the form: "Trouble signing in? Contact us".
- Visual side panel (decorative, `alt=""`): one photo per tab (Sign in: beneficiary photo;
  Sign up: hero photo).
- Footer: tagline, links to the other pages, copyright.

### 6.3 Contact `/contact`

- Navigation bar.
- Eyebrow "Contact", H1, lead.
- Form: full name, email, organisation (optional), topic (7 options), message (10–2000
  characters) → "Send message". Form resets after a successful send.
- Decorative photo panel (hero photo).
- Footer as above.

### 6.4 Book a session `/book-a-session`

- Navigation bar.
- Eyebrow, H1, lead; a "What happens next" ordered list (3 steps).
- Form in two fieldsets:
  - **About you:** full name, email, phone (optional, hint), career stage (5 options).
  - **Your session:** help needed (6 options), preferred time in West Africa Time (optional,
    5 options), goals (20–1500 characters, hint), consent checkbox linking to the Privacy Policy.
- "Request my session". Form resets after success.
- Footer: tagline, Contact / Sign In (phones), Back to the homepage, copyright.

### 6.5 Chat assistant (homepage)

A **scripted** helper. It is not AI and not a person, and it says so in its header.

- Launcher: "Chat with us" (icon-only on phones, label in screen-reader text). `aria-expanded`,
  `aria-controls`. Painted with the page; interactive once the browser is idle.
- Panel: non-modal dialog, loaded as a separate chunk on first open. On open, focus moves to the
  first suggested question. Escape or the close button closes it and returns focus to the
  launcher. Following a link closes it **without** pulling focus back (the link moves focus).
- Conversation area is `role="log"` (announced politely). Each choice adds the visitor's
  message, a short typing pause (shorter under reduced motion), the scripted reply with links,
  and "Anything else I can help with?".
- Suggested questions stay focusable while the assistant is "typing" (`aria-disabled`, not
  `disabled`).
- "Continue on WhatsApp" (prefilled with the last topic) appears only when a number is
  configured. Without one, "Talk to a person" offers "Send the team a message" → `/contact`.

---

## 7. Data and integrations

### 7.1 Request path

```
Browser ──axios──▶ /backend/<path>  (same origin)
                      │  server/routes/backend/[...path].ts
                      ▼
             NUXT_API_PROXY_TARGET/<path>   (platform API; cookies rewritten to this domain)
```

- The browser never talks to the backend host directly.
- **No upstream configured** → the proxy answers HTTP 503 with
  `{ status: false, data: null, message: "This service is not available right now. Please try again later." }`.
  Forms then show that message. There is no mock or fabricated success anywhere.

### 7.2 Response envelope

```ts
interface ApiResponse<T> {
  status: boolean;      // false = failed (can arrive on HTTP 200)
  data: T;
  message?: string;     // shown to the user on failure
  meta?: { page: number; limit: number; total: number };
}
```

### 7.3 Endpoints (POST, JSON)

Paths are relative to `/backend`. **None of them is confirmed by the platform team yet.**

| Endpoint | Sent from | Payload | On success |
|---|---|---|---|
| `/newsletter/subscribe` | Footer Career Brief | `{ email, list: "career-brief" }` | Success message; field cleared |
| `/auth/sign-in` | Sign in tab | `{ email, password }` | Full navigation to `/dashboard` (session cookie set by backend) |
| `/auth/sign-up` | Sign up tab | `{ name, email, password }` | Full navigation to `/dashboard` |
| `/contact` | Contact form | `{ name, email, organisation \| null, topic, message }` | Success message; form reset |
| `/session-requests` | Book a session | `{ name, email, phone \| null, stage, focus, time \| null, goals, consent: true, timeZone: "Africa/Lagos" }` | Success message; form reset |

Option values sent: topic `general | guidance | commission | practitioner | partnership | media | other`;
stage `student | graduate | early-career | experienced | changing`;
focus `direction | applications | interviews | switching | growth | other`;
time `weekday-morning | weekday-afternoon | weekday-evening | weekend | any`.

### 7.4 Configuration

| Variable | Read as | Default | When it applies | Purpose |
|---|---|---|---|---|
| `NUXT_API_PROXY_TARGET` | `runtimeConfig.apiProxyTarget` (server only) | empty | Runtime | Upstream API for `/backend/**`. Empty → honest 503. |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | `runtimeConfig.public.whatsappNumber` | empty | **Build time** for the homepage (prerendered); runtime elsewhere | International format, e.g. `2348031234567`. Empty → WhatsApp buttons hidden, fallback to `/contact`. |
| `NUXT_PUBLIC_SHOW_PLACEHOLDER_TESTIMONIALS` | `runtimeConfig.public.showPlaceholderTestimonials` | `true` in dev, `false` in production | Build / runtime | Shows the labelled sample testimonials. **Never true in production.** |
| (constant) | `runtimeConfig.public.apiBaseUrl` | `/backend` | — | Client base URL |
| (constant) | `runtimeConfig.public.siteUrl` | `https://naijapath.com` | — | Canonical / OG URLs |
| `NUXT_BUILD_DIR` | build option | `.nuxt` | Build | Build into another folder while `nuxt dev` runs |

### 7.5 Form behaviour contract (all forms)

- Validate on submit. After a failed submit, errors already on screen update live as the visitor
  fixes them; untouched fields never nag.
- A failed submit moves focus to the first invalid field and announces "Please fix the
  highlighted fields and try again." The summary clears once every error is fixed.
- Sending / success / server errors are announced through an always-present
  `role="status" aria-live="polite"` line, without moving focus.
- Every write goes through `unwrapApiResponse`; server messages are shown as given.
- Double submits are ignored while sending.
- Passwords are never logged, stored or echoed.

---

## 8. Cross-cutting requirements (design-independent)

These are launch blockers in every variant, whatever it looks like.

**Accessibility (WCAG 2.2 AA)**

- One H1 per page; headings in order; eyebrows are paragraphs, not headings.
- Skip link first; `<main id="main" tabindex="-1">`.
- Visible focus indicator on every interactive element, never removed (it may move to a parent
  box, as the boxed form fields do).
- Touch targets ≥ 44 × 44 px; body text ≥ 16 px; form input text 16 px.
- Text contrast ≥ 4.5:1 (large text 3:1); input borders and meaningful icons ≥ 3:1. Rebuild
  `scripts/contrast.mjs` for the variant's palette and run it after any colour change.
- Text over photographs stays ≥ 4.5:1 against the **lightest** pixel behind it.
- Status is never colour alone (icon/dot + text). Errors are icon + text, linked to the field.
- Every form control has a visible label.
- Under `prefers-reduced-motion: reduce`, nothing animates and no motion library loads.
- Decorative images use `alt=""`; meaningful images use the alt text in §10.3.
- No horizontal scroll at 320 px.

**Performance (measured: Lighthouse mobile 88–89, desktop 100)**

- Homepage prerendered at build and served pre-compressed.
- All CSS inlined (`features.inlineStyles: true`), so there is no render-blocking stylesheet.
- Deferred hydration: header and hero hydrate when idle; every other section ≈ 400 px before it
  scrolls into view.
- Lazily loaded chunks: mobile menu, newsletter (vee-validate + yup + axios), chat panel, motion.
- Icons: only the glyphs in use, as raw SVG. Dates: built-in `Intl` (no date library).
- LCP image eager and high-priority, without `decoding="async"`.
- Images AVIF/WebP at quality 60. `sizes` uses breakpoint prefixes.
- Font: one family, Latin subset, only the weights used; preload only the H1 weight.

**SEO**

- Homepage: title, description, Open Graph + Twitter card (1200 × 630 image), canonical,
  `en_NG` locale, Organization JSON-LD (name, url, logo, description, slogan, `areaServed: NG`).
- Contact and Book a session: title, description, OG, canonical. Sign in: `noindex, nofollow`.
- `public/robots.txt` allows all and points to the sitemap. `public/sitemap.xml` currently lists
  only `/`; add `/contact` and `/book-a-session` when they go live.
- `<html lang="en-NG">`.

**Security headers** (all routes): `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=()`. Fonts and generated images are
cached for a year (immutable).

---

## 9. Assets

### 9.1 In the repository

| Path | What | Size | Used on | Source / licence | Status |
|---|---|---|---|---|---|
| `public/images/hero-session.jpg` | Two professionals working through a session plan on a laptop (tagged Lagos) | 2400 × 1600 | Hero; Sign up panel; Contact panel; basis of the OG image | Unsplash `KljeL88lgkk`, photographer Ninthgrid, Unsplash License | Interim stock, awaiting client photography |
| `public/images/beneficiary-session.jpg` | A young professional on a laptop at a desk (tagged Nigeria) | 2400 × 1602 | For You section; Sign in panel | Unsplash `FHIw9zOIHDY`, photographer Emmanuel Ikwuegbu, Unsplash License | Interim stock, awaiting client photography |
| `public/brand/naijapath-logo.png` | Wordmark for light backgrounds | 440 × 92 | Header, pages, mobile menu | Client-owned | Final (a vector original would be sharper) |
| `public/brand/naijapath-logo-light.png` | Wordmark for dark backgrounds / photos | 440 × 92 | Hero header, footer | Client-owned (derived light variant) | Final |
| `public/og-image.jpg` | Social share card | 1200 × 630 | Homepage OG / Twitter | Generated by `scripts/generate-brand-assets.mjs` from the hero photo | Regenerate when the hero photo or design changes |
| `public/apple-touch-icon.png` | Home-screen icon | 180 × 180 | `<link rel="apple-touch-icon">` | Generated by the same script | Regenerate per variant |
| `public/favicon.svg` | Favicon | SVG | `<link rel="icon">` | Project asset | Regenerate per variant |
| `public/robots.txt`, `public/sitemap.xml` | Crawling | — | — | — | Update the sitemap (§8) |
| `lucide-static` icons | Line icons | 24 px grid | Everywhere via `NIcon` | ISC licence (npm) | Style is a design choice |
| Authored marks in `utils/icons.ts` | LinkedIn, X, YouTube, WhatsApp-style glyphs | 24 px grid | Footer, assistant | Authored in the project | Restyle per variant |

### 9.2 Icon names in use (semantic → meaning)

`practitioners`, `zero-barrier`, `delivery-standard`, `partners` (trust stats) ·
`vetted`, `documentation`, `dashboard`, `audit-report` (commission features) ·
`beneficiary`, `practitioner`, `organisation` (audience cards) ·
`arrow-right`, `arrow-left`, `arrow-up-right`, `chevron-left`, `chevron-right`, `chevron-down`,
`check`, `check-circle`, `calendar-check`, `download`, `menu`, `close`, `star`, `quote`, `error`,
`map-pin`, `mail`, `eye`, `eye-off`, `user`, `lock`, `building`, `message`, `topic`,
`pause`, `play` · `linkedin`, `x`, `youtube`, `whatsapp`.

A variant may swap the glyph set. Keep the **names**, because templates and content reference them.

### 9.3 Asset rules (from the client's brief)

- Real photography of Nigerian professionals in genuine career-guidance settings: natural
  light, real offices, true skin tones.
- **Never** AI-generated people, clay avatars, isometric illustrations or "team high-five" stock.
- Hero photo: portrait 4:5, ≥ 1300 px tall. Beneficiary photo: square, ≥ 1100 px.
- Written model releases for client shoots, stored with the originals.
- Practitioner photos (future) alt text: `Profile photo of [Name], [Specialisation]`.
- Testimonial photos only with the beneficiary's written consent.
- Record every image in `IMAGE_CREDITS.md` (source, photographer, licence, where used).
- To replace a photo, drop the new file at the same path. Crops, formats and sizes are
  regenerated at build.

### 9.4 Assets the client has not supplied yet

Client photography (to replace both stock photos) · a vector brandmark · the programme brochure
PDF (`public/downloads/naijapath-programme-brochure.pdf`) · social profile URLs (LinkedIn, X,
YouTube) · the WhatsApp number · real testimonials (text, names, outcomes, consented photos) ·
verified practitioner profiles.

---

## 10. Content

### 10.1 Status of each content source

| Source | File | Status | Rule |
|---|---|---|---|
| Homepage copy | `home/domain/home-copy.ts` | **Locked**: verbatim from the client's *Homepage Content & Design Brief* (Oct 2026, v1.0) | Do not edit. Changes need client approval and a regenerated `content-lock.md`. |
| Homepage microcopy | `home/domain/home-microcopy.ts` | Not in the brief; **pending client review** | Plain, factual; no marketing claims |
| Standalone pages microcopy | `pages/domain/pages-microcopy.ts` | Not in the brief; **pending client review** | Same |
| Testimonials | `home/domain/home-testimonials.ts` | **None real yet**; three fictional design samples | Samples never ship to production |

The brief writes both "NaijaPath" and "Naijapath". Both are preserved exactly as written; ask
the client before unifying them. The brief's "→" on calls to action is drawn as an arrow icon
and is not part of the strings.

### 10.2 Locked homepage copy (verbatim)

#### 01 Navigation bar

- Logo: NaijaPath
- Links (in this order): Find Career Guidance (→ `/#for-you`) · How NaijaPath Works
  (→ `/#how-it-works`) · Commission a Programme (→ `/#commission`) · Join as a Career
  Practitioner (→ `/#join`)
- Secondary action: Sign In (→ `/sign-in`)
- Primary action: Book a Session (→ `/book-a-session`)

#### 02 Hero

- Tag: Nigeria's First Digital Career Service Platform
- Headline: Navigate your career with structured, verified guidance.
  (set as two lines: "Navigate your career with" / "structured, verified guidance.")
- Subheadline: Every session is professionally delivered, documented, and tracked. Career
  guidance that is accountable from the first appointment to the last report.
- Primary CTA: Find Career Guidance (→ `/find-career-guidance`)
- Secondary CTA: Commission a Programme (→ `/commission-a-programme`)
- Badge 1: 100% Funded Seats Available
- Badge 2: 4.9 / 5.0 (rating 4.9) · 98% Recommendation Rate

#### 03 Trust bar

| Number | Label | Sub-label |
|---|---|---|
| 350+ | Verified Career Practitioners | Across Nigeria and the global diaspora |
| ₦0 | Barrier for Beneficiaries | 100% funded slots for qualifying individuals |
| 5-Stage | Delivery Standard | Applied on every session, every time |
| 45+ | Partner Organisations | Commissioning quality career services |

#### 04 For Beneficiaries

- Label: FOR YOU
- Headline: Work with a verified career practitioner who documents your progress.
- Body:
  1. Every session on Naijapath follows a structured delivery process. Your practitioner
     prepares before you arrive, records what was discussed, agrees your next steps in writing,
     and tracks your progress over time.
  2. This is not casual advice. It is professional career guidance, delivered the way it should be.
- CTA: Find Career Guidance (→ `/find-career-guidance`)
- Supporting note: Free and subsidised sessions available for qualifying beneficiaries

#### 05 Commission a Programme

- Label: COMMISSION WITH CONFIDENCE
- Headline: Career services your organisation can commission, monitor, and report on.
- Body:
  1. Naijapath gives development organisations, government programmes, and corporate partners
     a structured platform to deliver career guidance at scale.
  2. Every session is documented. Every outcome is tracked. Every programme produces a reporting
     dataset you can take to your funders or leadership.
  3. Stop commissioning career activities you cannot measure. Start commissioning career services
     that are accountable from day one.
- Features: Fully vetted and credentialled career practitioners · Session-by-session
  documentation · Real-time programme dashboard · Audit-ready outcome reports
- Primary CTA: Commission a Programme (→ `/commission-a-programme`)
- Secondary CTA: Download Programme Brochure (→ `/downloads/naijapath-programme-brochure.pdf`)

#### 06 How NaijaPath Works: the 5-Stage Delivery Standard

- Label: CLEAR PROGRESSION
- Headline: Every session follows the same quality process.
- Subheadline: From the first booking to the final report, the Naijapath 5-Stage Delivery
  Standard ensures every beneficiary receives the same quality of service.

| # | Stage | Copy |
|---|---|---|
| 01 | Scheduling | Beneficiaries book with verified career practitioners through the platform. No informal arrangements. |
| 02 | Intake | Before every session, the beneficiary completes a structured intake. The practitioner arrives prepared. |
| 03 | Delivery | A professional, one-on-one career guidance session with a trained and credentialled career practitioner. |
| 04 | Documentation | After every session, the practitioner records what was discussed, the actions agreed, and the next steps. The beneficiary receives a copy. |
| 05 | Reporting | Outcome data is compiled and shared with the commissioning organisation or made available to the beneficiary. Every programme is evidence-based. |

#### 07 Social proof

- Label: WHAT CHANGES WHEN CAREER GUIDANCE HAS A STANDARD
- Headline: Structured Guidance. Impact you can verify.
- Subheadline: Every story here came through a structured career guidance process.
- CTA: Read More Stories (→ `/stories`)
- Testimonials: none supplied (the brief says to insert three beneficiary testimonials once
  collected). See §10.5.

#### 08 Join the Platform

- Label: YOUR NEXT MOVE
- Headline: Join NaijaPath

| Audience | Headline | Body | CTA |
|---|---|---|---|
| For Beneficiaries | Career guidance that takes your progress seriously. | Connect with a verified career practitioner. Book a session, receive structured guidance, and leave with a documented action plan. | Find Career Guidance → `/find-career-guidance` |
| For Career Practitioners | Deliver your expertise through a structured, professional platform. | Join a network of verified career practitioners. Get access to a managed platform, a growing client base, and a delivery standard that protects and elevates your professional practice. | Join as a Career Practitioner → `/join-as-a-career-practitioner` |
| For Organisations | Commission career services built to your programme goals. | Commission structured career guidance for your beneficiaries, staff, or CSR cohorts. Monitor delivery, track outcomes, and report to your funders with verified data. | Commission a Programme → `/commission-a-programme` |

#### 09 Footer

- Logo: NaijaPath
- Tagline: Structured career guidance for Nigeria and the world.
- **Platform:** Find Career Guidance (`/find-career-guidance`) · How NaijaPath Works
  (`/#how-it-works`) · Commission a Programme (`/commission-a-programme`)
- **Network:** Beneficiaries (`/beneficiaries`) · Join as a Career Practitioner
  (`/join-as-a-career-practitioner`) · Partner Organisations (`/partner-organisations`) · Code of
  Conduct (`/code-of-conduct`)
- **Resources:** Career Brief (Newsletter) (`/#career-brief`) · About Naijapath (`/about`) ·
  Privacy Policy (`/privacy-policy`) · Terms of Service (`/terms-of-service`)
- Newsletter: label "Career Brief"; note "Monthly career insights, sector updates, and guidance
  tools - straight to your inbox."; button "Subscribe"
- Copyright: © 2026 NaijaPath. All rights reserved.

### 10.3 Homepage microcopy (pending client review)

**Meta**

- Title: NaijaPath | Nigeria's First Digital Career Service Platform
- OG image alt: NaijaPath — Navigate your career with structured, verified guidance.
- Description, OG and Twitter text reuse the hero copy.

**Navigation:** "Contact" (→ `/contact`), added by the owner on 2026-11-20; not in the brief.

**Image alt text**

- Hero: A career practitioner and a young professional review a session plan together on a laptop
- Beneficiary: A young professional takes part in a virtual career guidance session on a laptop at a desk

**Accessibility labels:** Skip to main content · Main (primary nav) · Footer (footer nav) ·
NaijaPath home (logo link) · Open menu / Close menu / Menu · NaijaPath at a glance (trust stats
heading) · Platform highlights (hero badges) · The five stages · What your organisation gets ·
NaijaPath on social media · Illustration of the NaijaPath platform · Previous story / Next story /
Stories.

**Sample "Agreed Actions" session record (labelled as an illustration)**

- Eyebrow "Session record", title "Agreed Actions"
- Actions: Update CV with recent project outcomes · Apply to two graduate trainee programmes ·
  Prepare for a mock interview
- Practitioner: Chinedu O. (fictional) · recorded 2026-11-12 10:30 UTC (shown in Africa/Lagos time)
- Footer "Shared with you"; status "completed"

**Sample cohort dashboard (badge "Sample data")**

- Eyebrow "Programme dashboard", title "Cohort progress"
- Sessions completed 142 of 180 · Beneficiaries 60 enrolled · Interview conversion rate 38% of
  beneficiaries
- Chart "Sessions completed per week", W1–W8: 8, 12, 15, 17, 19, 22, 24, 25
- Screen-reader summary: "Sample data: sessions completed per week rose from 8 in week 1 to 25 in
  week 8."

**Footer:** location line "Abuja · Lagos · Diaspora".

**Newsletter states:** label "Email address" · placeholder "name@example.com" · sending
"Subscribing…" · success "Thank you. You are now subscribed to the Career Brief." · errors "Enter
your email address." / "Enter a valid email address, like name@example.com." / "We could not
subscribe you right now. Please try again in a moment."

**Error page:** "This page is not available yet" · "The page you are looking for has moved or is
not live yet." · "Back to the homepage".

**Testimonial badge:** "Sample testimonial" (on every sample card).

**Chat assistant script**

- Launcher "Chat with us" · close "Close chat" · title "NaijaPath assistant"
- Subtitle: "Automated help. The team can take over on WhatsApp." (no number configured:
  "Automated help. The team replies to messages by email.")
- Greeting: "Hello! I am NaijaPath's automated assistant. What would you like help with?"
- After each answer: "Anything else I can help with?" · typing: "The assistant is typing…"
- Conversation label "Conversation with the NaijaPath assistant" · "Suggested questions"
- "Continue on WhatsApp" (prefill: "Hello NaijaPath, I would like help with: <topic>") ·
  fallback "Send the team a message" → `/contact`

| Suggested question | Reply | Links |
|---|---|---|
| Find career guidance | Career guidance on NaijaPath is one-to-one with a career practitioner, and every session is documented. The quickest way to start is to request a session. | Book a session → `/book-a-session` · How NaijaPath works → `/#how-it-works` |
| Commission a programme | Organisations can commission career guidance for a group and follow progress as it happens. Tell the team about your programme and they will get back to you. | Commission a programme → `/#commission` · Contact the team → `/contact` |
| Join as a practitioner | Career practitioners can apply to join the NaijaPath network. This part of the page explains what is involved. | Join as a practitioner → `/#join` |
| Help with my account | You can sign in or create an account here. If something is not working, send the team a message. | Sign in → `/sign-in` · Contact the team → `/contact` |
| Talk to a person | Of course. The team can pick this up with you directly. | WhatsApp, or "Send the team a message" → `/contact` |

### 10.4 Standalone pages microcopy (pending client review)

**Shared**

- "Back to the homepage" · "Sending…" · "(optional)" · "Choose one"
- Full name / Email address (placeholder "name@example.com")
- Errors: "Enter your full name." · "Enter your email address." · "Enter a valid email address,
  like name@example.com." · "Keep this under {n} characters." · summary "Please fix the
  highlighted fields and try again." · fallback "We could not send this right now. Please try
  again in a moment."
- Server unavailable (from the proxy): "This service is not available right now. Please try
  again later."

**Sign in / Sign up** (`/sign-in`)

- Meta: "Sign in | NaijaPath" · "Sign in to your NaijaPath account, or create one."
- H1 "Welcome back" · lead "Sign in to see your sessions, agreed actions and progress."
- Tabs: "Sign in" | "Sign up" (group label "Sign in or create an account")
- Password label "Password" · "Enter your password." · toggle "Show password"
- Sign in: "Continue" → "Sign in" · "Signing in…" · "Signed in. Taking you to your account…" ·
  "We could not sign you in. Check your email and password and try again."
- Sign up: hint "At least 8 characters." · "Use at least 8 characters." · "By creating an
  account you agree to the Terms of Service and Privacy Policy." · "Create account" · "Creating
  your account…" · "Account created. Taking you to your account…" · "We could not create your
  account right now. Please try again in a moment."
- Below the form: "Trouble signing in? Contact us"

**Contact** (`/contact`)

- Meta: "Contact us | NaijaPath" · "Questions about career guidance, commissioning a programme
  or joining as a practitioner? Send the NaijaPath team a message."
- Eyebrow "Contact" · H1 "Talk to the NaijaPath team"
- Lead: "Questions about career guidance, commissioning a programme or joining as a career
  practitioner? Send us a message here and the team will reply to you by email."
- Fields: Full name · Email address · Organisation (optional) · "What is this about?" · Message
- Topics: A general question · Career guidance for myself · Commissioning a programme · Joining
  as a career practitioner · Partnerships · Press and media · Something else
- Errors: "Choose what your message is about." · "Write your message." · "Tell us a little more
  (at least 10 characters)."
- Button "Send message" · success "Thank you. Your message has been sent and we will reply by email."

**Book a session** (`/book-a-session`)

- Meta: "Book a session | NaijaPath" · "Request a career guidance session with a vetted
  NaijaPath practitioner. Tell us where you are and what you need."
- Eyebrow "Book a session" · H1 "Request a career guidance session"
- Lead: "Tell us where you are and what you need. We will match you with a vetted practitioner
  and confirm your session by email."
- "What happens next": 1. We review your request and match you with a practitioner. 2. You
  receive a confirmation email with your session time. 3. After the session, your agreed actions
  are shared with you.
- Fieldsets "About you" / "Your session"
- Phone number (optional), hint "Only used to reach you about this session.", error "Enter a
  valid phone number, like 0803 123 4567 or +234 803 123 4567."
- "Where are you in your career?": Student · Recent graduate · Early-career professional ·
  Experienced professional · Changing careers (error "Choose where you are in your career.")
- "What would you like help with?": Choosing a career direction · CV and job applications ·
  Interview preparation · Moving into a new field · Growing in my current role · Something else
  (error "Choose what you would like help with.")
- "Preferred time (West Africa Time)" (optional): Weekday mornings · Weekday afternoons ·
  Weekday evenings · Weekends · Any time
- "Tell us about your goals", hint "A few sentences is enough: what you are working towards and
  what is in the way.", errors "Tell us a little about your goals." / "Tell us a little more (at
  least 20 characters)."
- Consent: "I agree that NaijaPath may contact me about this request, as described in the
  Privacy Policy." (error "Tick the box so we can contact you about your session.")
- Button "Request my session" · success "Thank you. Your request has been received. Check your
  email for the next steps."

### 10.5 Testimonials

`TESTIMONIALS` (real, consented) is **empty**. A real entry needs: quote, name, verified outcome,
optional role, optional rating, optional consented photo (alt `Profile photo of [Name]`).

`SAMPLE_TESTIMONIALS` are **fictional design samples**. They render only in development, carry a
visible "Sample testimonial" label, and have no photos, stars or real employers. Never present
them as real, and never lock them into `content-lock.md`.

| Sample name (fictional) | Role | Outcome | Quote |
|---|---|---|---|
| Adaeze N. | Graduate, Enugu | Moved from job search into a graduate trainee role | I had advice from everyone and a plan from no one. My practitioner sent the session notes the same evening, and I worked through the agreed actions one by one. |
| Tunde B. | Career changer, Lagos | Changed careers into data analysis | The intake made me think before I arrived, so the whole hour went on my questions instead of catching up. |
| Halima S. | Programme manager, Abuja | Completed a funded cohort | Every session in our cohort was documented, so the report to our funder came straight from the platform. |

### 10.6 Content rules for every variant

- No invented testimonials, quotes, names, employers or statistics presented as real.
- No AI-generated imagery of people.
- Don't add marketing lines. New interface text goes in microcopy and is listed for client review.
- The chat assistant only repeats what the site already says, and always identifies itself as
  automated.

---

## 11. Building a new variant

1. **Branch** from `master` (e.g. `variant/<name>`). Keep `domain/`, `composition/`,
   `composables/`, `utils/`, `server/`, `types/`, `public/` content and the page SEO blocks.
2. **Replace the design layer:** new tokens in `assets/css/tailwind.css`, then restyle
   `components/n/**` and every template in `features/*/ui/**`. Keep component names, props,
   slots, ids, landmarks and ARIA wiring.
   - If you add `--text-*` or `--shadow-*` tokens, also add them to the `extendTailwindMerge`
     config in `app/utils/utils.ts`, or `cn()` will drop them.
   - The template resets the stock palette and radius scale (`--color-*: initial`,
     `--radius-*: initial`), so an undefined class renders nothing, silently.
3. **Keep the section order and anchor ids** from §6, so nav links, footer links and the chat
   assistant's links keep working.
4. **Regenerate brand assets** for the new look (`node scripts/generate-brand-assets.mjs`):
   OG image, touch icon, favicon.
5. **Rebuild the contrast list** in `scripts/contrast.mjs` for the new palette and run it.
6. **Verify:**
   - `npm run check` (format → lint → typecheck).
   - `npm run contrast`.
   - `node scripts/content-lock.mjs --check` with the dev server running: must report no copy
     differences. The microcopy added after the lock ("Contact" nav link, "Chat with us") is
     reported until the client approves it and `content-lock.md` is regenerated.
   - A browser pass at 320 / 375 / 768 / 1024 / 1280 / 1440 / 1920 px: no horizontal scroll,
     keyboard-only pass, reduced-motion pass, axe-core with zero violations.
   - Lighthouse mobile and desktop against a production build
     (`NUXT_BUILD_DIR=.nuxt-build npm run build` builds alongside a running dev server). Build
     on the OS you deploy to: the build bundles `sharp` binaries for the build machine.
7. **Configure** the environment (§7.4) for the variant's deployment.

---

## 12. Open items (all variants)

| Item | Owner | Effect until resolved |
|---|---|---|
| Confirm API base and the 5 endpoint paths/payloads (§7.3) | Platform team | Forms answer "service not available" |
| Confirm platform routes, including `/dashboard` after sign-in (§5.1) | Platform team | Links lead to the error page |
| WhatsApp number | Client | WhatsApp buttons hidden; fallback to `/contact` |
| Approve all microcopy (§10.3, §10.4); regenerate `content-lock.md` | Client | Content check reports differences |
| Real testimonials with consent | Client | Stories section shows only in dev (samples) |
| Client photography, vector brandmark, brochure PDF, social URLs | Client | Stock photos, PNG logo, missing download, non-link social icons |
| Verified practitioner profiles | Client / platform | Practitioners section stays omitted |
| Unify "NaijaPath" / "Naijapath" spelling? | Client | Both kept as written |
| Add `/contact` and `/book-a-session` to `sitemap.xml` | Developer | Not listed for crawlers |
