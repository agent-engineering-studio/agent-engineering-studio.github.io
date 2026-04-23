# Agent Engineering Studio — Coming Soon Site

Landing page "coming soon" per [Agent Engineering Studio](https://github.com/agent-engineering-studio), costruita con [Astro](https://astro.build).

## Setup

```bash
npm install
```

## Sviluppo locale

```bash
npm run dev          # http://localhost:4321
```

## Build di produzione

```bash
npm run build        # output in dist/
npm run preview      # preview della build
```

## Deploy

Il deploy su GitHub Pages avviene automaticamente via GitHub Actions al push su `main`.
Vedi `.github/workflows/deploy.yml`.

## Struttura

```text
src/
  layouts/BaseLayout.astro     # Layout base con <head>, meta, fonts
  pages/index.astro            # Landing page principale
  components/
    Hero.astro                 # Hero section con titolo e badge
    Pillars.astro              # 4 card aree dello studio
    Countdown.astro            # Timeline roadmap (non countdown numerico)
    NewsletterForm.astro       # Form email notify me
    SocialLinks.astro          # Link GitHub + social
    Footer.astro               # Footer minimal
  styles/global.css            # CSS custom properties, reset, utilities
public/
  favicon.svg                  # Favicon SVG
```

## Stack

- **Astro 5.x** — static site generator
- **CSS puro** — nessun framework CSS, tutto via custom properties
- **Google Fonts** — JetBrains Mono + Outfit
- **Zero JS runtime** — funziona con JS disabilitato
