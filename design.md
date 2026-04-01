# Ver2 Design Specification — wooseongjung.com

> **Principle**: Every pixel moves with purpose. The site should feel like opening a premium, hand-crafted portfolio — not a template. Users should want to scroll, click, and explore.

---

## 1. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 19 + Vite 7 | Fast, modern React with native ESM bundling |
| Styling | Tailwind CSS 3.4 | Utility-first, rapid prototyping, dark mode support |
| Animation Engine | **GSAP 3.14** + `@gsap/react` | Timeline orchestration, ScrollTrigger, SplitText, Flip — industry standard for animation-heavy sites |
| Scroll | **Lenis** (`lenis/react`) | Buttery smooth scroll, syncs with GSAP ticker |
| Micro-animations | **Lottie** (`@lottiefiles/dotlottie-react`) | Lightweight WASM-rendered vector animations for icons/transitions |
| Routing | React Router 7 | Client-side routing with slug support |
| Icons | lucide-react | Consistent icon set with switch/toggle icons |

---

## 2. Design Philosophy

### Identity Keywords
- **Precision** — electronic engineering, VLSI, control systems
- **Depth** — layered, parallax
- **Rhythm** — jazz-influenced timing, not robotic easing
- **Confidence** — INTJ, strategic, intentional
- **Korean Aesthetic** — clean, modern, subtle cultural nods

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `void` | `#050507` | Primary background |
| `surface` | `#0c0c10` | Card/panel background |
| `surface-elevated` | `#141418` | Hover states, modals |
| `border` | `#1e1e24` | Subtle borders |
| `text-primary` | `#e8e6e1` | Headings |
| `text-secondary` | `#8a8a8f` | Body text |
| `text-muted` | `#4a4a52` | Labels, captions |
| `accent-gold` | `#d4a843` | Primary accent — links, highlights, active states |
| `accent-ember` | `#e8734a` | Secondary warm accent — tags, hover glow |
| `accent-ice` | `#5b9cf5` | Tertiary cool accent — tech labels, code |
| `light-bg` | `#f7f6f3` | Light mode background |
| `light-surface` | `#ffffff` | Light mode cards |
| `light-text` | `#1a1a1e` | Light mode text |

### Typography

| Role | Font | Weight | Tracking |
|------|------|--------|----------|
| Display (h1) | **Space Grotesk** | 700 | -0.03em |
| Heading (h2-h3) | **Space Grotesk** | 600 | -0.02em |
| Body | **Inter** | 400 | 0 |
| Mono / Labels | **JetBrains Mono** | 400 | 0.05em |

---

## 3. Page Structure & Animation Map

### 3.1 Loading / Intro Sequence (first visit only)

**Duration**: ~2.5s total

1. **Black screen** → single horizontal gold line draws from center outward (0-0.8s)
2. Line **splits vertically** to form a minimal "W" letterform (0.8-1.4s)
3. "W" morphs/scales down to become the logo in the header (1.4-2.0s)
4. **Content reveals**: header fades in, hero text chars stagger up from below masked containers (2.0-2.5s)
5. Smooth scroll unlocked — Lenis activates

**Tech**: Single GSAP master timeline. Gate scroll with `lenis.stop()` / `lenis.start()`. Store `sessionStorage.introPlayed` to skip on revisit.

---

### 3.2 Main Page — Footprint (scrollable single page)

The main page IS the experience. Not just "About" — it's a **scrollable narrative** of who Wooseong is.

#### Section A: Hero (viewport 1)

**Layout**: Full viewport. Text left-aligned, offset 15% from left.

**Content**:
- Name: "Wooseong Jung" — SplitText chars reveal, staggered 0.03s each
- Subtitle: "Electronic Engineer" — typed/revealed 0.2s after name
- Korean name "정우성" — large, ghosted at 3% opacity, parallax drift (data-speed="0.3")
- One-liner tagline: "I build systems from silicon to software." — fade up 0.4s after subtitle

**Ambient Animation**:
- A subtle **oscilloscope wave** SVG in the background, animated with GSAP — sine wave with slight noise, gold stroke at 5% opacity
- Cursor-following radial gradient glow (only on desktop) — `gsap.quickTo` with 0.4s lag

**CTA**: "Explore My Work" — magnetic button (moves toward cursor on hover, springs back on leave). On click, smooth-scrolls to Section B.

#### Section B: Signal — Who I Am (viewport 2)

**Layout**: Two-column on desktop, single on mobile.

**Left column**: Brief bio paragraph (3-4 sentences). Fade-up on scroll.

**Right column**: Rotating "signal cards" — 3 cards that cycle through key facts:
- Card 1: "Final Year · BEng Electronic Engineering · University of Manchester"
- Card 2: "Republic of Korea Air Force · Avionics Maintenance · 2022-2024"
- Card 3: "Hack-A-Bot 2025 · 3rd Place · AI Classroom Camera"

Cards stack/rotate using GSAP Flip — each visible for 3s, smooth transition between them. User can also click to manually advance.

**Scroll-triggered**: Left text fades up, right cards animate in from right with slight rotation.

#### Section C: Technical Arsenal (viewport 3)

**Layout**: Full-width horizontal scroll section (pinned).

The user scrolls vertically, but the content scrolls **horizontally** through skill categories:

| Panel 1 | Panel 2 | Panel 3 |
|---------|---------|---------|
| Hardware & EDA | Software & Control | Frameworks & Tools |
| Altium, Solidworks, etc. | C/C++, Python, etc. | Gazebo, Docker, etc. |

Each panel is a full-viewport card. Skills appear as **floating tags** that drift in from random positions and settle into a grid — GSAP stagger with physics-like easing.

**Visual**: Each panel has a unique subtle Lottie background animation:
- Hardware: circuit board trace drawing
- Software: terminal cursor blinking with code lines appearing
- Tools: gear mesh rotating

**Scroll indicator**: Small horizontal progress bar below the pinned section showing which panel is active.

#### Section D: Project Showcase (viewport 4-5) ⭐

**THE most important section.** This is where users decide to click into projects.

**Layout**: NOT a list. A **gallery/showcase** with dramatic reveals.

Each project is a **full-width card** that reveals as you scroll into it:

1. **Scroll into view** → card background darkens, project image/visual scales up from 80% to 100%
2. **Title** splits in from left (SplitText word-by-word)
3. **Category tag** slides in from right
4. **Description** fades up
5. **"Enter Project →"** button pulses subtly with gold glow

**Project Cards — Visual Treatment**:
- **FYP (5G VFC)**: Background visual = animated network topology (SVG nodes + lines pulsing) — represents wireless signal propagation
- **HackABot 2026 (GridBox)**: Background = the actual hero.jpeg with a subtle ken-burns zoom
- **HackABot 2025 (Camera)**: Background = camera viewfinder overlay with crosshairs
- **Buggy**: Background = the hero.jpg with circuit overlay blend
- **Baby Spyder**: Background = wireframe quadruped skeleton animation (Lottie or SVG)
- **VLSI**: Background = silicon die macro texture with scan-line sweep

**Interaction**: Hovering a project card triggers:
- Image slight zoom (1.03x)
- Title color shifts to accent-gold
- A **magnetic pull** on the "Enter Project →" button

**Clicking** → triggers a **page transition overlay** (see Section 3.5).

#### Section E: Timeline / Journey (viewport 6)

**Layout**: Vertical timeline, left-aligned.

**Animation**: As user scrolls, a gold line **draws downward** in real-time (scrubbed to scroll position). Each milestone node lights up as the line reaches it. Content for each milestone fades/slides in from the side.

**Milestones**:
1. 2021 — University of Manchester (start)
2. 2022 — Republic of Korea Air Force
3. 2024 — Return to studies
4. 2025 — Hack-A-Bot (3rd place), Baby Spyder, VLSI project
5. 2025-2026 — Final Year Project (5G VFC)
6. 2026 — Hack-A-Bot 2026 (GridBox)

#### Section F: Beyond Engineering (viewport 7)

**Content**: Fashion, gastronomy, music interests + WSJ Record link + Daily Curation AI.

**Layout**: Masonry-style cards with parallax depth (different `data-speed` values per card).

**WSJ Record card**: Large, cinematic card with vinyl disc Lottie animation spinning continuously. On hover, disc speeds up. Click → navigates to `/record`.

#### Section G: Contact (viewport 8 — final)

**Layout**: Centered, minimal.

**Content**:
- "Let's build something." — SplitText reveal
- Three contact methods (Email, LinkedIn, GitHub) as **magnetic icon buttons** with labels that slide in on hover
- AI Icebreaker Drafter (Gemini-powered email draft generator)

**Ambient**: Faint particle/dust effect drifting upward — suggests ideas floating.

---

### 3.3 Project Detail Pages

Each project detail page is a **mini-experience**, not just a documentation page.

#### Transition = Page Arrival (Domain Expansion)

There is no separate "transition screen." The transition IS the page building itself. When you click a project, you are immediately on the detail page — and its visual identity assembles around you. The project's unique visual language (its "domain") is baked into the page design itself, and the first ~0.6s of being on the page is the domain materializing.

**How it works**: Route changes instantly. The detail page mounts with its decorative elements at `opacity: 0` / `scale: 0` / `pathLength: 0`. A GSAP timeline on mount animates them into their resting state. The content (title, text, images) staggers in naturally behind the visual elements. The user never waits — they're already reading content by the time the last decorative element settles.

**Per-project page visual identity**:

- **FYP (5G VFC)** — The page has faint concentric signal rings as a persistent background pattern (gold, 4-5% opacity). On mount, these rings expand outward from center over ~0.4s, then settle as static decor. The title and stats animate in over the rings. The rings remain as the page's visual identity while scrolling.

- **HackABot 2026 (GridBox)** — The page has a subtle factory grid overlay (thin lines, ~3% opacity) that persists as background texture. On mount, horizontal lines draw left-to-right, verticals draw top-to-bottom (~0.3s), nodes pulse at intersections — then the grid fades to its resting opacity as content appears over it. The grid IS the page's design language.

- **HackABot 2025 (Camera)** — The page has a permanent camera viewfinder frame: corner brackets, subtle crosshair, and thin rule lines. On mount, these elements draw/appear from center outward (~0.3s), then the hero image and title materialize inside the viewfinder frame. The viewfinder elements persist as the page's visual identity.

- **Buggy** — The page has circuit trace decorations running along the edges/margins as persistent design elements. On mount, traces draw from a center chip icon outward (~0.4s), component shapes pop at endpoints, then traces dim to resting opacity as content fills the page. The circuit motif frames all content.

**Duration**: ~0.5-0.7s for domain elements to settle. Content begins appearing at ~0.2s (no waiting). Total perceived load: instant — the page is usable immediately, the domain just adds visual drama as it assembles.

**Back navigation**: Persistent "← Back to Projects" in top-left. On click, content fades while domain elements reverse-animate (traces retract, rings collapse, grid folds), then route switches back.

#### Detail Page Layout

Each page follows the same content structure, but wrapped in its unique domain visual language:

**Hero zone** (top viewport):
- Project's domain background pattern (persistent, see above)
- Hero image/visual with parallax (scrolls at 0.7x speed)
- Title — SplitText word reveal over ~0.3s
- Category + year tags — slide in
- Quick-stats bar — counters count up on scroll

**Content zone**:
- Sections fade-up on scroll (GSAP ScrollTrigger)
- Charts/graphs animate their data on scroll entry
- Image galleries with smooth scale-up on click
- Domain background pattern subtly continues / fades as you scroll deeper

---

### 3.4 Navigation

**Header**: Minimal, transparent — blurs and gains background on scroll.

**Nav items**: About · Projects · Life · Contact — smooth-scroll to sections on the main page. On detail pages, these navigate back to the main page at the correct section.

**Active indicator**: Gold underline that morphs/slides between items based on scroll position (GSAP ScrollTrigger + scrub).

**Logo**: "WJ" monogram — rotates subtly on hover. Click scrolls to top (main page) or navigates home (detail pages).

**Social icons**: Mail, LinkedIn, GitHub — magnetic hover effect (icons pull toward cursor).

**Dark/Light toggle**: Sun/Moon with rotation swap animation.

**Mobile**: Hamburger → full-screen overlay menu with staggered link reveals. Background blurs.

---

### 3.5 Page Transition System

Transitions are lightweight — no overlay screens, no blocking animations.

**Main page → Project detail**:
1. Clicked card content crossfades to black (~0.15s)
2. Route changes immediately
3. Detail page mounts → domain materializes + content staggers in (~0.5s)

**Project detail → Main page**:
1. Domain elements reverse-animate (retract/collapse, ~0.3s) while content fades
2. Route changes
3. Main page content fades in, auto-scrolled to project showcase section

**Between main page sections**: No route changes — just smooth scroll (Lenis).

**Implementation**:
- React context for transition state
- Each detail page owns its own mount animation via `useGSAP`
- No global overlay component needed — the page IS the transition
- `useGSAP` cleanup handles reverse on unmount

---

## 4. Micro-Interactions

| Element | Interaction | Animation |
|---------|-------------|-----------|
| **Buttons** | Hover | Magnetic pull + subtle gold glow border |
| **Buttons** | Click | Scale 0.95 → 1.0 spring bounce |
| **Links** | Hover | Underline draws from left to right |
| **Cards** | Hover | Lift (y: -4px) + shadow expansion + border glow |
| **Skill tags** | Hover | Scale 1.08 + color shift to accent |
| **Images** | Hover | Subtle zoom 1.03x with brightness shift |
| **Nav underline** | Scroll | Morphs width/position based on active section |
| **Scroll progress** | Scroll | Thin gold line at very top of viewport |
| **Cursor** | Move | Custom cursor dot (desktop only) with trailing glow |
| **Dark mode** | Toggle | Icon rotate + cross-fade, background color morphs |
| **Numbers/stats** | Scroll in | Count-up animation from 0 |
| **Section labels** | Scroll in | Gold dot appears, line draws from dot to right edge |

---

## 5. Responsive Strategy

| Breakpoint | Behavior |
|------------|----------|
| `<640px` (mobile) | Single column, no horizontal scroll, simplified animations, no cursor effects, no magnetic buttons, Lottie animations paused off-screen |
| `640-1024px` (tablet) | Two-column where applicable, reduced parallax |
| `>1024px` (desktop) | Full experience with all animations, cursor effects, horizontal scroll |

**`prefers-reduced-motion`**: Disable all GSAP animations, show content statically. Lottie players paused. Smooth scroll disabled.

---

## 6. Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Total Bundle (JS) | <200KB gzipped |
| Lottie files | <50KB each (.lottie format) |
| Images | WebP, lazy-loaded, srcset |
| GSAP | ~30KB gzipped (tree-shaken) |
| Lenis | ~5KB gzipped |

**Optimization**:
- Dynamic import GSAP plugins (`ScrollTrigger`, `SplitText`) only when needed
- Lottie files lazy-loaded per section
- `will-change: transform` on animated elements, removed after animation
- `IntersectionObserver` to pause off-screen animations
- Image optimization: WebP with fallback, proper sizing

---

## 7. Content to Include

### Personal Info
- Name: Wooseong Jung (정우성)
- Title: Electronic Engineer
- University: University of Manchester, BEng Electronic Engineering
- Expected: First-Class (80%)
- Military: Republic of Korea Air Force, Avionics Maintenance, Sep 2022 – Jun 2024

### Projects (6 total, 4 have detail pages)
1. **5G VFC Architecture Simulation** (FYP) — ns-3.46 + 5G-LENA, Dr. Khairi Hamdi supervisor
2. **GridBox — Smart Factory Controller** (HackABot 2026) — Raspberry Pi Pico 2, SCADA
3. **Baby Spyder Robot** — ROS 2, 12-servo quadruped
4. **AI Classroom Camera** (HackABot 2025, 3rd Place) — Raspberry Pi 5, PoseNet
5. **VLSI Logic Cell Optimization** — Tanner EDA, 0.553ns delay
6. **Autonomous Line-Following Buggy** (Best Looking) — STM32, PID control, 76% accuracy

### Links
- Email: wooseongjung12@gmail.com
- LinkedIn: https://www.linkedin.com/in/wooseong-jung-21b143223/
- GitHub: https://github.com/wooseongjung

### Skills
- Hardware & EDA: Altium, Solidworks, Tanner EDA, LT Spice, Xilinx, NI Multisim, STM32 Nucleo, Raspberry Pi
- Software & Control: C/C++, Python, Assembly, VHDL, ROS 2, Matlab/Simulink, JavaScript/React
- Frameworks & Tools: Gazebo, Docker, Git, Firebase, ns-3, SUMO, Linux/Ubuntu

### Features
- Dark/light mode toggle (light first default)
- Firebase auth (Google sign-in)
- Gemini AI daily curation generator
- Gemini AI icebreaker email drafter
- WSJ Record music player (/record route)
- FYP interactive Simulation Lab panel
- Buggy sensor data charts (Recharts)
- Sponsor logo grids for hackathon pages
- lucide-react icons for social links

---

## 8. File Structure (planned)

```
src/
  App.jsx                          — Root: Lenis wrapper, GSAP context, router, transition system
  components/
    layout/
      Header.jsx                   — Nav, logo, social, dark mode
      Footer.jsx                   — Minimal footer
      SmoothScroll.jsx             — Lenis + GSAP ticker sync
      PageTransition.jsx           — Overlay wipe system
      CustomCursor.jsx             — Custom cursor (desktop only)
    main/
      IntroSequence.jsx            — First-visit loading animation
      HeroSection.jsx              — Name, subtitle, oscilloscope bg
      SignalSection.jsx             — Bio + rotating signal cards
      ArsenalSection.jsx           — Horizontal scroll skill panels
      ProjectShowcase.jsx          — Full-width project gallery ⭐
      TimelineSection.jsx          — Scroll-driven journey timeline
      BeyondSection.jsx            — Interests, WSJ Record, curation
      ContactSection.jsx           — Contact methods + AI drafter
    projects/
      FYPDetail.jsx                — 5G VFC project with simulation panel
      HackABot2025Detail.jsx       — AI Classroom Camera project
      HackABot2026Detail.jsx       — GridBox Smart Factory project
      BuggyDetail.jsx              — Autonomous Buggy project with sensor charts
      ProjectDetailLayout.jsx      — Shared layout wrapper for all detail pages
    shared/
      MagneticButton.jsx           — Reusable magnetic hover button
      SplitTextReveal.jsx          — Reusable SplitText wrapper
      AnimatedCounter.jsx          — Count-up number animation
      SectionLabel.jsx             — Gold dot + drawing line
    buggy/
      SensorCharts.jsx             — Recharts-based sensor data visualizations
    SimulationLab.jsx              — Interactive NS-3 simulation widget for FYP
    PreRunResults.jsx              — Pre-run simulation results display
    MusicPlayer.jsx                — WSJ Record music playback experience
  hooks/
    useGSAPContext.js              — Shared GSAP context
    useMagnetic.js                — Magnetic button logic
    useCustomCursor.js            — Cursor tracking
  styles/
    index.css                      — Base styles, fonts, custom properties
  assets/
    lottie/                        — .lottie animation files
```

---

## 9. Implementation Order

1. **Foundation** — Install GSAP, Lenis, Lottie. Set up SmoothScroll wrapper, GSAP plugin registration, color tokens in Tailwind config, font imports.
2. **Layout Shell** — Header, footer, routing structure, page transition system.
3. **Hero + Intro** — IntroSequence, HeroSection with SplitText and oscilloscope.
4. **Project Showcase** — The most important section. Full-width project cards with scroll-triggered reveals, hover interactions, background visuals.
5. **Project Detail Pages** — Enhanced detail pages with new entry transitions, parallax hero, animated stats.
6. **Signal + Arsenal** — Bio section, horizontal scroll skills.
7. **Timeline** — Scroll-driven gold line + milestones.
8. **Beyond + Contact** — Interest cards, WSJ Record, contact.
9. **Micro-interactions** — Cursor, magnetic buttons, hover effects, counters.
10. **Mobile** — Responsive adaptations, performance.
11. **Polish** — Loading states, error handling, prefers-reduced-motion, final QA.
