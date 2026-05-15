# Refactoring tono community/laboratorio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire i testi del sito Agent Engineering Studio per riposizionarlo da "studio/startup" a "laboratorio + community di sperimentazione, formazione e divulgazione", senza modificare struttura, CSS o asset.

**Architecture:** Refactoring puramente testuale su 7 file Astro. Ogni task è una sostituzione `Edit` mirata su un singolo file con before/after esatti dallo spec. Verifica finale con build Astro e grep di sicurezza per termini banditi.

**Tech Stack:** Astro 4 (file `.astro`), nessun framework di test (sito statico). Verifica con `npm run build` e `Grep`.

**Spec di riferimento:** `docs/superpowers/specs/2026-05-15-tono-community-design.md`

---

## File coinvolti

Modifica (7 file, solo testo nel frontmatter o nell'HTML):
- `src/layouts/BaseLayout.astro` — meta `title` e `description` di default
- `src/components/Hero.astro` — tagline e subtitle
- `src/components/Pillars.astro` — array `pillars` (4 card)
- `src/components/BookSection.astro` — subtitle catalogo
- `src/components/SupportSection.astro` — titolo e descrizione card supporto
- `src/components/ProjectsSection.astro` — subtitle sezione progetti
- `src/pages/books/knowledge-graph.astro` — 2 paragrafi descrizione + 1 highlight

Nessun file da creare. Nessun file da eliminare. Nessun import/export modificato.

---

## Task 1: Meta SEO (`BaseLayout.astro`)

**Files:**
- Modify: `src/layouts/BaseLayout.astro:14-16`

- [ ] **Step 1: Sostituire `title` di default**

Old:
```astro
  title = 'Agent Engineering Studio — AI Agents dal Concept alla Release',
```

New:
```astro
  title = 'Agent Engineering Studio — Laboratorio & community su agenti AI',
```

- [ ] **Step 2: Sostituire `description` di default**

Old:
```astro
  description = 'Il laboratorio open-source per costruire AI agents: starter kit, template, demo end-to-end e best practice.',
```

New:
```astro
  description = 'Laboratorio aperto di sperimentazione, formazione e divulgazione su agenti AI: proof-of-concept, progetti open-source e materiale didattico.',
```

- [ ] **Step 3: Verifica visiva del file**

Aprire `src/layouts/BaseLayout.astro` e confermare che le righe 14-16 contengano i nuovi testi e che nient'altro sia cambiato.

---

## Task 2: Hero (`Hero.astro`)

**Files:**
- Modify: `src/components/Hero.astro:22-28`

- [ ] **Step 1: Sostituire tagline**

Old:
```astro
    <p class="hero__tagline animate-in animate-delay-1">
      Il laboratorio dove le idee diventano AI agents.
    </p>
```

New:
```astro
    <p class="hero__tagline animate-in animate-delay-1">
      Un laboratorio aperto per sperimentare con gli agenti AI.
    </p>
```

- [ ] **Step 2: Sostituire subtitle**

Old:
```astro
    <p class="hero__subtitle animate-in animate-delay-2">
      Starter kit, template, demo end-to-end e best practice &mdash; dal concept alla prima release.
    </p>
```

New:
```astro
    <p class="hero__subtitle animate-in animate-delay-2">
      Proof-of-concept, progetti open-source, appunti e materiale formativo &mdash; costruiti per imparare e condividere.
    </p>
```

---

## Task 3: Pillars (`Pillars.astro`)

**Files:**
- Modify: `src/components/Pillars.astro:7-28`

- [ ] **Step 1: Sostituire l'intero array `pillars`**

Old:
```astro
const pillars = [
  {
    icon: '\u{1F9E9}',
    title: 'Starter Kit',
    description: 'Template pronti per partire: agenti, tool, orchestrazioni. Fork e inizia.',
  },
  {
    icon: '\u{1F3D7}\u{FE0F}',
    title: 'Progetti End-to-End',
    description: 'Demo complete dal concept al deploy. Stack reali, codice funzionante.',
  },
  {
    icon: '\u{1F4D0}',
    title: 'Best Practice',
    description: 'Pattern, architetture e convenzioni testate. Impara dai nostri errori.',
  },
  {
    icon: '\u{1F680}',
    title: 'Community Lab',
    description: 'Contribuisci, testa, migliora. Ogni progetto è aperto e documentato.',
  },
];
```

New:
```astro
const pillars = [
  {
    icon: '\u{1F9EA}',
    title: 'Proof-of-Concept',
    description: 'Idee trasformate in prototipi funzionanti. Codice aperto, esperimenti riproducibili.',
  },
  {
    icon: '\u{1F52C}',
    title: 'Sperimentazione',
    description: 'Architetture, pattern e framework messi alla prova. Si pubblica quello che funziona — e anche quello che non funziona.',
  },
  {
    icon: '\u{1F393}',
    title: 'Formazione & Divulgazione',
    description: 'Libri, articoli e appunti tecnici. Per chi vuole capire cosa c\'è sotto il cofano degli agenti AI.',
  },
  {
    icon: '\u{1F91D}',
    title: 'Community',
    description: 'Discussioni aperte, contributi benvenuti. Ogni progetto è pubblico e documentato.',
  },
];
```

(Codepoint emoji: 🧪 1F9EA, 🔬 1F52C, 🎓 1F393, 🤝 1F91D — stessa convenzione `\u{...}` già usata.)

---

## Task 4: BookSection subtitle (`BookSection.astro`)

**Files:**
- Modify: `src/components/BookSection.astro:34-37`

- [ ] **Step 1: Sostituire subtitle catalogo**

Old:
```astro
      <p class="catalog__subtitle">
        Libri tecnici per sviluppatori, architect e decision maker
      </p>
```

New:
```astro
      <p class="catalog__subtitle">
        Libri tecnici per chi vuole imparare facendo
      </p>
```

(Titolo "Pubblicazioni" e il resto della sezione non si toccano.)

---

## Task 5: Support card (`SupportSection.astro`)

**Files:**
- Modify: `src/components/SupportSection.astro:20-23`

- [ ] **Step 1: Sostituire titolo**

Old:
```astro
      <h2 class="support-section__title">Supporta il Progetto</h2>
```

New:
```astro
      <h2 class="support-section__title">Supporta il laboratorio</h2>
```

- [ ] **Step 2: Sostituire descrizione**

Old:
```astro
      <p class="support-section__desc">
        Se questo progetto open-source ti è utile, considera di offrire un caffè per aiutare a mantenerlo attivo e in crescita.
      </p>
```

New:
```astro
      <p class="support-section__desc">
        Se gli esperimenti e il materiale del laboratorio ti sono utili, considera di offrire un caffè per tenere viva la community.
      </p>
```

(Il bottone "Help the project" e l'`aria-label` "Supporta il progetto" della `section` non si toccano: sono fine così.)

---

## Task 6: Projects subtitle (`ProjectsSection.astro`)

**Files:**
- Modify: `src/components/ProjectsSection.astro:53-57`

- [ ] **Step 1: Sostituire subtitle sezione**

Old:
```astro
      <h2 id="projects-heading" class="projects__title">Progetti</h2>
      <p class="projects__subtitle">
        Progetti open-source per sistemi multi-agente e AI engineering
      </p>
```

New:
```astro
      <h2 id="projects-heading" class="projects__title">Progetti</h2>
      <p class="projects__subtitle">
        Proof-of-concept aperti su agenti AI, sistemi multi-agente e Graph-RAG
      </p>
```

(Tutto il resto della scheda Knowledge Graph — descrizione progetto, architettura, moduli, agenti, pipeline, stack, services — rimane invariato.)

---

## Task 7: Pagina libro (`books/knowledge-graph.astro`)

**Files:**
- Modify: `src/pages/books/knowledge-graph.astro:33` (highlight)
- Modify: `src/pages/books/knowledge-graph.astro:142-146` (descrizione ¶2)
- Modify: `src/pages/books/knowledge-graph.astro:154-158` (descrizione ¶4)

- [ ] **Step 1: Sostituire highlight #6**

Old:
```astro
  { icon: '📊', label: 'Caso enterprise 18 mesi, ROI reale' },
```

New:
```astro
  { icon: '📊', label: 'Caso reale end-to-end di 18 mesi' },
```

- [ ] **Step 2: Sostituire paragrafo descrizione ¶2**

Old (riga ~142-146):
```astro
          <p>
            <strong>AI che Ragiona</strong> colma il divario fra teoria accademica e sistema enterprise
            che paga le bollette. Oltre <strong>500 pagine</strong> di codice Python eseguibile,
            architetture di produzione, calcoli di ROI difendibili davanti a un CFO e uno
            <strong>studio di caso end-to-end da 18 mesi</strong>.
          </p>
```

New:
```astro
          <p>
            <strong>AI che Ragiona</strong> colma il divario fra teoria accademica e sistema enterprise
            che paga le bollette. Oltre <strong>500 pagine</strong> di codice Python eseguibile,
            architetture di produzione e uno
            <strong>studio di caso end-to-end da 18 mesi</strong>.
          </p>
```

- [ ] **Step 3: Sostituire paragrafo descrizione ¶4**

Old (riga ~154-158):
```astro
          <p>
            Pensato per <strong>developer Python, AI/ML engineer e architect</strong> che cercano codice
            completo e pattern di produzione, ma anche per <strong>CTO, PM, consulenti AI e founder</strong>
            che vogliono casi d'uso per settore, ROI difendibili, modello di pricing e go-to-market.
          </p>
```

New:
```astro
          <p>
            Pensato per <strong>developer Python, AI/ML engineer e architect</strong> che cercano codice
            completo e pattern di produzione, ma anche per <strong>chi affianca team e progetti AI</strong>
            e cerca casi d'uso concreti per settore.
          </p>
```

(Bio autore "AI Senior Software Architect @ Hevolus Innovation" e tutto il resto della pagina — TOC, stack, formati, community card — restano invariati per scelta esplicita.)

---

## Task 8: Verifica build

**Files:** nessuno (solo run)

- [ ] **Step 1: Build Astro**

Run:
```bash
npm run build
```

Expected: build conclusa senza errori e senza nuovi warning rispetto al baseline (`main` pre-refactor). Se compaiono warning nuovi, investigare prima di proseguire.

- [ ] **Step 2: Grep di sicurezza — termini che NON devono più comparire nei sorgenti**

Eseguire (con Grep tool) sulla cartella `src/`:

| Pattern | Atteso |
|---|---|
| `decision maker` | 0 risultati |
| `dal concept alla` | 0 risultati |
| `ROI difendibili` | 0 risultati |
| `go-to-market` | 0 risultati |
| `Starter Kit` | 0 risultati |
| `Best Practice` | 0 risultati |
| `Community Lab` | 0 risultati |
| `Supporta il Progetto` | 0 risultati |
| `Caso enterprise` | 0 risultati |

(Lo spec e il piano in `docs/` possono ancora contenere questi termini — è documentazione delle modifiche, non sorgente. Filtrare con `path: src/`.)

- [ ] **Step 3: Grep di presenza — termini che DEVONO comparire**

| Pattern | Dove (atteso) |
|---|---|
| `Proof-of-Concept` | `Pillars.astro` |
| `Sperimentazione` | `Pillars.astro` |
| `Formazione & Divulgazione` | `Pillars.astro` |
| `Supporta il laboratorio` | `SupportSection.astro` |
| `Laboratorio & community` | `BaseLayout.astro` |
| `Un laboratorio aperto per sperimentare` | `Hero.astro` |
| `imparare facendo` | `BookSection.astro` |
| `Proof-of-concept aperti` | `ProjectsSection.astro` |

---

## Task 9: Commit finale

- [ ] **Step 1: Verifica stato git**

Run: `git status`
Expected: 7 file modificati in `src/`, nessun file untracked dovuto al refactor.

- [ ] **Step 2: Diff review**

Run: `git diff src/`
Expected: solo cambi testuali coerenti con i task 1-7. Nessun cambio CSS o struttura.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Hero.astro src/components/Pillars.astro src/components/BookSection.astro src/components/SupportSection.astro src/components/ProjectsSection.astro src/pages/books/knowledge-graph.astro
git commit -m "$(cat <<'EOF'
refactor(copy): riposiziona tono da studio a laboratorio/community

Sostituisce i testi product/enterprise (starter kit, decision maker,
ROI difendibili, go-to-market, end-to-end) con vocabolario di
sperimentazione, formazione e divulgazione (proof-of-concept,
sperimentazione, appunti, community). Struttura, CSS, asset e bio
autore libro invariati.

Vedi: docs/superpowers/specs/2026-05-15-tono-community-design.md
EOF
)"
```

Expected: commit creato, working tree clean.

---

## Self-review

- ✓ Spec coverage: tutti i 7 file dello spec hanno un task. Le 3 modifiche alla pagina libro coprono i 3 punti dello spec (¶2, ¶4, highlight #6). La bio autore è esplicitamente non toccata in entrambi.
- ✓ No placeholders: ogni step ha before/after o comando concreto.
- ✓ Verifica: task 8 chiude il loop con build + grep banditi + grep presenti.
- ✓ Scope: nessun cambio fuori dai 7 file elencati.
