---
title: "Basta questa pioggia per far franare? Le soglie di pioggia delle frane italiane"
description: "Terza puntata della rubrica Open Data. Che cosa dice una soglia di pioggia, come nasce dalle frane del catalogo e-ITALICA, dove può ingannare e che cosa ci si costruisce con la libreria aperta rainfall-thresholds, unita alla pioggia del radar e alle frane dell'ISPRA."
pubDate: 2026-11-24
author: "Giuseppe Zileni"
tags: ["open-data", "rainfall-thresholds", "frane", "pioggia", "e-italica", "python"]
series: "opendata"
project:
  name: "rainfall-thresholds"
  repo: "https://github.com/agent-engineering-studio/rainfall-thresholds"
  docs: "https://agentengineering.it/rainfall-thresholds/"
draft: false
---

Tra il pomeriggio del 9 e la notte del 10 ottobre 2026, a Melito di Porto Salvo, in Calabria, il radar della Protezione Civile ha misurato 166 millimetri di pioggia in 35 ore. Nella zona di Reggio sono scese frane.

Nella prima puntata di questa rubrica abbiamo visto come si misura quella pioggia. Nella seconda, dove sono le frane d'Italia. Resta la domanda che unisce le due: **quanta pioggia basta per far franare un versante?**

Non esiste una risposta esatta. Esiste però un modo, usato da più di quarant'anni, per dire se una pioggia somiglia a quelle che in passato hanno fatto franare. Si chiama **soglia di pioggia**, ed è il tema di quest'ultima puntata.

## Il dato in breve

Una soglia nasce da un catalogo: un elenco di frane, ognuna con la pioggia che l'ha innescata. Per l'Italia il catalogo è **e-ITALICA**, curato da ricercatori del CNR. Raccoglie 6.312 frane innescate dalla pioggia, tra il 1996 e il 2021. Per 5.974 di queste conosciamo due numeri misurati dal pluviometro più vicino: **quanto è durata la pioggia**, in ore, e **quanta ne è caduta**, in millimetri.

Il catalogo è pubblicato su Zenodo, un archivio aperto per i dati della ricerca, con licenza **CC BY 4.0**: si può usare liberamente, citando gli autori. Non serve un account né una chiave.

La libreria **rainfall-thresholds** porta quel catalogo dentro un programma Python, senza nessuna dipendenza: nemmeno NumPy. Ne ricava le soglie per l'Italia e le ricalcola da zero a ogni test, così nessun numero è copiato a mano.

## Che cosa misura davvero

Nel 1980 il geografo Nels Caine notò una cosa semplice. Se si mettono su un grafico la **durata** della pioggia e la sua **intensità media**, cioè i millimetri per ora, le piogge che hanno fatto franare stanno quasi tutte sopra una linea. Una pioggia breve deve essere violenta; una pioggia lunga può essere più debole. Quella linea è la soglia.

![Un grafico a doppia scala logaritmica: migliaia di punti grigi, ognuno una frana italiana, sopra una linea blu, la soglia T5](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/id-plane-light.png)

*Ogni punto grigio è una frana del catalogo e-ITALICA. La linea blu è la soglia: solo il 5% delle frane sta sotto. Dati: e-ITALICA v4, CC BY 4.0.*

La linea si sceglie in modo che solo il **5% delle frane** del passato stia sotto. Per questo si chiama **T5**. È una soglia bassa per scelta: preferisce cogliere una frana in più che una in meno.

In millimetri, per tutta l'Italia, la T5 chiede **28,3 millimetri in 24 ore** e 45,5 in 72. Al Nord ne chiede un po' di più, 30 in 24 ore; al Sud un po' meno, 27,1. Per le piogge brevi le regioni si somigliano; per quelle di più giorni, il Nord chiede più acqua prima che i versanti cedano.

Per dire quanto una pioggia sta sopra la linea, la libreria usa le **decadi**: +0,3 vuol dire il doppio dell'intensità della soglia, +1 dieci volte. A Melito la pioggia di quelle 35 ore stava a **+0,73**: più di cinque volte la soglia del Sud.

![La pioggia accumulata a Melito cresce fino a 166 millimetri in 35 ore, mentre la soglia del Sud ne chiede 31](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/melito-storm-it.png)

*Melito di Porto Salvo, 9-10 ottobre 2026: in rosso la pioggia accumulata, in blu quella che la soglia chiede man mano che la pioggia dura. Dati: radar del Dipartimento della Protezione Civile, CC BY-SA 4.0.*

## Dove può ingannare

Usare le soglie in un sistema vero, [Limen](https://github.com/agent-engineering-studio/limen), ha insegnato cinque lezioni.

**Una soglia vale per la pioggia su cui è tarata.** Le soglie di e-ITALICA nascono dai pluviometri. Messe su un'altra pioggia, cambiano significato. Sulla pioggia di un modello meteo, che lungo le frane del catalogo legge circa un terzo di quella del pluviometro, la soglia nazionale è stata superata solo nel 40,7% delle frane. E il motore di Limen, che la usa, nelle sei regioni tenute da parte per la verifica ha colto **zero frane su 286**. Anche il radar non è un pluviometro: nel 2026 ha letto in media il 20% in più del «Merging», la pioggia corretta con i pluviometri, e non dappertutto allo stesso modo.

**L'ultimo evento non è quello che conta.** Un programma taglia la pioggia in eventi: sei ore asciutte, e l'evento è finito. Se dopo un nubifragio arrivano sei ore asciutte e poi due millimetri e mezzo di pioggerella, l'ultimo evento è la pioggerella. Un programma che guarda solo quello dimentica il nubifragio. La prima versione della libreria faceva così, e Limen con lei. Ora c'è una funzione che prende l'evento più forte.

![Un nubifragio di 109 millimetri in 8 ore, sei ore asciutte, poi 2,5 millimetri di pioggerella: l'ultimo evento dice -0,65 decadi, il più forte +0,78](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/drizzle-trap-it.png)

*Un caso costruito con le ore vere del nubifragio di Melito. Dati: radar del Dipartimento della Protezione Civile, CC BY-SA 4.0.*

**Un'ora mancante non è un'ora asciutta.** Se il radar non vede, o un'ora di dati si perde, un programma distratto scrive zero. Quello zero può spezzare un evento in due e nascondere una pioggia forte. Con tre ore mancanti nel cuore del nubifragio di Melito, quello che resta misurato sono 59,6 millimetri in 8 ore: già sopra la soglia. La libreria lo dice, e aggiunge che quel totale è un minimo.

**Una soglia dice quante frane coglie, non quanti falsi allarmi costa.** Per costruzione la T5 lascia sotto il 5% delle frane del passato. Ma quante volte viene superata quando non succede niente? Il catalogo non lo sa: contiene solo la pioggia delle frane. Per saperlo serve la pioggia dei giorni tranquilli, e una misura fatta su quella.

**Le frane datate sono poche, e non dappertutto.** Per verificare una soglia servono frane con il giorno. e-ITALICA ne ha 1.603 in Liguria e 1.131 nelle Marche, ma 17 in Molise e 55 in Basilicata. L'archivio degli eventi dell'ISPRA, dal 2018, ne ha 1.608 con il punto noto entro un chilometro, e in testa c'è l'Emilia-Romagna, dove pesano le alluvioni del 2023. In Puglia, due.

![Due mappe a caselle delle regioni italiane: le frane di e-ITALICA con la loro pioggia, e quelle dell'ISPRA datate al giorno dal 2018](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/regions-map-it.png)

*Una casella per Regione. A sinistra le frane di e-ITALICA, a destra gli eventi dell'ISPRA datati al giorno con il punto entro 1 km. Dati: e-ITALICA v4, CC BY 4.0; ISPRA IdroGEO, CC BY-SA 4.0.*

## Che cosa ci costruisci

La libreria si installa con una riga, e non porta con sé nient'altro.

```bash
pip install rainfall-thresholds
```

Con una serie oraria di pioggia, da un pluviometro, da un radar o da un modello, servono quattro righe:

```python
from rainfall_thresholds import ITALICA_T5, macroregion_of, reconstruct_events, strongest_event

soglia = ITALICA_T5[macroregion_of("Calabria") or "italy"]  # la soglia del Sud
eventi = reconstruct_events(serie, no_rain_break_hours=6, min_event_mm=2.0)  # None = non misurato
evento = strongest_event(eventi, soglia)                   # l'evento più forte, non l'ultimo
print(soglia.exceedance(evento.intensity_mm_h, evento.duration_hours))  # decadi sopra o sotto
```

Sopra questo ci sono quattro usi.

**Unire le tre librerie.** rainfall-thresholds non scarica la pioggia e non cerca le frane: lo fanno le sue due sorelle, [dpc-radar](https://agentengineering.it/dpc-radar/) e [ispra-idrogeo](https://agentengineering.it/ispra-idrogeo/). Nessuna delle tre dipende dalle altre. Le unisce chi le usa: Limen, un notebook, una pagina. Così ognuna può crescere per conto suo senza fermare le altre.

![Schema: dpc-radar dà la serie oraria, ispra-idrogeo le frane datate, rainfall-thresholds risponde con un numero che non è un'allerta](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/three-libraries-it.png)

*Come si incontrano le tre librerie della rubrica.*

Un notebook del progetto le mette insieme: prende le frane datate dall'ISPRA da giugno 2026, legge 48 ore di radar sul punto di ognuna e le confronta con la soglia. Delle 9 frane per scivolamento o colata, 8 hanno un evento di pioggia, e **7 su 8** stanno sopra la soglia. È un esempio, non una prova: nove frane, quasi tutte al Nord.

**Una pagina per l'ente.** Il progetto include un **banco di taratura**, in italiano, con il kit grafico della Pubblica Amministrazione. Si apre sulle frane della regione dell'ente, tara una soglia su quelle che contano, la confronta con quella nazionale e la esporta. Per la Puglia, su 140 frane, la soglia locale chiede 26,4 millimetri in 24 ore, quella nazionale del Sud 27,1. Il costo in falsi allarmi resta scritto **«non misurato»** finché l'ente non carica la pioggia di un suo pluviometro: mai zero.

![Il banco di taratura aperto sulla Puglia: il grafico della soglia tarata su 140 frane e la tabella della pioggia che chiede da 1 a 72 ore](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/banco-di-taratura-puglia.jpg)

*Il banco di taratura, aperto sul Comune di Gioia del Colle. Dati: e-ITALICA v4, CC BY 4.0.*

**Una pagina per capire.** Sul sito della libreria c'è [una pagina da provare](https://agentengineering.it/rainfall-thresholds/explainer/): si sceglie una regione, una durata e la pioggia caduta, e si vede dove cade rispetto alla soglia e alle frane del passato. Gira nel browser, senza server. Va bene per una scuola o un incontro pubblico.

**Un assistente AI che non scambia le unità.** La libreria include un server MCP, un modo standard per dare strumenti a un assistente come Claude. L'errore più facile, con le soglie, è scambiare il totale con l'intensità: scrivere «30,9 millimetri all'ora» dove la soglia chiede 30,9 millimetri in tutto. Un controllo del testo trova i numeri inventati, arrotondati male o con l'unità sbagliata. È provato su otto risposte scritte apposta: le quattro corrette passano, nelle quattro sbagliate trova esattamente gli errori messi.

## I limiti, detti chiaramente

**Una soglia superata non è un'allerta.** Dice che la pioggia somiglia a quella che in passato ha fatto franare. L'allerta ufficiale è il bollettino di criticità del Dipartimento della Protezione Civile e della protezione civile regionale.

**Non dice dove cadrà una frana.** Pendenza, suolo, vegetazione, la pioggia delle settimane prima: contano quanto il temporale di oggi.

**Le soglie italiane sono tarate sui pluviometri.** Sul radar e sui modelli non sono validate. Misurarlo è il lavoro che resta, e si fa in Limen, sulle frane dell'ISPRA e sullo storico del radar, regione per regione.

**Il costo in falsi allarmi non è ancora misurato** sui dati veri. Gli strumenti per misurarlo ci sono e danno gli stessi numeri di quelli di Limen, provati su 2.000 casi. Il numero, ancora no.

## Perché ne vale la pena

Questa rubrica è partita da una domanda semplice: che cosa si può fare con i dati pubblici sul dissesto idrogeologico? Il radar della Protezione Civile dice quanto è piovuto. L'inventario dell'ISPRA dice dove la montagna si è già mossa. Il catalogo e-ITALICA dice quanta pioggia, in passato, è bastata.

Sono tre lavori pubblici, fatti da persone diverse in decenni. Messi insieme, con i loro limiti scritti accanto, permettono a un Comune, a un ricercatore o a un giornalista di fare una domanda precisa e di ricevere un numero onesto. Non una previsione, non un'allerta: un numero, con la sua unità e la sua fonte.

---

**Per approfondire:** il [sito di rainfall-thresholds](https://agentengineering.it/rainfall-thresholds/), il [codice su GitHub](https://github.com/agent-engineering-studio/rainfall-thresholds), i [quattro notebook](https://github.com/agent-engineering-studio/rainfall-thresholds/tree/main/notebooks), il [banco di taratura](https://github.com/agent-engineering-studio/rainfall-thresholds/tree/main/app) e la pagina sul [riuso nella Pubblica Amministrazione](https://agentengineering.it/rainfall-thresholds/riuso/).

**Partecipa:** hai una soglia locale, frane datate della tua zona, o hai trovato una trappola nei dati? Raccontalo nelle [discussioni su GitHub](https://github.com/orgs/agent-engineering-studio/discussions).

*Dati: e-ITALICA v4 (Brunetti M.T. et al. 2024, doi:10.5281/zenodo.14204473), CC BY 4.0. Pioggia radar © Dipartimento della Protezione Civile, CC BY-SA 4.0. Eventi di frana © ISPRA — IdroGEO, CC BY-SA 4.0. Questo articolo e la libreria non sono affiliati al CNR, all'ISPRA o al Dipartimento.*
