---
title: "Cantiere Neemia: uno strumento operativo di discernimento etico per progetti di IA"
description: "Lab notes su una skill costruita per affiancare l'analisi tecnica dei progetti di intelligenza artificiale con una verifica etica strutturata, ispirata all'enciclica Magnifica Humanitas. Tre casi applicati: dove la skill conferma, corregge, e quando consiglia di ridisegnare."
pubDate: 2026-05-25
author: "Giuseppe Zileni"
tags: ["lab-notes", "ai-ethics", "magnifica-humanitas", "cantiere-neemia", "claude-skills"]
draft: false
lang: "it"
---

Il 15 maggio scorso il Vaticano ha pubblicato la prima enciclica nella storia interamente dedicata all'intelligenza artificiale: **[*Magnifica Humanitas*](https://www.vatican.va/content/leo-xiv/it/encyclicals/documents/20260515-magnifica-humanitas.html)** di Papa Leone XIV. Quaranta paragrafi del terzo capitolo — dal §90 al §130 — parlano direttamente a chi costruisce sistemi di IA: di accountability, di concentrazione del potere computazionale, di trasparenza degli algoritmi, di residenza dei dati, di responsabilità di chi progetta (§111: «ogni scelta progettuale esprime una visione dell'umanità»).

Letto con gli occhi di un ingegnere, è un testo che fa qualcosa di raro nella letteratura di AI ethics: distilla 135 anni di pensiero sociale strutturato in **sei principi compatti**, li applica a casi concreti dell'IA contemporanea, e si rivolge esplicitamente *anche* «agli uomini e alle donne di buona volontà» (§§16, 47, 91) — credenti o no. Ho voluto verificare se quel materiale potesse essere tradotto in **uno strumento di lavoro operativo** per le revisioni di progetti di IA. Il risultato si chiama **Cantiere Neemia**.

## Due icone architettoniche

L'enciclica propone due metafore di costruzione che danno forma a tutto il discernimento (§§7-10):

- **Babele** — costruire per dominare, "farsi un nome", imporre uniformità, sacrificare la dignità all'efficienza, decidere dall'alto senza ascolto.
- **Neemia** — ricostruire le mura di Gerusalemme osservando in silenzio le rovine, convocando le famiglie, distribuendo il lavoro («a ciascuno il suo tratto di muro»), ricostruendo i legami prima delle pietre.

Sono due pattern di qualunque progetto tecnologico. Ciò che li distingue non è la tecnologia usata, ma l'intenzione, lo stile di lavoro e i valori inscritti nel design. Cantiere Neemia colloca ogni progetto di IA lungo questo asse e propone mosse concrete per spostarlo dove deve stare.

## Struttura della skill

Sei fasi del workflow, prese dal metodo di Neemia (Neemia 1-6); sette voci in un team virtuale che firma esplicitamente i propri contributi (Mastro Costruttore, Custode della Dignità, Operaio del Bene Comune, Guardiano delle Mura, Profeta della Casa Comune, Ascoltatore degli Ultimi, Avvertitore di Babele); al termine, sette test finali con esiti `PASS / WARN / FAIL`.

Il test più impegnativo è il **Test di Giovanni Paolo II** (§129, in continuità con *Redemptor hominis*, 1979): *«il sistema rende la vita umana, in ogni suo aspetto, più umana e più degna dell'uomo?»* È una domanda che ribalta il framing tipico: non chiede se il sistema è "etico" o "compliant", chiede se rende la vita più umana.

## Tre casi applicati

La skill è stata validata su quattro scenari realistici. Ne riporto qui tre, perché coprono insieme lo spettro dei pattern che la skill è progettata per identificare. Gli scenari sono fittizi ma plausibili; gli esiti dei sette test sono quelli effettivamente prodotti dal workflow.

### Caso 1 — CV pre-screening per HR

*Una società italiana progetta un sistema che legge i CV in arrivo, li confronta con la job description, assegna uno score 0-100, e fa vedere alle HR solo il top 20%. Mission dichiarata: leader EU del pre-screening in 3 anni.*

**Tally: 0 PASS · 2 WARN · 5 FAIL → ridisegnare.**

I candidati (la categoria più impattata dall'output) non erano nemmeno parte del framing iniziale. Il dominio HR ha decenni di bias documentati e nessun fairness audit è in piano. L'aspirazione "leader of the market in 3 anni" è il pattern §7 di Babele. La skill propone un ridisegno in 8 punti, con il sistema riconvertito da filtro autonomo a decision-support per recruiter umani (compatibile con EU AI Act, Title III). Pattern dominante: **Babele strutturale**.

### Caso 2 — Revisione legale assistita per piccoli studi

*Sistema per studi legali di 2-15 avvocati che estrae clausole dai contratti, le confronta con una libreria di pattern di rischio, prepara un report. L'avvocato valida, firma, decide.*

**Tally: 3 PASS · 3 WARN · 1 WARN forte → procedere con correzioni hard pre go-live.**

L'architettura di principio è corretta: avvocato centrale, accountability chiara, chain del giudizio professionale rispettata. Ma tre debiti strutturali emergono: il Cerchio 3 (clienti finali, Ordini forensi, praticanti) non ha avuto voce; i contratti dei clienti — coperti dal segreto professionale — transitano via API a provider extra-UE; il frontier LLM è sovradimensionato rispetto al task. La skill traduce questi punti in **prerequisiti hard del go-live**, non in backlog post-launch. Pattern: **cantiere onesto a metà strada**.

### Caso 3 — Assistente fiscale per microimprese

*Startup che sviluppa un assistente per commercialisti e consulenti del lavoro che servono microimprese italiane. Purpose dichiarato: servire le microimprese rurali e meridionali penalizzate da consulenza meno aggiornata.*

**Tally: 3 PASS · 2 WARN · 2 WARN forte → purpose corretto, esecuzione incoerente.**

È il caso più sottile e formativo. Il purpose statement è eticamente orientato fin dall'origine — servire il "più fragile" del §78. Ma l'esecuzione tecnica trascura proprio i fragili dichiarati: nessun test sui clienti con bassa alfabetizzazione digitale, nessuna versione in lingua semplificata, pricing nominalmente accessibile non verificato sul campo. In più, dati fiscali italiani coperti da segreto professionale routati via API a provider extra-UE: la sussidiarietà digitale del §71 è violata strutturalmente. Pattern: **purpose etico vs esecuzione incoerente**.

## I vantaggi nell'uso quotidiano

L'utilità della skill emerge in tre momenti del ciclo di vita di un progetto.

**Pre-design.** Le quattro domande di Fase 1 — *dove stiamo andando, verso quale meta, quale comunità, chi non possiamo perdere* — si rispondono in 30 minuti e prevengono settimane di lavoro su un progetto strutturalmente sbilanciato. Nel Caso 1, se i candidati non sono nemmeno menzionati nella prima conversazione di scoping, il sistema sta già nascendo su una traiettoria di Babele.

**Pre go-live.** I sette test funzionano come checklist sostantiva, non formalistica. A differenza delle compliance checklist standard, ciascun test ha tre criteri operativi specifici e propone un'azione correttiva concreta in caso di esito non PASS. Per un team che si avvicina al rilascio, sapere che esistono due debiti strutturali da pagare prima della produzione è molto diverso dal ricevere raccomandazioni generiche.

**Per decisioni di product strategy.** Il framework Babele/Gerusalemme — con i nove anti-pattern e nove pattern virtuosi documentati — fornisce un vocabolario condiviso che funziona bene anche nei meeting di prodotto. Dire «questo è un anti-pattern B7, tecnocrazia normalizzata» è più produttivo che dire «il sistema dovrebbe essere più trasparente».

**Non è una macchina di benedizione.** Il Caso 1 lo dimostra esplicitamente. Il Caso 3 lo dimostra in modo più sottile: un purpose eticamente corretto non è sufficiente a passare i test se l'implementazione non è coerente. È una soglia onesta, in linea con l'invito dell'enciclica al §14: *«non benediciamo entusiasmi ingenui, non alimentiamo paure sterili»*.

## Riferimenti

Repository: [github.com/agent-engineering-studio/cantiere-neemia](https://github.com/agent-engineering-studio/cantiere-neemia). Licenza CC BY-SA 4.0 — si può adattare e utilizzare anche commercialmente. La repository contiene la skill completa, i quattro worked examples in forma sintetica, e il template del Charter di Discernimento, il documento finale firmabile pronto per essere portato in revisioni etiche o board di governance.

Pull request benvenute, in particolare per correzioni alla versione latina del README, traduzioni in altre lingue, e nuovi worked examples di campo.

---

*«Essere costruttori di comunione, non architetti di Babele.»* — *Magnifica Humanitas* §16
