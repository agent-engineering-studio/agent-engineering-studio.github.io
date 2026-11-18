---
title: "La pioggia d'Italia, ogni cinque minuti: i dati radar della Protezione Civile"
description: "Prima puntata della rubrica Open Data. Che cosa misurano i radar della Protezione Civile, dove possono ingannare e che cosa ci si costruisce con poche righe di Python, grazie alla libreria aperta dpc-radar."
pubDate: 2026-11-18
author: "Giuseppe Zileni"
tags: ["open-data", "dpc-radar", "protezione-civile", "meteo", "python"]
series: "opendata"
project:
  name: "dpc-radar"
  repo: "https://github.com/agent-engineering-studio/dpc-radar"
  docs: "https://agentengineering.it/dpc-radar/"
draft: false
---

Il 10 ottobre 2026, per Melito di Porto Salvo, in Calabria, la previsione diceva 20 millimetri di pioggia. Ne sono caduti 192.

Una previsione dice che cosa succederà, probabilmente, su un'area grande. Una misura dice che cosa sta succedendo, qui, adesso. In un Paese di valli corte e ripide come l'Italia, la differenza conta: un temporale può scaricare in poche ore la pioggia di un mese su una valle e lasciare asciutta quella accanto.

La misura esiste, è pubblica ed è gratis. La pubblica il Dipartimento della Protezione Civile, ogni cinque minuti, per tutta l'Italia. È il dato di questa prima puntata.

## Il dato in breve

Il Dipartimento della Protezione Civile gestisce una rete di radar meteorologici, 24 nel mosaico nazionale, e raccoglie i dati di migliaia di pluviometri a terra. Con questi strumenti pubblica mappe della pioggia su tutta l'Italia:

- **ogni 5 minuti**, la pioggia vista dal solo radar: quanto piove adesso e quanto è piovuto nell'ultima ora, a quadretti di un chilometro;
- **ogni 30 minuti**, la pioggia delle ultime 3, 6, 12 e 24 ore, corretta con i pluviometri. Questa correzione si chiama **«Merging»**.

Non serve un account né una chiave. La licenza è CC BY-SA 4.0: chi usa i dati deve citare la fonte, «Dipartimento della Protezione Civile», e se pubblica qualcosa costruito su questi dati deve condividerlo con la stessa licenza.

C'è un limite da conoscere subito: il Dipartimento conserva le mappe per **circa cinque mesi**. Quello che non salvi in tempo, sparisce.

![La pioggia delle 24 ore del 10 ottobre 2026 su tutta l'Italia, con lo zoom sull'area di Reggio Calabria](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/rain-24h.png)

*La pioggia del 10 ottobre 2026, dal prodotto «Merging» CUM24. Dati: Dipartimento della Protezione Civile, CC BY-SA 4.0.*

## Che cosa misura davvero

Un radar meteorologico è un'antenna che gira. Manda un impulso di microonde e ascolta l'eco. Se l'impulso incontra gocce di pioggia, una piccola parte torna indietro. Il tempo che l'eco impiega a tornare dice quanto è lontana la pioggia; la forza dell'eco dice quanta acqua c'è lassù.

Qui c'è il primo punto debole. L'eco dipende moltissimo dalla grandezza delle gocce: una goccia di 4 millimetri rimanda la stessa eco di circa quattromila gocce da un millimetro. Il radar non può contare le gocce, quindi usa una formula basata sulla pioggia media. Il risultato è una **stima**, non una misura.

C'è un secondo punto debole. Il fascio del radar parte quasi orizzontale, ma la Terra è curva e gli scappa sotto. A 100 chilometri dal radar il fascio è già a un chilometro e mezzo di altezza; a 200 chilometri è a quattro. Il radar guarda in alto, e quello che vede lassù non è sempre quello che arriva a terra. Le montagne gli fanno ombra, la neve che si scioglie sembra un acquazzone, e a volte la pioggia si forma proprio nell'ultimo chilometro, sotto il fascio.

![Il fascio del radar sale con la distanza: una montagna ne nasconde metà e la pioggia bassa cade sotto il fascio, dove solo il pluviometro la raccoglie](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/how-radar-sees.png)

*Perché il radar non vede sempre quello che cade. Immagine dal repository dpc-radar.*

Il pluviometro fa l'opposto. È un imbuto su un palo che raccoglie l'acqua vera, quella arrivata a terra. Ma misura solo il pezzetto di cielo sopra di sé, grande come un piatto, e il pluviometro successivo può essere a dieci chilometri.

Il «Merging» unisce i due: il radar dice **dove** è piovuto, i pluviometri dicono **quanto**. È la cosa più vicina che l'Italia abbia a «quanto è piovuto davvero, dappertutto».

A Melito si vede bene. I pluviometri hanno misurato 192 millimetri, il radar da solo ne aveva visti 115, cioè il 60%.

![Due mappe dell'area di Reggio Calabria il 10 ottobre 2026: la pioggia vista dal solo radar e quella del Merging](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/radar-vs-merging.png)

*A sinistra il solo radar, a destra il «Merging». Dati: Dipartimento della Protezione Civile, CC BY-SA 4.0.*

## Dove può ingannare

Usare questi dati in un programma ha insegnato qualche lezione. Le più importanti sono quattro.

**«Nessun dato» non vuol dire «zero».** Dove il radar non guarda, la mappa è vuota. Un programma distratto legge quel vuoto come zero, cioè come «asciutto». Il 10 ottobre un nubifragio ha colpito Lipari, e il radar non lo ha visto: i fasci più vicini passano a circa 3.500 metri sopra l'isola. Un dato mancante è un'informazione, e va trattato come tale.

**Un singolo frame può essere sbagliato.** In uno dei casi studiati, una mappa conteneva 7.348 millimetri di pioggia falsa: un allarme assurdo, prodotto da un errore. Prima di fidarsi di una mappa conviene confrontarla con quella precedente. La pioggia si muove; un difetto, spesso, no.

**Anche lo strumento «vero» può sbagliare.** Tra il 6 e l'8 ottobre 2026 un pluviometro bloccato ha segnato 126 millimetri ogni tre ore, per 33 ore, in una notte asciutta. Il radar, lì, leggeva zero. Il dato migliore nasce dal confronto tra fonti diverse, non dalla fiducia cieca in una sola.

**Il radar da solo non è la verità.** Tra giugno e novembre 2026 il solo radar ha letto in media il 20% di pioggia in più del «Merging». Non dappertutto nello stesso verso: in alcune zone legge troppo, in altre troppo poco. Per i totali, meglio il «Merging»; per sapere se piove adesso e dove va il temporale, il radar.

## Che cosa ci costruisci

Per usare questi dati bastava, finora, una settimana di lavoro: capire le chiamate non documentate del visualizzatore web, gestire due sistemi di coordinate diversi, interpretare i valori «nessun dato». **[dpc-radar](https://agentengineering.it/dpc-radar/)** è una libreria Python aperta, con licenza Apache-2.0, che fa questo lavoro per te. Il suo sito raccoglie la guida, i notebook e il riferimento completo.

```bash
pip install dpc-radar
```

Ecco la pioggia delle ultime 24 ore su Gioia del Colle:

```python
import asyncio
from dpc_radar import RadarClient

async def main() -> None:
    async with RadarClient() as radar:
        pioggia = await radar.latest("CUM24")    # le ultime 24 ore, tutta l'Italia
    print(pioggia.sample([(16.92, 40.80)]))      # millimetri, oppure None se nessuno ha misurato

asyncio.run(main())
```

Se non vuoi installare nulla, il [primo notebook](https://colab.research.google.com/github/agent-engineering-studio/dpc-radar/blob/main/notebooks/01_first_rain_map.ipynb) si apre nel browser e disegna la mappa della pioggia di oggi in cinque minuti.

Sopra i dati di base, la libreria risponde alle domande che vengono subito dopo:

- **si può fidare di questa mappa?** Controlla un frame contro il precedente e scarta i pixel sospetti, dicendo il perché;
- **il radar vede questo posto?** Dà un punteggio di affidabilità per ogni punto d'Italia;
- **quanto è rara questa pioggia, qui?** Cento millimetri in un giorno a Genova capitano quasi ogni anno; a Bari una volta in una generazione;
- **che cosa cadrà nelle prossime due ore?** Sposta la pioggia lungo il suo movimento e dà la probabilità che superi una soglia;
- **che cosa dice l'allerta ufficiale?** Legge il bollettino di criticità del Dipartimento, zona per zona.

E poi ci sono tre usi che vanno oltre lo script.

**Un archivio tuo.** Visto che il Dipartimento conserva le mappe per circa cinque mesi, la libreria può salvarle ogni notte, in automatico. Fra un anno avrai la pioggia di quest'inverno.

**Una mappa per il sito del Comune.** Il progetto include una pagina pronta, in italiano e in inglese, costruita con il kit grafico della Pubblica Amministrazione. Si apre sulle coordinate dell'ente e, punto per punto, mostra la pioggia, quanto è rara, l'allerta ufficiale e quanto ci si può fidare del radar.

![La pagina della pioggia aperta sul Comune di Gioia del Colle](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/demo-comune.png)

**Un assistente AI che non inventa i numeri.** dpc-radar include un server MCP: un modo standard per dare a un assistente come Claude degli strumenti per leggere i dati. Alla domanda «quanto ha piovuto a Messina nelle ultime tre ore?» l'assistente risponde con il numero calcolato sulla mappa di quel momento, e dice da quale mappa viene. E quando la libreria scrive il resoconto di un evento, ogni numero del testo viene confrontato con i dati prima di essere salvato: un numero che non c'è, viene rifiutato.

## I limiti, detti chiaramente

**Non è un sistema di allerta.** L'allerta ufficiale è il bollettino di criticità del Dipartimento e della protezione civile regionale. Quello che calcoli dal radar sta accanto all'allerta, mai al suo posto.

**Una mappa della pioggia misurata non è una previsione.** Dice che cosa è caduto, non che cosa cadrà. Anche la previsione a due ore della libreria sposta la pioggia che c'è, ma non vede i temporali che nascono dopo.

**Lontano dai radar e dietro le montagne, il dato è meno sicuro.** Il punteggio di affidabilità serve proprio a saperlo prima.

**Lo storico ha un buco.** Esiste un archivio di quindici anni di radar, dal 2010 al 2025, pubblicato dalla Fondazione Bruno Kessler. Ma è solo radar, senza la correzione dei pluviometri: utile per capire gli andamenti, non per citare i totali.

## Perché ne vale la pena

I radar li paghiamo tutti. Più persone sanno leggerne i dati, più quei soldi rendono: un agricoltore che sa quanto è piovuto sul suo campo e non alla stazione a venti chilometri, un tecnico comunale che controlla la pioggia sulle strade a rischio, un insegnante che trasforma il temporale del telegiornale in una lezione su misura ed errore, un giornalista che mostra che cosa è caduto accanto all'allerta che era stata data.

Il codice è aperto, i dati sono aperti, i limiti sono scritti. Il resto lo costruisce chi li usa.

---

**Per approfondire:** il [sito di dpc-radar](https://agentengineering.it/dpc-radar/), il [codice su GitHub](https://github.com/agent-engineering-studio/dpc-radar), i [cinque notebook](https://github.com/agent-engineering-studio/dpc-radar/tree/main/notebooks) e la pagina sul [riuso nella Pubblica Amministrazione](https://github.com/agent-engineering-studio/dpc-radar/blob/main/docs/riuso.md).

**Partecipa:** hai trovato una trappola nei dati, o hai costruito qualcosa con dpc-radar? Raccontalo nelle [discussioni su GitHub](https://github.com/orgs/agent-engineering-studio/discussions).

*Dati radar © Dipartimento della Protezione Civile, CC BY-SA 4.0. Questo articolo e la libreria non sono affiliati al Dipartimento.*
