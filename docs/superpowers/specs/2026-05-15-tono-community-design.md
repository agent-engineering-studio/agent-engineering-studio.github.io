# Refactoring tono "community/laboratorio" — Design

**Data:** 2026-05-15
**Autore:** Giuseppe Zileni
**Stato:** approvato per implementazione

## Obiettivo

Riposizionare i messaggi del sito da tono "studio / startup / prodotto"
a tono "community + laboratorio personale di sperimentazione, formazione
e divulgazione su agenti AI", per evitare sovrapposizioni percepite con
il ruolo lavorativo principale (AI Senior Software Architect @ Hevolus
Innovation).

## Principi

1. **Sottrazione, non aggiunta.** Niente disclaimer espliciti del tipo
   "questo non è un'attività commerciale". Cambio di tono per
   sottrazione del vocabolario product/enterprise.
2. **Bio autore libro intatta.** Sulla pagina libro la menzione "AI
   Senior Software Architect @ Hevolus Innovation" resta — è
   biografica e fattuale.
3. **Tecnica sì, vendita no.** Le sezioni tecnico-descrittive
   (architettura, moduli, agenti, pipeline, stack) restano: descrivono
   un sistema, non lo vendono.
4. **Struttura invariata.** Stesse sezioni, stessi componenti, stessa
   navigazione. Cambiano solo i testi.

## Vocabolario

| Sparisce | Entra |
|---|---|
| starter kit | proof-of-concept |
| end-to-end (come buzz) | sperimentazione |
| best practice | appunti / materiale formativo |
| dal concept alla release | imparare facendo |
| decision maker | (rimosso) |
| ROI difendibili, CFO, go-to-market | (rimosso) |
| CTO / PM / founder | chi affianca team e progetti AI |
| AI engineering (come headline) | divulgazione, formazione, community |

## Modifiche per file

### `src/layouts/BaseLayout.astro`
- **title default**:
  `Agent Engineering Studio — AI Agents dal Concept alla Release`
  → `Agent Engineering Studio — Laboratorio & community su agenti AI`
- **description default**:
  `Il laboratorio open-source per costruire AI agents: starter kit, template, demo end-to-end e best practice.`
  → `Laboratorio aperto di sperimentazione, formazione e divulgazione su agenti AI: proof-of-concept, progetti open-source e materiale didattico.`

### `src/components/Hero.astro`
- **tagline**:
  `Il laboratorio dove le idee diventano AI agents.`
  → `Un laboratorio aperto per sperimentare con gli agenti AI.`
- **subtitle**:
  `Starter kit, template, demo end-to-end e best practice — dal concept alla prima release.`
  → `Proof-of-concept, progetti open-source, appunti e materiale formativo — costruiti per imparare e condividere.`

### `src/components/Pillars.astro`
Array `pillars` riscritto:

| Icona | Title | Description |
|---|---|---|
| 🧪 | Proof-of-Concept | Idee trasformate in prototipi funzionanti. Codice aperto, esperimenti riproducibili. |
| 🔬 | Sperimentazione | Architetture, pattern e framework messi alla prova. Si pubblica quello che funziona — e anche quello che non funziona. |
| 🎓 | Formazione & Divulgazione | Libri, articoli e appunti tecnici. Per chi vuole capire cosa c'è sotto il cofano degli agenti AI. |
| 🤝 | Community | Discussioni aperte, contributi benvenuti. Ogni progetto è pubblico e documentato. |

(Codepoints emoji: 🧪 U+1F9EA, 🔬 U+1F52C, 🎓 U+1F393, 🤝 U+1F91D — stessa convenzione `\u{...}` già usata nel file.)

### `src/components/BookSection.astro`
- **subtitle catalogo**:
  `Libri tecnici per sviluppatori, architect e decision maker`
  → `Libri tecnici per chi vuole imparare facendo`
- Titolo "Pubblicazioni": invariato.

### `src/components/SupportSection.astro`
- **titolo**:
  `Supporta il Progetto`
  → `Supporta il laboratorio`
- **descrizione**:
  `Se questo progetto open-source ti è utile, considera di offrire un caffè per aiutare a mantenerlo attivo e in crescita.`
  → `Se gli esperimenti e il materiale del laboratorio ti sono utili, considera di offrire un caffè per tenere viva la community.`

### `src/components/ProjectsSection.astro`
- **subtitle**:
  `Progetti open-source per sistemi multi-agente e AI engineering`
  → `Proof-of-concept aperti su agenti AI, sistemi multi-agente e Graph-RAG`

(Architettura, moduli, agenti, pipeline, stack, services: invariati.)

### `src/pages/books/knowledge-graph.astro`
Solo i passaggi più "vendita enterprise" della descrizione + un highlight.

- **descrizione, ¶2 finale**:
  `…calcoli di ROI difendibili davanti a un CFO e uno studio di caso end-to-end da 18 mesi.`
  → `…architetture di produzione e uno studio di caso end-to-end da 18 mesi.`
- **descrizione, ¶4**:
  `Pensato per developer Python, AI/ML engineer e architect che cercano codice completo e pattern di produzione, ma anche per CTO, PM, consulenti AI e founder che vogliono casi d'uso per settore, ROI difendibili, modello di pricing e go-to-market.`
  → `Pensato per developer Python, AI/ML engineer e architect che cercano codice completo e pattern di produzione, ma anche per chi affianca team e progetti AI e cerca casi d'uso concreti per settore.`
- **highlight #6**:
  `📊 Caso enterprise 18 mesi, ROI reale`
  → `📊 Caso reale end-to-end di 18 mesi`
- **Bio autore**: invariata (richiesta esplicita).

## Non-obiettivi

- Niente modifiche a `Footer.astro`, `SocialLinks.astro`, `MultiAgentSection.astro`, `Countdown.astro`, `NewsletterForm.astro`: già coerenti.
- Niente modifiche a CSS, struttura, asset (immagini, badge, cover).
- Niente nuove sezioni, niente disclaimer aggiuntivi.

## Verifica

- `npm run build` deve passare senza nuovi warning.
- Ispezione visiva dev server: testi sostituiti, layout invariato.
- `grep` di sicurezza: nessuna occorrenza residua di `decision maker`, `dal concept alla release`, `ROI difendibili`, `go-to-market`, `CFO`, `starter kit` (a parte forse il file spec stesso).
