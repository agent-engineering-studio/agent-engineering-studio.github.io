# Organizzazione Editoriale — Agent Engineering Studio

Questo documento definisce la strategia editoriale del blog di Agent Engineering Studio.  
Il backlog operativo vive su GitHub Issues con le label `tipo:` e `stato:`.

👉 **[Backlog su GitHub Issues](https://github.com/agent-engineering-studio/agent-engineering-studio.github.io/issues)**

---

## I quattro pilastri

### 1. Tutorial tecnici
Guide pratiche e passo-passo su strumenti, protocolli e stack che usiamo.  
Pubblico: developer Python, data engineer, appassionati di AI.  
Formato: ~1200–1500 parole, snippet copia-incolla, output reali.

**Label:** `tipo: tutorial`

### 2. Lab Notes
Diari tecnici su esperimenti in corso. Stile onesto: cosa funziona, cosa no.  
Pubblico: developer AI, ricercatori, chi vuole guardare dietro le quinte.  
Formato: ~800–1200 parole, tono diaristico, può essere incompleto e dirlo.

**Label:** `tipo: lab-notes`

### 3. Open Data & Civic Tech
Analisi e strumenti applicati a dati pubblici italiani. Focus su impatto civico.  
Pubblico: giornalisti, funzionari PA, ricercatori sociali, attivisti.  
Formato: ~1200–1500 parole, dati reali, metodologia riproducibile.

**Label:** `tipo: open-data`

### 4. Costruire l'associazione
Trasparenza su governance, decisioni, finanze e vita interna dell'APS.  
Pubblico: potenziali soci, contributori open source, chiunque voglia capire.  
Formato: ~800–1000 parole, tono diretto e personale.

**Label:** `tipo: aps`

---

## Flusso di lavoro editoriale

```
idea -> bozza -> pronto -> pubblicato
```

Ogni post e` un issue GitHub con:
- **Titolo:** emoji + [Pilastro] + titolo provvisorio
- **Body:** brief editoriale (pubblico, angolazione, punti chiave, output atteso)
- **Label tipo:** `tipo: tutorial` / `tipo: lab-notes` / `tipo: open-data` / `tipo: aps`
- **Label stato:** `stato: idea` -> `stato: bozza` -> `stato: pronto` -> `stato: pubblicato`

Quando inizi a scrivere un post: sposta l'issue a `stato: bozza`.  
Quando il draft e` pronto per revisione: sposta a `stato: pronto`.  
Quando il post e` live: sposta a `stato: pubblicato` e chiudi l'issue.

---

## Cadenza

Pubblicazione **irregolare** - quando c e` qualcosa di concreto da dire.  
Qualita` > frequenza. Non forzare contenuti vuoti per "mantenere la cadenza".

---

## Distribuzione

- **Blog** - canale primario: agentengineering.it/blog
- **LinkedIn** - adattamento breve con link al post completo
- **Newsletter LinkedIn** - per i post piu` significativi (tutorial profondi, annunci APS)

---

## Backlog attuale

| # | Titolo | Pilastro | Stato |
|---|--------|----------|-------|
| #1 | MCP server per open data CKAN | Tutorial | idea |
| #2 | Interrogare l ISTAT con linguaggio naturale | Tutorial | idea |
| #3 | Mappe e dati geografici con mcp-osm | Tutorial | idea |
| #4 | Knowledge graph come memoria persistente | Lab Notes | idea |
| #5 | Analisi civic tech: CKAN + ISTAT + OSM | Open Data | idea |
| #6 | LLM locali con Ollama: 6 mesi di esperienza | Lab Notes | idea |
| #7 | Perche abbiamo fondato AES come associazione | APS | idea |
| #8 | Guida completa al protocollo MCP | Tutorial | idea |
| #9 | Appalti pubblici: analisi spesa locale con AI | Open Data | idea |
| #10 | Governance e vita interna di AES | APS | idea |

> La tabella qui e` indicativa. La fonte di verita` e` GitHub Issues.

---

## Post gia` pubblicati

| Data | Titolo | Pilastro |
|------|--------|----------|
| 2026-05-16 | Agenti AI e Open Data: come costruire il primo prototipo | Tutorial |
