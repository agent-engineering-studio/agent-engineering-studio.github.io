---
title: "Dove sono le frane d'Italia, e quanto fidarsi della mappa: i dati ISPRA IdroGEO"
description: "Seconda puntata della rubrica Open Data. Che cosa dicono l'inventario delle frane e le mappe di pericolo dell'ISPRA, dove possono ingannare e che cosa ci si costruisce con la libreria aperta ispra-idrogeo, compresa una mappa per il sito del Comune."
pubDate: 2026-11-23
author: "Giuseppe Zileni"
tags: ["open-data", "ispra-idrogeo", "ispra", "frane", "dissesto-idrogeologico", "python"]
series: "opendata"
project:
  name: "ispra-idrogeo"
  repo: "https://github.com/agent-engineering-studio/ispra-idrogeo"
  docs: "https://agentengineering.it/ispra-idrogeo/"
draft: false
---

Il 26 novembre 2022, poco dopo le cinque del mattino, una colata di fango scese dal monte Epomeo su Casamicciola Terme, a Ischia. Morirono dodici persone.

Su quel Comune l'inventario nazionale delle frane ne aveva già censite 213. La mappa diceva da tempo **dove** la montagna era già scesa. Non poteva dire **quando** sarebbe successo di nuovo.

Questa differenza, tra dove e quando, è il filo di questa seconda puntata. Il dato è dell'ISPRA, è pubblico e gratuito, e racconta il dissesto idrogeologico italiano meglio di quasi ogni altra fonte. Bisogna solo sapere che cosa dice, e che cosa no.

È anche un modo diverso di guardare il territorio. La [prima puntata](/blog/pioggia-radar-protezione-civile-dpc-radar/), sui radar della Protezione Civile, raccontava un monitoraggio in tempo reale: la pioggia misurata ogni cinque minuti, mentre cade, che dice che cosa sta succedendo adesso. L'inventario delle frane e le mappe di pericolo sono l'opposto: cambiano in anni, non in minuti, e dicono dove il suolo è già fragile. Il radar risponde al quando, l'ISPRA al dove. Nessuno dei due, da solo, basta a prevedere una frana.

## Il dato in breve

L'ISPRA, l'istituto nazionale per l'ambiente, pubblica sulla piattaforma **IdroGEO** tre cose diverse.

La prima è l'**Inventario dei Fenomeni Franosi in Italia**, IFFI: tutte le frane che l'ISPRA e le Regioni hanno trovato e cartografato in decenni di rilievi. Oggi sono **721.457**. Ogni frana ha un punto, spesso un contorno, il tipo di movimento e il Comune.

La seconda sono le **mappe di pericolo**, cioè dove il terreno può franare o i fiumi possono esondare. Le disegnano le Autorità di bacino nei Piani di Assetto Idrogeologico, i PAI, in classi da P1 (moderato) a P4 (molto elevato). L'ISPRA le unisce in mappe nazionali chiamate mosaicature. Secondo l'ultima, del 2024, il **9,5% dell'Italia** è in pericolo frana elevato o molto elevato.

La terza sono gli **indicatori di rischio**: incrociando le mappe con il censimento, l'ISPRA conta le persone, gli edifici e i beni culturali in ogni classe di pericolo, Comune per Comune. In pericolo frana elevato o molto elevato vivono **1,28 milioni** di persone. In aree che possono allagarsi una volta ogni 100-200 anni, **6,8 milioni**.

Non serve un account né una chiave. Le licenze vanno lette bene, perché non sono tutte uguali: l'inventario delle frane è **CC BY-SA 4.0**, con una citazione diversa per ogni Regione, e chi pubblica dati derivati li deve condividere con la stessa licenza. La mappa di pericolo 2024 e gli indicatori sono **CC BY 4.0**, più liberi.

![L'inventario IFFI regione per regione: una casella per Regione, colorata per frane ogni 100 km²](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/map.svg)

*Le frane censite in ogni Regione. Dati: ISPRA IdroGEO, IFFI, CC BY-SA 4.0.*

## Che cosa misura davvero

L'inventario è una **memoria**: ogni punto è una frana che qualcuno ha visto e disegnato. Non è una previsione. Dove ci sono molti punti, la montagna si è già mossa molte volte.

Le mappe PAI sono una **valutazione**: un tecnico ha guardato pendenze, rocce, frane passate, e ha scritto «qui il pericolo è elevato». Sono il riferimento ufficiale per l'urbanistica, ma l'ISPRA stessa ricorda che le mosaicature nazionali sono un lavoro tecnico-scientifico: le mappe con valore legale sono quelle delle Autorità di bacino.

E poi c'è la cosa che a me interessava di più: **le date**. Per verificare se una certa pioggia fa franare un versante, servono frane di cui si sa il giorno. Qui il dato si fa sottile. Delle 721.457 frane dell'inventario, solo **28.076 hanno una data**, il 3,9%. Quelle datate al giorno sono **10.822**. Le altre hanno al massimo un intervallo: un mese, un anno, a volte solo «1979».

Accanto all'inventario c'è un archivio più piccolo di **eventi**, frane registrate con la data: dal 2018 sono 1.710. Ma 1.466 di queste date hanno solo il giorno, senza l'ora.

## Dove può ingannare

Usare questi dati in un programma ha insegnato quattro lezioni.

**Le date sono quasi tutte nel Nord-Est.** Trentino-Alto Adige, Friuli-Venezia Giulia e Veneto datano al giorno tra un quinto e un quarto delle loro frane. Sedici Regioni ne datano meno dell'1%, sette meno di una su mille. Chi verifica una soglia di pioggia sulle frane datate dell'inventario sta, senza saperlo, studiando soprattutto le Alpi orientali. E **6.814 Comuni su 7.899** non hanno nessuna frana datata al giorno dal 2018.

![Le frane IFFI datate al giorno, regione per regione: il Nord-Est intorno al 20%, sedici Regioni sotto l'1%](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/dates.svg)

*Quante frane hanno una data al giorno, per Regione. Dati: ISPRA IdroGEO, IFFI, CC BY-SA 4.0.*

**Poche frane non vuol dire poco pericolo.** La Lombardia censisce quasi sei frane per chilometro quadrato, la Puglia quattro ogni cento. Una parte è geologia. Un'altra parte è quanto si è cercato: un inventario conta le frane che qualcuno ha rilevato. Nessun dato pubblico permette di separare le due cose, e una mappa con pochi punti non è una prova di sicurezza.

**Un campo può dire «esatta» e non voler dire niente.** Ogni frana ha un campo sull'accuratezza della posizione. Vale «esatta» per tutte le 721.457. Un dato che non cambia mai non informa: la precisione reale dei punti, semplicemente, non è dichiarata. Gli eventi invece la dichiarano davvero, da «esatta» a 10 chilometri.

**Anche la fonte cambia sotto i piedi.** Il 9 novembre 2026 la ricerca delle frane di IdroGEO ha cominciato a rispondere con un errore a chi non indicava i campi da leggere: una tabella interna era stata tolta. Nessun avviso. Un programma che usa un servizio pubblico deve controllarlo ogni giorno, non fidarsi che resti uguale.

E un caso che fa capire i tempi: il 10 ottobre 2026 un nubifragio ha colpito Melito di Porto Salvo, in Calabria. Il 22 novembre IdroGEO non aveva ancora nessun evento franoso registrato per quella tempesta. I dati ufficiali arrivano, ma arrivano dopo.

## Che cosa ci costruisci

**[ispra-idrogeo](https://agentengineering.it/ispra-idrogeo/)** è una libreria Python aperta, con licenza Apache-2.0, che fa il lavoro noioso e tiene il conto delle trappole: scarica i file nazionali e li aggiorna solo quando l'ISPRA li cambia, legge gli indicatori di ogni Comune, interroga le mappe in un punto.

```bash
pip install ispra-idrogeo
```

C'è anche un comando, `idrogeo`. Per sapere il pericolo sulle colline sopra Sarno:

```bash
idrogeo hazard 40.829 14.617
# pericolo frana P4, Comune di Sarno, pendenza 12,3 gradi
```

Sopra i dati di base, la libreria risponde alle domande che vengono subito dopo:

- **quali frane hanno una data, e quanto è precisa?** Le raccoglie dall'inventario e dagli eventi, ciascuna con la precisione della data (ora, giorno o intervallo) e del punto, così uno studio può tenere solo quelle di cui si fida;
- **quanto posso fidarmi dell'inventario in questo Comune?** Per ognuno dei 7.899 Comuni dice quante frane sono datate, quanto è aggiornato l'archivio e che cosa nessuno ha misurato;
- **quando l'ISPRA ha cambiato questi file?** Lo chiede senza scaricarli: l'inventario si rigenera ogni giorno, le mappe di pericolo ogni qualche anno.

E poi ci sono due usi che vanno oltre lo script.

**Una mappa per il sito del Comune.** Il progetto include una pagina pronta, in italiano, costruita con il kit grafico della Pubblica Amministrazione. Si apre su un Comune e mostra le aree a pericolo frana della mappa 2024, il pericolo alluvione, le frane censite e quelle datate. Accanto, le persone e i beni esposti, e una **classe di predisposizione**: la quota del territorio che le mappe ufficiali mettono in pericolo, in cinque gradini fissi. Sarno, per esempio, ha il 43% del territorio in pericolo frana elevato o molto elevato: predisposizione «molto alta». E soprattutto la pagina dice **quanto fidarsi** di quei dati in quel Comune, e quali dati mancano.

![La Mappa dei dati aperta su Sarno: aree a pericolo frana, pericolo alluvione, frane censite e datate, con la scheda di una frana del 5 maggio 1998](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/mappa-sarno.jpg)

*La mappa aperta su Sarno, con la scheda di una frana del 5 maggio 1998, il giorno della colata. Dati: ISPRA IdroGEO.*

![I 7.899 Comuni per classe di predisposizione a frana e ad alluvione](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/classes.svg)

*Come si distribuiscono i Comuni italiani nelle cinque classi. Dati: ISPRA IdroGEO, indicatori di rischio, CC BY 4.0.*

**Un assistente AI che non inventa i numeri.** La libreria include un server MCP, un modo standard per dare a un assistente come Claude degli strumenti per leggere i dati: diciannove, dal pericolo in un punto alla classifica dei Comuni, fino a quanto fidarsi dei dati in un posto. La regola è una sola: i numeri vengono dai dati, le parole dal modello. Ogni risposta porta con sé la fonte, la licenza e l'ora in cui il dato è stato letto, e un controllo confronta ogni numero di un testo con i dati da cui è stato scritto: un numero che nessuno strumento ha restituito viene segnalato.

L'ho messo alla prova con domande vere, la cui risposta giusta si ricalcola dai dati a ogni giro: quante persone vivono in pericolo alluvione a Bari, quante frane ha Trivento, che cosa dice la mappa su Venezia. In un primo giro di cinque domande l'assistente ha risposto bene a tutte e cinque e ha citato l'ISPRA ogni volta, per una spesa di 23 centesimi di dollaro. Ma non ha mai usato il controllo dei numeri, anche se le istruzioni glielo chiedevano: con una risposta di un solo numero, va dritto alla risposta. È il prossimo punto da migliorare.

C'è anche un limite da dire: il controllo verifica che un numero esista nei dati, non che sia detto della cosa giusta. Il resto lo fa chi rilegge.

## I limiti, detti chiaramente

**Non è un sistema di allerta.** La libreria non legge la pioggia: quella la misura [dpc-radar](https://agentengineering.it/dpc-radar/), dalla prima puntata. L'allerta ufficiale è il bollettino di criticità del Dipartimento della Protezione Civile e della Regione. La classe di predisposizione dice quanta parte del territorio è in pericolo, non se una frana sta per arrivare.

**Una mappa di pericolo non è una perizia.** Non dice se una casa è sicura: per un edificio servono studi specifici e le carte ufficiali dell'Autorità di bacino.

**L'inventario è incompleto in modo diseguale.** Dove ci sono poche frane censite può esserci poco pericolo, o poco rilievo. Il dato non distingue.

**Le date sono poche.** Per questo, chi vuole unire le frane alla pioggia deve dichiarare quante ne ha usate e dove. In Agent Engineering Studio lo fa Limen, il progetto che mette insieme pioggia, soglie e pericolo: ispra-idrogeo gli dà le frane e la misura di quanto fidarsi, non prende decisioni al suo posto.

## Perché ne vale la pena

Le frane d'Italia le hanno cercate e disegnate per decenni geologi delle Regioni, dell'ISPRA, delle Università. Quel lavoro è pubblico. Più persone sanno leggerlo, e soprattutto leggerne i limiti, più vale: un tecnico comunale che prepara il piano di protezione civile, un ricercatore che sa su quali frane può contare, un giornalista che racconta una colata con i numeri giusti, un cittadino che guarda la mappa del suo paese e capisce che cosa dice e che cosa no.

Il codice è aperto, i dati sono aperti, i limiti sono scritti. Il resto lo costruisce chi li usa.

---

**Per approfondire:** il [sito di ispra-idrogeo](https://agentengineering.it/ispra-idrogeo/), il [codice su GitHub](https://github.com/agent-engineering-studio/ispra-idrogeo), la pagina sul [riuso nella Pubblica Amministrazione](https://agentengineering.it/ispra-idrogeo/riuso/) e il [notebook di prova](https://github.com/agent-engineering-studio/ispra-idrogeo/tree/main/examples).

**Partecipa:** hai trovato una trappola nei dati, o hai costruito qualcosa con ispra-idrogeo? Raccontalo nelle [discussioni su GitHub](https://github.com/orgs/agent-engineering-studio/discussions).

*Dati © ISPRA — IdroGEO: inventario IFFI ed eventi CC BY-SA 4.0, mappa di pericolo frana 2024 e indicatori di rischio CC BY 4.0. Questo articolo e la libreria non sono affiliati all'ISPRA.*
