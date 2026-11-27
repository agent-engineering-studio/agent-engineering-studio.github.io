---
title: "Dove il terreno si muove: il suolo d'Europa misurato dai satelliti Copernicus"
description: "Quarta puntata della rubrica Open Data. Che cosa misura l'European Ground Motion Service, dove può ingannare e che cosa ci si costruisce con la libreria aperta egms-client, compresa una pagina per il sito del Comune."
pubDate: 2026-11-25
author: "Giuseppe Zileni"
tags: ["open-data", "egms-client", "copernicus", "egms", "frane", "subsidenza", "python"]
series: "opendata"
project:
  name: "egms-client"
  repo: "https://github.com/agent-engineering-studio/egms-client"
  docs: "https://agentengineering.it/egms-client/"
draft: false
---

A Pozzuoli, al Rione Terra, il suolo sale di **145 millimetri all'anno**. Non è una stima: lo misurano i satelliti europei Sentinel-1, dallo spazio, ogni pochi giorni. Tra il 2020 e la metà del 2025 la stazione dell'INGV al Rione Terra è salita di circa 80 centimetri, e dopo il 2022 ha preso a salire più in fretta.

Nella prima puntata di questa rubrica abbiamo visto **quanto piove**, con il radar della Protezione Civile. Nella seconda, **dove è già franato**, con l'inventario dell'ISPRA. Nella terza, **quanta pioggia basta** per far franare un versante. Quella puntata si chiudeva come l'ultima. Mancava però una domanda: **dove il terreno si sta muovendo adesso, anche senza pioggia?**

Questa quarta puntata risponde con un dato europeo, e chiude il capitolo sulle frane. La rubrica continua con gli incendi e le alluvioni.

## Il dato in breve

Il dato è l'**European Ground Motion Service**, EGMS: un servizio di Copernicus, il programma europeo di osservazione della Terra, gestito dal Copernicus Land Monitoring Service. Copre quasi tutta l'Europa. Per ogni punto del terreno dice di quanti millimetri all'anno sale, scende o scivola verso est o verso ovest.

Esce circa una volta all'anno, in **release**. Ogni release copre più anni: oggi la più recente si chiama 2020-2025. Il nome però non è la data. Le misure di quella release vanno dal **9 dicembre 2020 al 19 novembre 2025**, e si fermano lì: non descrivono il terreno di oggi.

I dati sono liberi e gratuiti, secondo la politica dei dati Copernicus: chi li pubblica deve citare la fonte. Per scaricarli serve una **chiave di servizio** gratuita, da creare una volta sul sito del Land Monitoring Service. L'archivio non è documentato e sbaglia in silenzio: risponde «tutto bene» anche quando rifiuta. La libreria **egms-client** nasconde questi problemi e scarica ogni file una volta sola.

## Che cosa misura davvero

I satelliti Sentinel-1 mandano a terra impulsi radar e ne ricevono l'eco. Confrontando l'eco di un passaggio con quello del successivo si vede se un punto si è avvicinato o allontanato dal satellite, di pochi millimetri. Questa tecnica si chiama **interferometria radar**, o InSAR.

Il satellite però guarda di lato, non dall'alto. Misura il movimento lungo la sua **linea di vista**. Passando una volta verso nord e una verso sud, guarda lo stesso punto da due lati. Unendo le due viste, l'EGMS ricava due mappe: la velocità **verticale** e quella **est-ovest**, su una griglia di celle da 100 metri. Il movimento nord-sud non si vede: i satelliti volano quasi lungo quella direzione.

![La velocità verticale del suolo intorno a Pozzuoli: rosso scuro attorno al Rione Terra, grigio sul mare e dove non c'è misura](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/blog/pozzuoli-it.png)

*La velocità verticale intorno a Pozzuoli, 2020-2025. In grigio, dove il satellite non ha misure. Dati: EGMS, Copernicus Land Monitoring Service, © Unione europea.*

Per sapere se la libreria dice il vero, l'abbiamo messa alla prova su cinque luoghi dove la risposta si conosce da fonti esterne. Il Rione Terra sale, e l'INGV lo misura da terra. La pianura di Bologna scende, per l'acqua pompata dal sottosuolo. Le Murge a Gioia del Colle sono ferme. La Foresta Umbra è un bosco dove il radar non vede quasi niente. Ad Ancona c'è la frana della Posatora, attiva dal 1982. Su 23 controlli ne passano 21. I due che non passano restano lì apposta, e li raccontiamo tra poco.

## Dove può ingannare

**Non misurato non vuol dire fermo.** Il radar misura dove trova bersagli stabili: case, rocce, strade. Sotto gli alberi, sui campi arati, sotto la neve trova poco o niente. Nella Foresta Umbra il **74% dei chilometri quadrati** non ha nemmeno una cella misurata. Un programma che scrive zero dove manca il dato fa di un bosco un terreno fermo. Limen, la piattaforma che usa questi dati per le frane, lo faceva: 35.756 celle su 312.550 entravano nel modello come zero. Ora c'è una segnalazione aperta per correggerlo.

**Fermo non vuol dire zero.** Le Murge non si muovono: è un altopiano di calcare, senza frane né subsidenza note. Eppure l'EGMS le vede andare verso est di **1,6 millimetri all'anno**, tutte insieme. Ad Ancona sono 2,0. Non scivola niente: è uno spostamento di tutta la regione rispetto al riferimento del prodotto, probabilmente la placca adriatica. Ci aspettavamo zero, e la nostra ipotesi era sbagliata. Per questo i due controlli falliscono di proposito: una velocità si legge rispetto ai dintorni, non rispetto allo zero.

**Una frana può essere più piccola di una cella.** Sul versante della Posatora la cella da 100 metri dice **0,0 millimetri all'anno**. I punti di misura del satellite sullo stesso versante, invece, si muovono: i 30 più veloci si sono spostati di 30 millimetri in cinque anni, lungo la linea di vista. La mappa media una cella intera, il versante no.

![Lo spostamento dei 30 punti più veloci della Posatora scende fino a 30 millimetri in cinque anni, quello dei 30 più fermi resta intorno a zero](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/blog/posatora-it.png)

*Il versante della Posatora, Ancona: i punti di misura entro 1,5 km, 2020-2025. Dati: EGMS, Copernicus Land Monitoring Service, © Unione europea.*

**Un'accelerazione ha un segno.** L'EGMS dice anche se un punto accelera. Un versante che accelera verso il basso è un segnale; uno che rallenta no. Se si toglie il segno e si tiene solo «quanto», il rumore diventa un segnale: alle Murge, che sono ferme, l'accelerazione con il segno vale **-0,02** millimetri all'anno al quadrato, quella senza segno **1,24**. Al Rione Terra, invece, è **+16,8**: il sollevamento accelera, come dice l'INGV.

![Due istogrammi delle Murge: con il segno l'accelerazione si distribuisce intorno a zero, senza segno sta tutta sopra, intorno a 1,24](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/blog/accelerazione-it.png)

*L'accelerazione verticale delle Murge, un valore per chilometro quadrato. Dati: EGMS, Copernicus Land Monitoring Service, © Unione europea.*

## Che cosa ci costruisci

La libreria si installa con una riga:

```bash
pip install "egms-client[raster]"
```

Con la chiave CLMS nell'ambiente, bastano poche righe per avere la velocità di un punto, con quanto fidarsi e fino a quando arrivano i dati:

```python
import asyncio

from egms_client import EgmsArchive
from egms_client.check import words
from egms_client.facts import velocity


async def main() -> None:
    async with EgmsArchive() as archivio:  # la chiave CLMS, dall'ambiente
        punto = await archivio.velocity_at(14.1205, 40.8225)  # Rione Terra, Pozzuoli
        fatti = velocity([punto.file], punto.lon, punto.lat, release=punto.release)
        print(words(fatti, "it"))  # i numeri dei dati, quanto fidarsi, fino a quando


asyncio.run(main())
```

Risponde: la velocità della cella è +145,2 mm/anno; la mediana entro 5 chilometri è +26,3; il 76% delle celle entro 500 metri ha un valore, quindi la misura è affidabile; i dati vanno dal 9 dicembre 2020 al 19 novembre 2025. Lo stesso calcolo, nel bosco, dice «non misurato». Su una cella isolata nella Foresta Umbra dà un punteggio di 0,03 su 1: c'è un numero, ma intorno non c'è quasi niente.

Sopra questo ci sono quattro usi.

**Una pagina per il sito del Comune.** Il progetto include una pagina pronta, in italiano e in inglese, con il kit grafico della Pubblica Amministrazione. Si installa con Docker e si imposta con il nome e le coordinate del Comune. Al primo avvio scarica i dati dell'area e i confini dell'ISTAT, e intanto mostra una barra di avanzamento; le volte dopo si apre subito. Accanto alla mappa dice a che cosa serve: che cosa dicono i dati aperti del territorio, quanto fidarsi, e dove mancano.

Si clicca un punto e sulla mappa si apre una scheda. Vicino al Rione Terra dice «sale di 153,6 mm/anno», con una freccia. Un grafico lo mette accanto alla mediana dei 5 chilometri intorno, che è +28,7: quel punto sale più di cinque volte più in fretta dei dintorni. Una barra dice quanto fidarsi, un'altra il periodo misurato. Sotto ci sono le altre fonti del posto: la pioggia del radar della Protezione Civile, la soglia di pioggia per le frane, un pluviometro con la sua linea.

![La pagina per il Comune di Pozzuoli: la scheda di un punto vicino al Rione Terra, che sale di 153,6 mm/anno, e i quadrati numerati dove il suolo si muove di più](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/ui-territorio.jpg)

*La pagina aperta sul Comune di Pozzuoli. Dati: EGMS, Copernicus Land Monitoring Service, © Unione europea; confini dei Comuni: ISTAT, CC BY 4.0.*

La pagina numera anche gli otto chilometri quadrati dove il suolo si muove di più. A Pozzuoli il primo sale di 153 millimetri all'anno, in mediana. Sono le zone da seguire con più attenzione. Non è un'allerta, e la pagina lo scrive.

Poi mostra dove i dati mancano. Un chilometro quadrato dove il satellite misura meno di un quarto delle celle è un **buco di dati**, in arancione. Non è un posto pericoloso. È il posto dove il Comune può pubblicare un dato aperto in più: una livellazione, una stazione GNSS, un sensore, un rilievo. Il mare non conta, perché l'EGMS lì non misura mai: lo tolgono i confini dei Comuni dell'ISTAT. A Pozzuoli i buchi sono 3 chilometri quadrati su 47. Uno è al bordo del cratere degli Astroni, dove il satellite misura l'1% delle celle.

![Un buco di dati al bordo del cratere degli Astroni: la scheda dice che in quel chilometro quadrato il satellite misura l'1% delle celle, e come aggiungere una fonte](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/ui-buco-di-dati.jpg)

*Un buco di dati nel Comune di Pozzuoli. Dati: EGMS, Copernicus Land Monitoring Service, © Unione europea; confini dei Comuni: ISTAT, CC BY 4.0.*

C'è anche [un video di trenta secondi](https://agentengineering.it/egms-client/images/ui-territorio.mp4) della pagina.

**Statistiche per un modello.** Un modello di rischio non lavora su celle da 100 metri, ma su quadrati più grandi. La libreria fa le statistiche per quadrato con tre regole: dove manca il dato resta vuoto, i segni si tengono, ogni numero usa le stesse celle. Un test verifica che le mediane siano quelle di Limen, sulle stesse celle.

**Un assistente AI che non inventa numeri.** La libreria ha un server MCP, un modo standard per dare strumenti a un assistente come Claude. Ogni risposta porta i numeri con la release, le date, il file e quanto fidarsi. Un controllo rilegge il testo dell'assistente: trova i numeri che non ci sono nei dati e quelli con il segno sbagliato, come «scende di 4,5» dove il dato dice +4,5. Su 17 errori scritti apposta in sei risposte, i controlli senza un secondo modello ne trovano 8: tutti i numeri inventati e tutti i segni rovesciati. Non trovano gli scambi, un numero vero detto della cosa sbagliata.

**Una prova per Limen.** Limen ha già provato a usare l'EGMS per le frane. Da sola, la velocità del suolo distingue le celle con frane dalle altre come il caso. Lo dice un indice, l'AUC, che vale 0,5 per un modello che tira a indovinare e 1 per uno che non sbaglia mai: qui sta tra 0,48 e 0,54. Per questo oggi non pesa nelle sue regole. Il lavoro di questa puntata ha trovato perché, almeno in parte, e quattro correzioni: il vuoto scritto come zero, il 1° gennaio 2020 al posto del 9 dicembre 2020, l'accelerazione senza segno, un client duplicato. Ora si può rifare la prova.

## I limiti, detti chiaramente

**Una velocità non è un'allerta.** Dice quanto si è mosso il terreno tra il 2020 e il 2025. Non dice se un edificio o un versante è sicuro. Per i Campi Flegrei la parola ufficiale è dell'INGV e della Protezione Civile; per le frane, delle Regioni e del Dipartimento.

**I movimenti rapidi si perdono.** Se un punto si sposta di più di circa un centimetro tra due passaggi, l'InSAR perde il conto. Una frana veloce non risulta lenta: non risulta proprio.

**Il nord-sud non si vede**, e una frana più piccola di una cella sparisce nella media, come alla Posatora.

**I dati arrivano in ritardo**, per costruzione: l'ultima misura è del 19 novembre 2025. Se il ritmo resta annuale, la prossima release aggiungerà il 2026.

**Quanto fidarsi è una nostra stima.** L'EGMS non pubblica una mappa dell'affidabilità. La libreria la ricava da fuori, da quante celle sono misurate intorno e da quanto la serie segue il modello, e lo dichiara. L'errore formale dell'archivio, invece, non aiuta: nel bosco, dove il 99% delle celle è vuoto, vale al massimo 0,2 millimetri all'anno.

## Perché ne vale la pena

Con questa puntata il capitolo sulle frane è completo. Il radar della Protezione Civile dice quanto piove. Le soglie di e-ITALICA dicono quanta pioggia basta. L'inventario dell'ISPRA dice dove la montagna è già scesa. I satelliti Copernicus dicono dove il terreno si muove, piano, anche senza pioggia.

Sono quattro lavori pubblici, fatti da persone diverse, con limiti diversi. Messi insieme, con i loro limiti scritti accanto, permettono a un Comune di guardare il proprio territorio con dati veri. Non per avere un'allerta, ma per sapere dove guardare meglio.

La rubrica continua con gli incendi e le alluvioni.

---

**Per approfondire:** il [sito di egms-client](https://agentengineering.it/egms-client/), il [codice su GitHub](https://github.com/agent-engineering-studio/egms-client), il [benchmark dei cinque luoghi](https://agentengineering.it/egms-client/benchmark/), i [cinque notebook](https://github.com/agent-engineering-studio/egms-client/tree/main/notebooks) e la pagina sul [riuso nella Pubblica Amministrazione](https://agentengineering.it/egms-client/riuso/).

**Partecipa:** conosci un luogo dove il terreno si muove, o uno fermo che l'EGMS vede muoversi? Raccontalo nelle [discussioni su GitHub](https://github.com/orgs/agent-engineering-studio/discussions).

*Dati: European Ground Motion Service (EGMS), Copernicus Land Monitoring Service, © Unione europea; contiene informazioni modificate del Copernicus Land Monitoring Service. Misure GNSS del Rione Terra: INGV, Osservatorio Vesuviano. Confini dei Comuni: ISTAT, CC BY 4.0. Questo articolo e la libreria non sono affiliati alla Commissione europea, all'Agenzia europea dell'ambiente o all'INGV.*
