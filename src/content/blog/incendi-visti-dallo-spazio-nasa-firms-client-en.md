---
title: "Fire seen from space: Italy's wildfires in the NASA FIRMS data"
description: "Fifth episode of the Open Data series. What NASA's active fires measure, where they can mislead, and what you can build with the open firms-client library, including a page for the site of a municipality."
pubDate: 2026-11-27
author: "Giuseppe Zileni"
tags: ["open-data", "firms-client", "nasa", "firms", "wildfires", "viirs", "python"]
series: "opendata"
project:
  name: "firms-client"
  repo: "https://github.com/agent-engineering-studio/firms-client"
  docs: "https://agentengineering.it/firms-client/"
draft: true
lang: "en"
---

The square kilometre of Italy that has "burnt" on the most days in the last fourteen years is not a forest. It is the steelworks in Taranto: **3,308 fire-days** seen by NASA's satellites. There is no fire there. There is a blast furnace, hot every day of the year, and a satellite sees heat, not fire.

The first four episodes of this series told the story of landslides: **how much it rains**, **where the ground has already slid**, **how much rain is enough**, **where the ground is moving**. This one opens the chapter on wildfires, starting from the most used data in the world for seeing them.

## The data in brief

The data is **FIRMS**, NASA's Fire Information for Resource Management System. It collects every active fire seen by satellites since 2000, over the whole Earth, a few hours after the overpass.

There are two ways to read it. The **yearly archives per country** are open files: no account, no key. For Italy there are those of the MODIS instrument from 2000 and those of VIIRS S-NPP from 2012. A year comes out once it is over. For the last days there is a **near-real-time** service, which asks for a free key, the MAP_KEY: an e-mail address is enough.

The data are free. Whoever publishes them must acknowledge NASA, with a sentence the **firms-client** library already carries. The library downloads each archive once, catches the error pages the service sends with "all is well", and above all tells a fire from a factory.

## What it really measures

Some satellites look at the whole Earth a few times a day with **thermal infrared** sensors, which see heat. When a pixel is much hotter than those around it, FIRMS reports it as a **hotspot**: a position, a time, a temperature, the power of the fire in megawatts and a confidence. A VIIRS pixel is about 375 metres across, a MODIS one a kilometre.

A hotspot, then, is not a fire. A large fire is made of dozens of hotspots, on different days. And a hotspot may not be a fire at all. That is why FIRMS gives every detection a **type**: vegetation fire, volcano, static source on land (industry, refinery flares), offshore platform.

![Italy in 2025 as seen by VIIRS: vegetation fires in the South and on the islands, industrial sources in the Po valley and in Taranto](https://raw.githubusercontent.com/agent-engineering-studio/firms-client/main/docs/images/map.png)

*VIIRS S-NPP detections over Italy in 2025, coloured by type. Data: NASA FIRMS.*

In 2025 VIIRS recorded **23,349 detections** over Italy. Without volcanoes, industry, the sea and the low-confidence ones, **14,880 vegetation fires** are left. About one detection in four was not a fire in fields or woods.

To know whether the library tells the truth, we tested it on cases where the answer is known from sources other than FIRMS: two large wildfires (Montiferru 2021, Palermo 2023), the Taranto steelworks, an Etna lava flow, the open sea, the two worst seasons, and ten burnt areas mapped by EFFIS, the European fire service, on land almost all agricultural or almost all natural. **Of 41 checks, 34 pass.** Those that fail stay in the table, and we tell them below.

## Where it can mislead

**Hot does not mean fire.** The Taranto steelworks passes every confidence filter, because it really is hot. Only the FIRMS type removes it: with the type, 3.4% of the detections around the steelworks are kept. The trouble is that the near-real-time service **does not give the type**. There a steelworks looks like a fire. So the library builds a mask of the static sources from the archives of past years, and with it the detections kept in Taranto drop to zero.

**Type 0 is not always vegetation.** Italy's largest "vegetation fire" of 2025, 16 to 21 February, is a lava flow on the flank of Etna. FIRMS types 44% of its detections as vegetation, and the mask still lets 15% through. These are two of the seven checks that fail.

**No hotspot does not mean no fire.** FIRMS only says where it saw something. Clouds, smoke and the time of the overpass hide fires. We counted how many of the 10,290 burnt areas mapped by EFFIS in Italy have at least one VIIRS detection inside: between 2022 and 2025, **one in five** under 30 hectares, **almost nine in ten** between 300 and 1,000. At Polizzi Generosa, on 6 July 2022, 876 hectares burnt and VIIRS did not see a single hotspot in three days.

**Some days the satellite is silent.** From 27 July to 10 August 2022, in the middle of the fire season, VIIRS S-NPP sent no data. On those days the right answer is not "no fire", it is **"not measured"**. The library lists them, and an analysis that treats them as zero goes wrong in the most dangerous direction: it makes a period nobody looked at seem calm.

**A fire in the fields is a real fire.** Burning stubble gives vegetation hotspots, like a forest fire. To tell them apart the library looks at the land around, with the ESA WorldCover map. It works on forests: five fires out of five on natural land come out "wildfire". On fields it goes worse: of four fires EFFIS says were 90% agricultural, the rule recognises one. WorldCover calls pasture and fallow land "grassland", and the rule gets confused. The continuous number holds instead: the share of cropland under the fire-days goes from **0.58 to 0.86** on the agricultural fires and from **0 to 0.004** on the forest ones. A model can use that number; a yes-or-no throws it away.

## What you can build with it

The library installs with one line:

```bash
pip install firms-client
```

A year of Italy, with no key, in a few lines:

```python
import asyncio

import httpx

from firms_client import VIIRS_SNPP, cluster, fetch_archive, select


async def main() -> None:
    async with httpx.AsyncClient(timeout=120) as client:
        rows = await fetch_archive(client, VIIRS_SNPP, 2025, "Italy")  # 23,349 detections
        fires = select(rows)  # 14,880: no industry, volcanoes or sea
        events = cluster(fires)  # neighbouring points in space and time, largest first
        print(len(rows), len(fires), events[0])


asyncio.run(main())
```

On top of this there are four uses.

**A page for the site of a municipality.**

The project includes a ready page, in Italian and in English, with the design kit of the Italian public administration. It installs with Docker and is set with the name and coordinates of the municipality; it can be embedded in the authority's site. For each archive year it shows the largest fires in the area and the land under them, with a bar per year to compare the seasons. With the MAP_KEY it adds the fires of the last seven days. Without it, it shows only the archives and says so: the last days are "not measured", not "zero fires". Click a point on the map and the page says how far to trust a detection there, and why.

At the top, always visible, it says it is not an alert. Below, that a satellite does not see every fire.

Set on Palermo, for the 2023 season the page counts 46 separate fires on 20 days. The largest is that of 25 and 26 July, which reached the houses: 84 detections, on woods and scrub. A point clicked in that area has trust 1: a detection there is most likely a vegetation fire.

![The page set on Palermo, 2023 season: the points of the 25-26 July fire above Tommaso Natale, a bar per year, and the trust of the clicked point](https://raw.githubusercontent.com/agent-engineering-studio/firms-client/main/docs/images/ui-comune-en.jpg)

*The page open on the Comune di Palermo. Data: NASA FIRMS; land cover: ESA WorldCover 2021, CC BY 4.0; map: © OpenStreetMap contributors.*

**Statistics for a model.** For each cell of any grid, including Limen's one-kilometre grid, the library counts the fire-days, the share of cropland under them and how far to trust the place. Where nothing ever burnt the share stays empty, not zero: there is no land *under a fire* to describe there.

**An AI assistant that does not invent numbers.** The library has an MCP server, a standard way to give tools to an assistant like Claude. Every answer arrives as data: the numbers with the period, the satellite, the sources, the licence and the notes, and "not measured" where there was nothing to read. Then a check rereads the assistant's text, in Italian or in English, and finds the numbers that are not in the data. Of 21 errors written on purpose into nine answers, the check alone finds **13**: every invented number, every bad rounding, every "not measured" written as zero. It does not find swaps, a true number said of the wrong thing: 318 "fires" when 318 is the number of detections. Those must be reread.

**A test for Limen.** Limen, the platform that uses these data, computes the weather fire danger every day. In Italy, between 2024 and 2026, at the "high" level it catches within 72 hours 62-68% of the cells that then burn, where chance would catch 11-14%. The North lags behind, though: in Lombardy, even at the "moderate" level, it catches one in five. Are agricultural fires the missing signal? Limen now writes for each cell the share of cropland under its fires, and the answer will come from a measurement, before the model is touched.

## The limits, stated clearly

**A hotspot is not an alert.** It says a satellite saw something hot, at a given time. Fire alerts are issued by the Civil Protection and the Regions.

**FIRMS does not say how much land burnt.** A pixel is not an area: burnt areas are mapped by EFFIS, from images of the land after the fire. And MODIS and VIIRS counts cannot be compared, because their pixels differ in size.

**It does not say why it burnt.** The land around suggests whether it was a field or a forest, not whether it was an accident, stubble burning or arson.

**How far to trust it is our own estimate.** FIRMS publishes no reliability map. The library derives one from outside, from the static sources and the land around, and says so. It holds for Italy, and for VIIRS S-NPP: the near-real-time service adds two more satellites and sees more.

## Why it is worth it

Fire seen from space is the most open wildfire data there is: twenty-six years, the whole planet, free. But read carelessly it puts a steelworks at the top of Italy's fires, makes a day without data a day without fires, and mistakes lava for a forest.

This episode opens the wildfire chapter with the **signal**: where the satellite saw fire. The next ones will bring the **ground truth**, the EFFIS burnt areas, and the **danger index** computed from the weather, compared with the official European one.

---

**Read more:** the [firms-client site](https://agentengineering.it/firms-client/), the [code on GitHub](https://github.com/agent-engineering-studio/firms-client), the [table of known cases](https://github.com/agent-engineering-studio/firms-client#known-cases-what-the-library-gets-right-and-what-it-does-not), the [notebooks](https://github.com/agent-engineering-studio/firms-client/tree/main/notebooks) and the page on [reuse in the Italian public administration](https://github.com/agent-engineering-studio/firms-client/blob/main/docs/riuso.md) (in Italian).

**Join in:** do you know a fire FIRMS did not see, or a heat source it mistakes for a fire? Tell us in the [GitHub discussions](https://github.com/orgs/agent-engineering-studio/discussions).

*Data: We acknowledge the use of data and imagery from LANCE FIRMS operated by NASA's Earth Science Data and Information System (ESDIS) with funding provided by NASA Headquarters. Burnt areas: EFFIS, © European Union, 1995-2025, CC BY 4.0. Land cover: ESA WorldCover 2021, CC BY 4.0. This article and the library are not affiliated with NASA, the European Commission or ESA.*
