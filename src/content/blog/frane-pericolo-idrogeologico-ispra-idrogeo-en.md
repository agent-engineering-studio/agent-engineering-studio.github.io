---
title: "Where Italy's landslides are, and how far to trust the map: the ISPRA IdroGEO data"
description: "Second episode of the Open Data series. What the landslide inventory and the hazard maps of ISPRA say, where they can mislead, and what you can build with the open ispra-idrogeo library, a map for a town's website included."
pubDate: 2026-11-23
author: "Giuseppe Zileni"
tags: ["open-data", "ispra-idrogeo", "ispra", "landslides", "hydrogeological-hazard", "python"]
series: "opendata"
project:
  name: "ispra-idrogeo"
  repo: "https://github.com/agent-engineering-studio/ispra-idrogeo"
  docs: "https://agentengineering.it/ispra-idrogeo/"
draft: false
lang: "en"
---

On 26 November 2022, just after five in the morning, a mudflow came down Mount Epomeo onto Casamicciola Terme, on the island of Ischia. Twelve people died.

The national landslide inventory had already mapped 213 landslides in that town. The map had long said **where** the mountain had come down before. It could not say **when** it would happen again.

That difference, between where and when, runs through this second episode. The data comes from ISPRA, it is public and free, and it tells the story of Italy's landslides and floods better than almost any other source. You only need to know what it says, and what it does not.

## The data in brief

ISPRA, Italy's national environmental agency, publishes three different things on its **IdroGEO** platform.

The first is the **Italian landslide inventory**, IFFI: every landslide that ISPRA and the regions found and mapped over decades of surveys. Today there are **721,457**. Each has a point, often an outline, its type of movement and its town.

The second are the **hazard maps**: where the ground may slide or rivers may flood. The river basin authorities draw them in their basin plans, the PAI, in classes from P1 (moderate) to P4 (very high). ISPRA joins them into national maps called mosaics. According to the latest one, from 2024, **9.5% of Italy** is in high or very high landslide hazard.

The third are the **risk indicators**: by crossing the maps with the census, ISPRA counts the people, buildings and cultural heritage in each hazard class, town by town. **1.28 million** people live in high or very high landslide hazard. **6.8 million** live in areas that can flood once every 100 to 200 years.

No account and no key are needed. The licences deserve a careful read, because they are not all the same: the landslide inventory is **CC BY-SA 4.0**, with a different citation for each region, and anyone publishing derived data must share it under the same licence. The 2024 hazard map and the indicators are **CC BY 4.0**, freer.

![The IFFI inventory region by region: one square per region, coloured by landslides per 100 km²](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/map.svg)

*The landslides mapped in each region. Data: ISPRA IdroGEO, IFFI, CC BY-SA 4.0.*

## What it really measures

The inventory is a **memory**: each point is a landslide that someone saw and drew. It is not a forecast. Where there are many points, the mountain has already moved many times.

The PAI maps are an **assessment**: an expert looked at slopes, rocks and past landslides, and wrote "the hazard here is high". They are the official reference for land planning, but ISPRA itself points out that the national mosaics are a technical and scientific work: the maps with legal value are those of the basin authorities.

And then there is what interested me most: **dates**. To check whether a given rain makes a slope slide, you need landslides whose day is known. Here the data gets thin. Of the 721,457 landslides in the inventory, only **28,076 have a date**, 3.9%. Those dated to the day are **10,822**. The others have at most an interval: a month, a year, sometimes just "1979".

Next to the inventory there is a smaller archive of **events**, landslides recorded with their date: 1,710 since 2018. But 1,466 of those dates give only the day, with no time.

## Where it can mislead

Using this data in a program taught four lessons.

**Dates are almost all in the north-east.** Trentino-Alto Adige, Friuli-Venezia Giulia and Veneto date between a fifth and a quarter of their landslides to the day. Sixteen regions date fewer than 1%, seven fewer than one in a thousand. Anyone checking a rainfall threshold on the inventory's dated landslides is, without knowing it, mostly studying the eastern Alps. And **6,814 of the 7,899 towns** have no landslide dated to the day since 2018.

![IFFI landslides dated to the day, region by region: the north-east around 20%, sixteen regions under 1%](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/dates.svg)

*How many landslides have a date to the day, by region. Data: ISPRA IdroGEO, IFFI, CC BY-SA 4.0.*

**Few landslides does not mean little hazard.** Lombardy maps almost six landslides per square kilometre, Apulia four per hundred. Part of it is geology. Part of it is how hard people looked: an inventory counts the landslides someone surveyed. No public data can tell the two apart, and a map with few points is not proof of safety.

**A field can say "exact" and mean nothing.** Every landslide has a field for the accuracy of its position. It says "exact" for all 721,457. A value that never changes tells you nothing: the real precision of the points is simply not stated. The events, instead, really do state it, from "exact" to 10 kilometres.

**The source also changes under your feet.** On 9 November 2026, IdroGEO's landslide search started answering with an error to anyone who did not name the fields to read: an internal table had been removed. No notice. A program that uses a public service must check it every day, not trust that it stays the same.

And one case that shows the timing: on 10 October 2026 a cloudburst hit Melito di Porto Salvo, in Calabria. On 22 November IdroGEO still had no landslide event recorded for that storm. Official data arrives, but it arrives later.

## What you can build

**[ispra-idrogeo](https://agentengineering.it/ispra-idrogeo/)** is an open Python library, Apache-2.0 licensed, that does the boring work and keeps track of the traps: it downloads the national files and updates them only when ISPRA changes them, reads the indicators of every town, and asks the maps about a point.

```bash
pip install ispra-idrogeo
```

There is also a command, `idrogeo`. To know the hazard on the hills above Sarno:

```bash
idrogeo hazard 40.829 14.617
# landslide hazard P4, town of Sarno, slope 12.3 degrees
```

On top of the basic data, the library answers the questions that come right after:

- **which landslides have a date, and how precise is it?** It gathers them from the inventory and the events, each with the precision of its date (hour, day or interval) and of its point, so a study can keep only those it trusts;
- **how far can I trust the inventory in this town?** For each of the 7,899 towns it says how many landslides are dated, how recently the records were touched, and what nobody has measured;
- **when did ISPRA change these files?** It asks without downloading them: the inventory is rebuilt every day, the hazard maps every few years.

And then there are two uses that go beyond the script.

**A map for the town's website.** The project includes a ready page, in Italian, built with the design kit of the Italian public administration. It opens on a town and shows the landslide hazard areas of the 2024 map, flood hazard, the mapped and the dated landslides. Next to them, the people and assets exposed, and a **predisposition class**: the share of the town's land that the official maps put in hazard, in five fixed steps. Sarno, for example, has 43% of its land in high or very high landslide hazard: predisposition "very high". Above all, the page says **how far to trust** that data in that town, and which data is missing.

![The Mappa dei dati opened on Sarno: landslide hazard areas, flood hazard, mapped and dated landslides, with the record of a landslide of 5 May 1998](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/mappa-sarno.jpg)

*The map opened on Sarno, with the record of a landslide of 5 May 1998, the day of the mudflow. Data: ISPRA IdroGEO.*

![The 7,899 towns by landslide and flood predisposition class](https://raw.githubusercontent.com/agent-engineering-studio/ispra-idrogeo/main/docs/images/classes.svg)

*How Italian towns fall into the five classes. Data: ISPRA IdroGEO, risk indicators, CC BY 4.0.*

**An AI assistant that does not invent numbers.** The library includes an MCP server, a standard way to give an assistant such as Claude tools to read the data: nineteen of them, from the hazard at a point to rankings of towns, down to how far the data can be trusted in a place. There is only one rule: numbers come from the data, words from the model. Every answer carries its source, its licence and the time the data was read, and a check compares every number of a text with the data it was written from: a number that no tool returned is flagged.

I put it to the test with real questions, whose right answer is computed again from the data at every run: how many people live in flood hazard in Bari, how many landslides Trivento has, what the map says about Venice. In a first round of five questions the assistant answered all five right and cited ISPRA every time, for 23 dollar cents. But it never used the number check, although the instructions asked for it: with an answer made of one number, it goes straight to the answer. That is the next thing to improve.

There is also a limit worth saying: the check makes sure a number exists in the data, not that it is said of the right thing. The rest is up to whoever reads it again.

## The limits, said plainly

**It is not an alert system.** The library reads no rain. The official alert is the bulletin of the Civil Protection Department and of the region. The predisposition class says how much of the land is in hazard, not whether a landslide is coming.

**A hazard map is not a survey of your house.** It does not say whether a building is safe: that takes specific studies and the official maps of the basin authority.

**The inventory is unevenly incomplete.** Where few landslides are mapped there may be little hazard, or little surveying. The data cannot tell.

**Dates are few.** That is why anyone joining landslides with rainfall must say how many they used, and where. At Agent Engineering Studio this is Limen's job, the project that brings rain, thresholds and hazard together: ispra-idrogeo gives it the landslides and the measure of how far to trust them, and takes no decision in its place.

## Why it is worth it

Italy's landslides were searched for and drawn over decades by geologists of the regions, of ISPRA, of the universities. That work is public. The more people can read it, and above all read its limits, the more it is worth: a town technician preparing the civil protection plan, a researcher who knows which landslides can be counted on, a journalist telling the story of a mudflow with the right numbers, a citizen who looks at the map of their town and understands what it says and what it does not.

The code is open, the data is open, the limits are written down. The rest is built by those who use them.

---

**To learn more:** the [ispra-idrogeo website](https://agentengineering.it/ispra-idrogeo/), the [code on GitHub](https://github.com/agent-engineering-studio/ispra-idrogeo), the page on [reuse in public administration](https://agentengineering.it/ispra-idrogeo/riuso/) (in Italian) and the [test notebook](https://github.com/agent-engineering-studio/ispra-idrogeo/tree/main/examples).

**Join in:** found a trap in the data, or built something with ispra-idrogeo? Tell us in the [GitHub discussions](https://github.com/orgs/agent-engineering-studio/discussions).

*Data © ISPRA — IdroGEO: IFFI inventory and events CC BY-SA 4.0, 2024 landslide hazard map and risk indicators CC BY 4.0. This article and the library are not affiliated with ISPRA.*
