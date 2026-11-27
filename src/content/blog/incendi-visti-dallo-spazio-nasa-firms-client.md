---
title: "Il fuoco visto dallo spazio: gli incendi d'Italia nei dati NASA FIRMS"
description: "Quinta puntata della rubrica Open Data. Che cosa misurano i fuochi attivi della NASA, dove possono ingannare e che cosa ci si costruisce con la libreria aperta firms-client, compresa una pagina per il sito del Comune."
pubDate: 2026-11-27
author: "Giuseppe Zileni"
tags: ["open-data", "firms-client", "nasa", "firms", "incendi", "viirs", "python"]
series: "opendata"
project:
  name: "firms-client"
  repo: "https://github.com/agent-engineering-studio/firms-client"
  docs: "https://agentengineering.it/firms-client/"
draft: true
---

Il chilometro quadrato d'Italia che ha «bruciato» più giorni negli ultimi quattordici anni non è un bosco. È l'acciaieria di Taranto: **3.308 giorni di fuoco** visti dai satelliti della NASA. Non c'è nessun incendio. C'è un altoforno, caldo tutti i giorni dell'anno, e un satellite vede il calore, non il fuoco.

Le prime quattro puntate di questa rubrica hanno raccontato le frane: **quanto piove**, **dove è già franato**, **quanta pioggia basta**, **dove il terreno si muove**. Con questa si apre il capitolo sugli incendi, e si parte dal dato più usato al mondo per vederli.

## Il dato in breve

Il dato è **FIRMS**, il Fire Information for Resource Management System della NASA. Raccoglie ogni fuoco attivo visto dai satelliti dal 2000 in poi, su tutta la Terra, poche ore dopo il passaggio.

Lo si legge in due modi. Gli **archivi annuali per Paese** sono file aperti: niente account, niente chiave. Per l'Italia ci sono quelli dello strumento MODIS dal 2000 e quelli di VIIRS S-NPP dal 2012. Un anno esce quando è finito. Per gli ultimi giorni c'è invece un servizio **quasi in tempo reale**, che chiede una chiave gratuita, la MAP_KEY: basta un indirizzo email.

I dati sono liberi. Chi li pubblica deve citare la NASA, con una frase che la libreria **firms-client** porta già con sé. La libreria scarica ogni archivio una volta sola, riconosce le pagine d'errore che il servizio manda con «tutto bene», e soprattutto separa un incendio da una fabbrica.

## Che cosa misura davvero

Alcuni satelliti guardano tutta la Terra qualche volta al giorno con sensori all'**infrarosso termico**, che vedono il calore. Quando un pixel è molto più caldo di quelli intorno, FIRMS lo segnala come **punto caldo**: una posizione, un'ora, una temperatura, la potenza del fuoco in megawatt e una confidenza. Il pixel di VIIRS è largo circa 375 metri, quello di MODIS un chilometro.

Un punto caldo, quindi, non è un incendio. Un incendio grande è fatto di decine di punti caldi, in giorni diversi. E un punto caldo può non essere un incendio affatto. Per questo FIRMS dà a ogni rilevazione un **tipo**: incendio di vegetazione, vulcano, fonte fissa sulla terra (industrie, torce delle raffinerie), piattaforma in mare.

![L'Italia nel 2025 vista da VIIRS: i fuochi di vegetazione al Sud e nelle isole, le fonti industriali nella pianura padana e a Taranto](https://raw.githubusercontent.com/agent-engineering-studio/firms-client/main/docs/images/map.png)

*Le rilevazioni VIIRS S-NPP sull'Italia nel 2025, colorate per tipo. Dati: NASA FIRMS.*

Nel 2025 VIIRS ha registrato sull'Italia **23.349 rilevazioni**. Tolti vulcani, industrie, mare e quelle a bassa confidenza, restano **14.880 incendi di vegetazione**. Circa una rilevazione su quattro non era un fuoco nei campi o nei boschi.

Per sapere se la libreria dice il vero l'abbiamo messa alla prova su casi dove la risposta si conosce da fonti diverse da FIRMS: due grandi incendi (Montiferru 2021, Palermo 2023), l'acciaieria di Taranto, una colata di lava dell'Etna, il mare aperto, le due stagioni peggiori, e dieci aree bruciate mappate da EFFIS, il servizio europeo sugli incendi, su terra quasi tutta agricola o quasi tutta naturale. **Su 41 controlli ne passano 34.** Quelli che falliscono restano nella tabella, e li raccontiamo qui sotto.

## Dove può ingannare

**Caldo non vuol dire fuoco.** L'acciaieria di Taranto passa ogni filtro di confidenza, perché è calda davvero. Solo il tipo di FIRMS la toglie: con il tipo, della zona dell'acciaieria resta il 3,4% delle rilevazioni. Il guaio è che il servizio quasi in tempo reale il tipo **non lo dà**. Lì un'acciaieria sembra un incendio. La libreria costruisce allora una maschera delle fonti fisse dagli archivi degli anni passati, e con quella le rilevazioni tenute a Taranto scendono a zero.

**Il tipo 0 non è sempre vegetazione.** Il più grande «incendio di vegetazione» d'Italia del 2025, dal 16 al 21 febbraio, è una colata di lava sul fianco dell'Etna. FIRMS dà il tipo vegetazione al 44% delle sue rilevazioni, e la maschera ne lascia passare ancora il 15%. Sono due dei sette controlli che falliscono.

**Nessun punto caldo non vuol dire nessun incendio.** FIRMS dice solo dove ha visto qualcosa. Nuvole, fumo e l'ora del passaggio nascondono i fuochi. Abbiamo contato quante delle 10.290 aree bruciate mappate da EFFIS in Italia hanno almeno una rilevazione VIIRS dentro: fra il 2022 e il 2025, **una su cinque** sotto i 30 ettari, **quasi nove su dieci** fra 300 e 1.000. A Polizzi Generosa, il 6 luglio 2022, sono bruciati 876 ettari e VIIRS non ha visto un solo punto caldo in tre giorni.

**Certi giorni il satellite tace.** Dal 27 luglio al 10 agosto 2022, in piena stagione degli incendi, VIIRS S-NPP non ha mandato dati. In quei giorni la risposta giusta non è «nessun fuoco», è **«non misurato»**. La libreria li elenca, e un'analisi che li tratta come zero sbaglia nel verso più pericoloso: fa sembrare calmo un periodo che nessuno ha guardato.

**Un fuoco nei campi è un fuoco vero.** Bruciare le stoppie dà punti caldi di tipo vegetazione, come un incendio boschivo. Per distinguerli la libreria guarda la terra intorno, con la carta ESA WorldCover. Funziona sui boschi: cinque incendi su cinque in terra naturale escono «incendio boschivo». Sui campi va peggio: su quattro incendi che EFFIS dice al 90% agricoli, la regola ne riconosce uno. WorldCover chiama «prateria» i pascoli e i campi a riposo, e la regola si confonde. Il numero continuo invece tiene: la quota di coltivo sotto i giorni di fuoco va da **0,58 a 0,86** sugli incendi agricoli e da **0 a 0,004** su quelli boschivi. Un modello può usare quel numero; un sì o no lo butta via.

## Che cosa ci costruisci

La libreria si installa con una riga:

```bash
pip install firms-client
```

Un anno d'Italia, senza chiave, in poche righe:

```python
import asyncio

import httpx

from firms_client import VIIRS_SNPP, cluster, fetch_archive, select


async def main() -> None:
    async with httpx.AsyncClient(timeout=120) as client:
        righe = await fetch_archive(client, VIIRS_SNPP, 2025, "Italy")  # 23.349 rilevazioni
        incendi = select(righe)  # 14.880: senza industrie, vulcani, mare
        eventi = cluster(incendi)  # i punti vicini nello spazio e nel tempo, il più grande prima
        print(len(righe), len(incendi), eventi[0])


asyncio.run(main())
```

Sopra questo ci sono quattro usi.

**Una pagina per il sito del Comune.**

Il progetto include una pagina pronta, in italiano e in inglese, con il kit grafico della Pubblica Amministrazione. Si installa con Docker e si imposta con il nome e le coordinate del Comune; si può incorporare nel sito dell'ente. Per ogni anno d'archivio mostra gli incendi più grandi dell'area e la terra sotto di essi, con una barra per anno per confrontare le stagioni. Con la MAP_KEY aggiunge i fuochi degli ultimi sette giorni. Senza, mostra solo gli archivi e lo scrive: gli ultimi giorni sono «non misurati», non «zero incendi». Si clicca un punto della mappa e la pagina dice quanto fidarsi di una rilevazione lì, e perché.

In alto, sempre visibile, c'è scritto che non è un'allerta. Sotto, che un satellite non vede tutti i fuochi.

Aperta su Palermo, nella stagione 2023 la pagina conta 46 incendi distinti in 20 giorni. Il più grande è quello del 25 e 26 luglio, arrivato alle case: 84 rilevazioni, su bosco e macchia. Un punto cliccato in quella zona ha affidabilità 1: una rilevazione lì è con ogni probabilità un incendio di vegetazione.

![La pagina impostata su Palermo, stagione 2023: i punti dell'incendio del 25-26 luglio sopra Tommaso Natale, una barra per anno, e l'affidabilità del punto cliccato](https://raw.githubusercontent.com/agent-engineering-studio/firms-client/main/docs/images/ui-comune.jpg)

*La pagina aperta sul Comune di Palermo. Dati: NASA FIRMS; copertura del suolo: ESA WorldCover 2021, CC BY 4.0; mappa: © OpenStreetMap contributors.*

**Statistiche per un modello.** Per ogni cella di una griglia qualunque, anche quella da un chilometro di Limen, la libreria conta i giorni di fuoco, la quota di coltivo sotto di essi e quanto fidarsi del posto. Dove non è mai bruciato la quota resta vuota, non zero: lì non c'è terra *sotto un fuoco* da descrivere.

**Un assistente AI che non inventa numeri.** La libreria ha un server MCP, un modo standard per dare strumenti a un assistente come Claude. Ogni risposta arriva come dati: i numeri con il periodo, il satellite, le fonti, la licenza e le note, e «non misurato» dove non c'era niente da leggere. Poi un controllo rilegge il testo dell'assistente, in italiano o in inglese, e trova i numeri che nei dati non ci sono. Su 21 errori scritti apposta in nove risposte, il controllo da solo ne trova **13**: tutti i numeri inventati, arrotondati male o «non misurati» scritti come zero. Non trova gli scambi, un numero vero detto della cosa sbagliata: 318 «incendi» quando 318 sono le rilevazioni. Quelli vanno riletti.

**Una prova per Limen.** Limen, la piattaforma che usa questi dati, calcola ogni giorno il pericolo meteo di incendio. In Italia, fra il 2024 e il 2026, al livello «alto» prende entro 72 ore il 62-68% delle celle che poi bruciano, dove a caso ne prenderebbe l'11-14%. Il Nord però resta indietro: in Lombardia, anche al livello «moderato», ne prende una su cinque. Gli incendi agricoli sono il segnale che manca? Ora Limen scrive per ogni cella la quota di coltivo sotto i suoi fuochi, e la risposta verrà da una misura, prima di toccare il modello.

## I limiti, detti chiaramente

**Un punto caldo non è un'allerta.** Dice che un satellite ha visto qualcosa di caldo, a una certa ora. Le allerte per gli incendi le danno la Protezione Civile e le Regioni.

**FIRMS non dice quanta superficie è bruciata.** Un pixel non è un'area: le aree bruciate le mappa EFFIS, da immagini della terra dopo il fuoco. E i numeri di MODIS e VIIRS non si confrontano tra loro, perché i pixel hanno grandezze diverse.

**Non dice perché è bruciato.** La terra intorno suggerisce se era un campo o un bosco, non se è stato un incidente, un abbruciamento o un incendio doloso.

**Quanto fidarsi è una nostra stima.** FIRMS non pubblica una mappa dell'affidabilità. La libreria la ricava da fuori, dalle fonti fisse e dalla terra intorno, e lo dichiara. Vale per l'Italia, e per VIIRS S-NPP: il servizio quasi in tempo reale aggiunge altri due satelliti e vede di più.

## Perché ne vale la pena

Il fuoco visto dallo spazio è il dato sugli incendi più aperto che ci sia: ventisei anni, tutto il pianeta, gratis. Ma letto senza attenzione mette un'acciaieria in cima agli incendi d'Italia, fa di un giorno senza dati un giorno senza fuochi e scambia la lava per un bosco.

Questa puntata apre il capitolo sugli incendi con il **segnale**: dove il satellite ha visto il fuoco. Le prossime porteranno la **verità a terra**, le aree bruciate di EFFIS, e l'**indice di pericolo** calcolato dal meteo, messo a confronto con quello ufficiale europeo.

---

**Per approfondire:** il [sito di firms-client](https://agentengineering.it/firms-client/), il [codice su GitHub](https://github.com/agent-engineering-studio/firms-client), la [tabella dei casi noti](https://github.com/agent-engineering-studio/firms-client#known-cases-what-the-library-gets-right-and-what-it-does-not), i [notebook](https://github.com/agent-engineering-studio/firms-client/tree/main/notebooks) e la pagina sul [riuso nella Pubblica Amministrazione](https://github.com/agent-engineering-studio/firms-client/blob/main/docs/riuso.md).

**Partecipa:** conosci un incendio che FIRMS non ha visto, o una fonte di calore che scambia per un incendio? Raccontalo nelle [discussioni su GitHub](https://github.com/orgs/agent-engineering-studio/discussions).

*Dati: We acknowledge the use of data and imagery from LANCE FIRMS operated by NASA's Earth Science Data and Information System (ESDIS) with funding provided by NASA Headquarters. Aree bruciate: EFFIS, © Unione europea, 1995-2025, CC BY 4.0. Copertura del suolo: ESA WorldCover 2021, CC BY 4.0. Questo articolo e la libreria non sono affiliati alla NASA, alla Commissione europea o all'ESA.*
