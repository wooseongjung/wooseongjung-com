# CLAUDE.md — wooseongjung-com

## Session Rules

- **Never lower quality or skip tasks** when approaching the context limit.
- **Before the context window fills up**, proactively run `/compact` to save a full summary of the current task, progress, pending items, and key decisions.
- **When a new session starts after token reset**, immediately read this file and resume the pending task from where it left off — do not ask "what were we doing?" or wait for the user to re-explain.
- **Auto-resume**: If `## Pending Task` below is non-empty, pick it up automatically at the start of the session.
- **MUST NOT send screenshots of the webpage to the user.** Use preview tools for internal debugging only. Never show screenshot output to the user.

---

## Project Overview

Personal portfolio website built with **React + Vite + Tailwind CSS**.
Dark mode supported via `dark:` Tailwind prefixes.

### Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main router, project list, buggy detail page (inline), slug mappings |
| `src/components/FYPDetail.jsx` | FYP project page (5G Vehicular Fog Computing) with simulation panel |
| `src/components/HackABot2025Detail.jsx` | Hack-A-Bot 2025 — AI Classroom Camera (3rd place) |
| `src/components/HackABot2026Detail.jsx` | Hack-A-Bot 2026 — GridBox Smart Factory Controller |
| `src/components/SimulationLab.jsx` | Interactive NS-3 simulation widget for FYP |
| `src/components/PreRunResults.jsx` | Pre-run simulation results for FYP |
| `src/components/CircuitBackground.jsx` | Canvas-based animated circuit trace background |
| `src/components/DomainExpansion.jsx` | Ryoiki Tenkai per-project SVG transition overlays |
| `public/images/logos/` | Sponsor/org logos (PNG, SVG) |
| `public/images/hackabot-2025/` | 2025 hackathon photos |
| `public/images/hackabot-2026/` | 2026 hackathon photos |
| `design.md` | Ver2 complete redesign specification |

### Routing

- `slugByProjectId` / `projectIdBySlug` maps in App.jsx
- Routes: `/project/:slug` → conditional render of detail components
- Buggy page is inline in App.jsx (not a separate component)

### FYP Specifics

- Supervised by **Dr. Khairi Hamdi** (Senior Lecturer, EEE, UoM)
- Has interactive simulation panel (slide-in from left)
- `sim-panel-tab`, `sim-panel-backdrop`, `sim-panel`, `fyp-content-wrapper.shifted` CSS classes

### Available Plugins & Skills

**Figma** (`figma@claude-plugins-official`):
- `figma:figma-implement-design` — Figma → production code
- `figma:figma-use` — write to Figma canvas (mandatory before `use_figma` calls)
- `figma:figma-generate-design` — code → Figma screens
- `figma:figma-generate-library` — build design system in Figma
- `figma:figma-code-connect` — Code Connect mapping files
- `figma:figma-create-design-system-rules` — project-specific design rules

**Frontend Design** (`frontend-design@claude-plugins-official`):
- `frontend-design:frontend-design` — production-grade UI with high design quality

**Preview Tools** (built-in MCP):
- `preview_start`, `preview_screenshot`, `preview_click`, `preview_fill`, `preview_snapshot`, `preview_inspect`, `preview_console_logs`, `preview_network`, `preview_resize`
- Launch config: `.claude/launch.json` (npm run dev, port 5199, cwd: wooseongjung-com)

### Sponsor Logos Available

**2026 Hackathon (14):** Robosoc (.svg), EEESoc (.svg), Makerspace (.png), UoM (.png), ARM (.svg, highlighted), Quanser (.svg), Cradle (.png, darkBg), Amentum (.svg), Ice Nine (.svg), GDG (.png), UKRI (.png), RAICo (.png), Domino's (.svg), Red Bull (.png, darkBg)

**2025 Hackathon (8):** UoM, Robosoc, Amentum, Cradle (darkBg), Domino's, Ice Nine, Makerspace, Red Bull (darkBg)

**FYP:** UoM only

---

## Completed Tasks (ver1)

- [x] Restyled all 3 project detail pages (FYP, 2025, 2026) to match buggy page skim-readable style
- [x] Standardized typography across all pages (removed prose, consistent font scale)
- [x] Added hero photos: 2025 camera mount, 2026 workbench (resized for web)
- [x] Sponsor logo grids: 14 for 2026, 8 for 2025, UoM for FYP
- [x] Fixed white-on-transparent logos (Red Bull, Cradle) with dark cell backgrounds
- [x] Added Dr. Khairi Hamdi supervisor info to FYP
- [x] Removed false 96/100 AI-estimated score from 2026 hackathon
- [x] Added build gallery to 2026 page (4 photos)
- [x] Switched makerspace to .png, robosoc to .svg
- [x] Ver1 animation upgrade (framer-motion, scroll reveals, page transitions, Domain Expansion, circuit bg)

---

## Pending Task — Ver2 Complete Redesign

**Goal**: Completely new design for wooseongjung.com. Discard all ver1 design decisions. Keep ONLY the content/data from ver1 (project descriptions, personal info, links, images). Follow `design.md` specification.

**Status**: Writing `design.md` spec, then implementation.

**User Profile**:
- Wooseong Jung, South Korean, INTJ
- BEng EEE, University of Manchester
- Anime: Detective Conan, Jujutsu Kaisen
- Music: Beenzino, Jazzyfact (Korean hip-hop/jazz)
- Keep: GitHub/LinkedIn/email links, lucide-react switch icons, project content, dark/light mode

**Key Libraries to Consider**: GSAP, Lottie, React

**Focus Areas**:
1. Animations that attract and retain users
2. Footprint/main page design
3. Project list with compelling navigation
4. Individual project pages with impact
