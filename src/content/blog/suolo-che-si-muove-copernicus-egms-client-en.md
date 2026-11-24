---
title: "Where the ground moves: Europe's ground measured by the Copernicus satellites"
description: "Fourth episode of the Open Data series. What the European Ground Motion Service measures, where it can mislead, and what you can build with the open egms-client library, including a page for the site of a municipality."
pubDate: 2026-11-25
author: "Giuseppe Zileni"
tags: ["open-data", "egms-client", "copernicus", "egms", "landslides", "subsidence", "python"]
series: "opendata"
project:
  name: "egms-client"
  repo: "https://github.com/agent-engineering-studio/egms-client"
  docs: "https://agentengineering.it/egms-client/"
draft: true
lang: "en"
---

In Pozzuoli, at Rione Terra, the ground rises by **145 millimetres a year**. It is not an estimate: the European Sentinel-1 satellites measure it from space, every few days. Between 2020 and mid-2025 the INGV station at Rione Terra rose by about 80 centimetres, and after 2022 it began to rise faster.

In the first episode of this series we saw **how much it rains**, with the radar of the Civil Protection. In the second, **where landslides have already happened**, with the ISPRA inventory. In the third, **how much rain is enough** to make a slope give way. That episode closed as the last one. One question was missing: **where is the ground moving now, even without rain?**

This fourth episode answers with a European dataset, and closes the chapter on landslides. The series goes on with wildfires and floods.

## The data in brief

The data is the **European Ground Motion Service**, EGMS: a service of Copernicus, the European Earth observation programme, run by the Copernicus Land Monitoring Service. It covers almost all of Europe. For each point of the ground it says by how many millimetres a year it rises, sinks or slides east or west.

It comes out about once a year, in **releases**. Each release covers several years: the newest is called 2020-2025. The name is not the dates, though. The measurements of that release run from **9 December 2020 to 19 November 2025**, and stop there: they do not describe the ground of today.

The data is free and open, under the Copernicus data policy: whoever publishes it must credit the source. To download it you need a free **service key**, created once on the Land Monitoring Service site. The archive is not documented and fails quietly: it answers "all good" even when it refuses. The **egms-client** library hides these problems and downloads each file only once.

## What it really measures

The Sentinel-1 satellites send radar pulses to the ground and receive the echo. Comparing the echo of one pass with the next shows whether a point moved closer to the satellite or farther away, by a few millimetres. This technique is called **radar interferometry**, or InSAR.

The satellite looks sideways, though, not straight down. It measures motion along its **line of sight**. Passing once northbound and once southbound, it sees the same point from two sides. Joining the two views, EGMS derives two maps: the **vertical** velocity and the **east-west** one, on a grid of 100-metre cells. North-south motion is not seen: the satellites fly almost along that direction.

![The vertical velocity of the ground around Pozzuoli: dark red around Rione Terra, grey over the sea and where there is no measurement](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/blog/pozzuoli-en.png)

*The vertical velocity around Pozzuoli, 2020-2025. In grey, where the satellite has no measurement. Data: EGMS, Copernicus Land Monitoring Service, © European Union.*

To know whether the library tells the truth, we tested it on five places where the answer is known from outside sources. Rione Terra rises, and INGV measures it on the ground. The plain of Bologna sinks, because water is pumped from underground. The Murge at Gioia del Colle stand still. The Foresta Umbra is a forest where the radar sees almost nothing. In Ancona there is the Posatora landslide, active since 1982. Of 23 checks, 21 pass. The two that fail stay there on purpose, and we tell why below.

## Where it can mislead

**Not measured does not mean still.** The radar measures where it finds stable targets: houses, rocks, roads. Under trees, on ploughed fields, under snow it finds little or nothing. In the Foresta Umbra **74% of the square kilometres** have not a single measured cell. A program that writes zero where the data is missing turns a forest into still ground. Limen, the platform that uses this data for landslides, did just that: 35,756 cells out of 312,550 entered the model as zero. There is now an open issue to fix it.

**Still does not mean zero.** The Murge do not move: it is a limestone plateau, with no known landslides or subsidence. Yet EGMS sees them going east by **1.6 millimetres a year**, all together. In Ancona it is 2.0. Nothing slides: it is a shift of the whole region against the reference of the product, most likely the Adriatic plate. We expected zero, and our hypothesis was wrong. That is why the two checks fail on purpose: a velocity is read against its surroundings, not against zero.

**A landslide can be smaller than a cell.** On the Posatora slope the 100-metre cell says **0.0 millimetres a year**. The satellite's measurement points on the same slope move, though: the 30 fastest moved by 30 millimetres in five years, along the line of sight. The map averages a whole cell; the slope does not.

![The displacement of the 30 fastest points of the Posatora goes down to 30 millimetres in five years; the 30 stillest stay around zero](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/blog/posatora-en.png)

*The Posatora slope, Ancona: the measurement points within 1.5 km, 2020-2025. Data: EGMS, Copernicus Land Monitoring Service, © European Union.*

**An acceleration has a sign.** EGMS also says whether a point is speeding up. A slope that speeds up downhill is a signal; one that slows down is not. If you drop the sign and keep only "how much", noise becomes a signal: at the Murge, which stand still, the signed acceleration is **-0.02** millimetres per year squared, the unsigned one **1.24**. At Rione Terra, instead, it is **+16.8**: the uplift is speeding up, as INGV says.

![Two histograms of the Murge: with its sign the acceleration spreads around zero; without it, it sits all above, around 1.24](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/blog/accelerazione-en.png)

*The vertical acceleration of the Murge, one value per square kilometre. Data: EGMS, Copernicus Land Monitoring Service, © European Union.*

## What you can build

The library installs with one line:

```bash
pip install "egms-client[raster]"
```

With the CLMS key in the environment, a few lines give the velocity of a point, how far to trust it and until when the data go:

```python
import asyncio

from egms_client import EgmsArchive
from egms_client.check import words
from egms_client.facts import velocity


async def main() -> None:
    async with EgmsArchive() as archive:  # the CLMS key, from the environment
        point = await archive.velocity_at(14.1205, 40.8225)  # Rione Terra, Pozzuoli
        facts = velocity([point.file], point.lon, point.lat, release=point.release)
        print(words(facts, "en"))  # the numbers of the data, how far to trust them, until when


asyncio.run(main())
```

It answers: the velocity of the cell is +145.2 mm/year; the median within 5 kilometres is +26.3; 76% of the cells within 500 metres have a value, so the measurement is reliable; the data run from 9 December 2020 to 19 November 2025. The same call, in the forest, says "not measured". On a lone cell in the Foresta Umbra it gives a score of 0.03 out of 1: there is a number, but around it there is almost nothing.

On top of this there are four uses.

**A page for the site of a municipality.** The project includes a ready page, in Italian and English, with the design kit of the Italian public administration. It installs with Docker and is set up with the name and coordinates of the municipality. At the first start it downloads the data of the area and the ISTAT boundaries, and shows a progress bar meanwhile; afterwards it opens at once. Next to the map it says what it is for: what the open data of the area say, how far to trust them, and where they are missing.

Click a point and a card opens on the map. Near Rione Terra it says "rises by 153.6 mm/year", with an arrow. A chart puts it next to the median of the 5 kilometres around, which is +28.7: that point rises more than five times faster than its surroundings. A bar says how far to trust it, another the period measured. Below are the other sources of the place: the radar rain of the Protezione Civile, the rain threshold for landslides, a rain gauge with its line.

![The page for the Comune di Pozzuoli: the card of a point near Rione Terra, rising by 153.6 mm/year, and the numbered squares where the ground moves most](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/ui-territorio.jpg)

*The page open on the Comune di Pozzuoli. Data: EGMS, Copernicus Land Monitoring Service, © European Union; boundaries of the municipalities: ISTAT, CC BY 4.0.*

The page also numbers the eight square kilometres where the ground moves most. At Pozzuoli the first rises by 153 millimetres a year, as a median. They are the zones to follow most closely. It is not an alert, and the page says so.

Then it shows where data are missing. A square kilometre where the satellite measures less than a quarter of the cells is a **data gap**, in amber. It is not a dangerous place. It is where the municipality can publish one more open dataset: a levelling, a GNSS station, a sensor, a survey. The sea does not count, because EGMS never measures there: the ISTAT boundaries of the municipalities take it out. At Pozzuoli the gaps are 3 square kilometres out of 47. One is on the edge of the Astroni crater, where the satellite measures 1% of the cells.

![A data gap on the edge of the Astroni crater: the card says the satellite measures 1% of the cells of that square kilometre, and how to add a source](https://raw.githubusercontent.com/agent-engineering-studio/egms-client/main/docs/images/ui-buco-di-dati.jpg)

*A data gap in the Comune di Pozzuoli. Data: EGMS, Copernicus Land Monitoring Service, © European Union; boundaries of the municipalities: ISTAT, CC BY 4.0.*

There is also [a thirty-second video](https://agentengineering.it/egms-client/images/ui-territorio.mp4) of the page.

**Statistics for a model.** A risk model does not work on 100-metre cells but on larger squares. The library computes statistics per square with three rules: where the data is missing it stays empty, signs are kept, every number uses the same cells. A test checks that the medians are Limen's, on the same cells.

**An AI assistant that does not invent numbers.** The library has an MCP server, a standard way to give tools to an assistant like Claude. Every answer carries the numbers with the release, the dates, the file and how far to trust them. A check reads the assistant's text back: it finds the numbers that are not in the data and the ones with the wrong sign, like "sinks by 4.5" where the data says +4.5. Of 17 faults written on purpose into six answers, the checks without a second model find 8: every invented number and every flipped sign. They do not find swaps, a true number said of the wrong thing.

**A test for Limen.** Limen has already tried using EGMS for landslides. On its own, the ground velocity tells landslide cells from the others no better than chance. An index called AUC says so: it is 0.5 for a model that guesses and 1 for one that never misses, and here it is between 0.48 and 0.54. That is why today it carries no weight in Limen's rules. The work of this episode found why, at least in part, and four fixes: the gap written as zero, 1 January 2020 in place of 9 December 2020, the acceleration without its sign, a duplicated client. Now the test can be run again.

## The limits, said clearly

**A velocity is not an alert.** It says how much the ground moved between 2020 and 2025. It does not say whether a building or a slope is safe. For the Campi Flegrei the official word is INGV's and the Civil Protection's; for landslides, the Regions' and the Department's.

**Fast motion is lost.** If a point moves by more than about a centimetre between two passes, InSAR loses count. A fast landslide does not show as slow: it does not show at all.

**North-south is not seen**, and a landslide smaller than a cell disappears in the average, as at the Posatora.

**The data comes late**, by design: the last measurement is of 19 November 2025. If the pace stays yearly, the next release will add 2026.

**How far to trust it is our estimate.** EGMS publishes no reliability map. The library derives one from outside, from how many cells are measured around and how well the series fits the model, and says so. The archive's formal error does not help: in the forest, where 99% of the cells are empty, it is at most 0.2 millimetres a year.

## Why it is worth it

With this episode the chapter on landslides is complete. The radar of the Civil Protection says how much it rains. The e-ITALICA thresholds say how much rain is enough. The ISPRA inventory says where the mountain has already come down. The Copernicus satellites say where the ground moves, slowly, even without rain.

They are four public works, made by different people, with different limits. Put together, with their limits written next to them, they let a municipality look at its own land with real data. Not to get an alert, but to know where to look more closely.

The series goes on with wildfires and floods.

---

**Read more:** the [egms-client site](https://agentengineering.it/egms-client/), the [code on GitHub](https://github.com/agent-engineering-studio/egms-client), the [benchmark of five places](https://agentengineering.it/egms-client/benchmark/), the [five notebooks](https://github.com/agent-engineering-studio/egms-client/tree/main/notebooks) and the page on [reuse in the Italian public administration](https://agentengineering.it/egms-client/riuso/) (in Italian).

**Join in:** do you know a place where the ground moves, or a still one that EGMS sees moving? Tell us in the [GitHub discussions](https://github.com/orgs/agent-engineering-studio/discussions).

*Data: European Ground Motion Service (EGMS), Copernicus Land Monitoring Service, © European Union; contains modified Copernicus Land Monitoring Service information. GNSS measurements at Rione Terra: INGV, Osservatorio Vesuviano. Boundaries of the municipalities: ISTAT, CC BY 4.0. This article and the library are not affiliated with the European Commission, the European Environment Agency or INGV.*
