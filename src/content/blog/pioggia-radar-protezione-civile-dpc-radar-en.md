---
title: "Italy's rain, every five minutes: the Civil Protection radar data"
description: "First episode of the Open Data series. What the Italian Civil Protection weather radars measure, where they can mislead, and what you can build with a few lines of Python, thanks to the open dpc-radar library."
pubDate: 2026-11-18
author: "Giuseppe Zileni"
tags: ["open-data", "dpc-radar", "civil-protection", "weather", "python"]
series: "opendata"
project:
  name: "dpc-radar"
  repo: "https://github.com/agent-engineering-studio/dpc-radar"
  docs: "https://agentengineering.it/dpc-radar/"
draft: false
lang: "en"
---

On 10 October 2026, the forecast for Melito di Porto Salvo, in Calabria, said 20 millimetres of rain. 192 fell.

A forecast tells you what will probably happen over a large area. A measurement tells you what is happening, here, now. In a country of short, steep valleys like Italy, the difference matters: a thunderstorm can dump a month of rain on one valley in a few hours and leave the next one dry.

The measurement exists, it is public and it is free. The Italian Civil Protection Department (DPC) publishes it every five minutes, for the whole of Italy. It is the dataset of this first episode.

## The data in brief

The Civil Protection Department runs a network of weather radars, 24 in the national mosaic, and collects data from thousands of rain gauges on the ground. With these instruments it publishes rain maps for all of Italy:

- **every 5 minutes**, the rain seen by radar alone: how hard it is raining now and how much fell in the last hour, on a one-kilometre grid;
- **every 30 minutes**, the rain of the last 3, 6, 12 and 24 hours, corrected with the rain gauges. This correction is called **"Merging"**.

You need no account and no key. The licence is CC BY-SA 4.0: anyone using the data must credit the source, "Dipartimento della Protezione Civile", and anything published on top of it must be shared under the same licence.

There is one limit to know right away: the Department keeps the maps for **about five months**. Whatever you don't save in time is gone.

![The 24-hour rain of 10 October 2026 over all of Italy, with a zoom on the Reggio Calabria area](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/rain-24h.png)

*The rain of 10 October 2026, from the "Merging" CUM24 product. Data: Dipartimento della Protezione Civile, CC BY-SA 4.0.*

## What it really measures

A weather radar is a spinning antenna. It sends out a microwave pulse and listens for the echo. If the pulse hits raindrops, a small part of it bounces back. The time the echo takes to return tells you how far away the rain is; the strength of the echo tells you how much water is up there.

Here is the first weak point. The echo depends heavily on the size of the drops: one 4-millimetre drop sends back the same echo as about four thousand 1-millimetre drops. The radar cannot count the drops, so it uses a formula based on average rain. The result is an **estimate**, not a measurement.

There is a second weak point. The radar beam leaves almost horizontally, but the Earth is curved and drops away beneath it. At 100 kilometres from the radar the beam is already a kilometre and a half up; at 200 kilometres it is at four. The radar looks high, and what it sees up there is not always what reaches the ground. Mountains cast a shadow on it, melting snow looks like a downpour, and sometimes rain forms in the last kilometre, below the beam.

![The radar beam rises with distance: a mountain hides half of it and low rain falls below the beam, where only the rain gauge catches it](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/how-radar-sees.png)

*Why the radar does not always see what falls. Image from the dpc-radar repository.*

The rain gauge does the opposite. It is a funnel on a pole that collects the real water, the water that reached the ground. But it only measures the patch of sky above it, the size of a plate, and the next gauge may be ten kilometres away.

"Merging" combines the two: the radar says **where** it rained, the gauges say **how much**. It is the closest thing Italy has to "how much really fell, everywhere".

Melito shows it well. The gauges measured 192 millimetres; the radar alone had seen 115, that is 60%.

![Two maps of the Reggio Calabria area on 10 October 2026: the rain seen by radar alone and the Merging rain](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/radar-vs-merging.png)

*Left, radar alone; right, "Merging". Data: Dipartimento della Protezione Civile, CC BY-SA 4.0.*

## Where it can mislead

Using this data in a program taught a few lessons. The four most important ones:

**"No data" does not mean "zero".** Where the radar can't see, the map is empty. A careless program reads that gap as zero, that is as "dry". On 10 October a cloudburst hit Lipari, and the radar missed it: the nearest beams pass about 3,500 metres above the island. Missing data is information, and should be treated as such.

**A single frame can be wrong.** In one of the cases studied, a map contained 7,348 millimetres of fake rain: an absurd alarm produced by an error. Before trusting a map, it pays to compare it with the previous one. Rain moves; a defect, often, doesn't.

**Even the "true" instrument can be wrong.** Between 6 and 8 October 2026 a stuck rain gauge recorded 126 millimetres every three hours, for 33 hours, on a dry night. The radar, there, read zero. The best data comes from comparing different sources, not from blind trust in one.

**Radar alone is not the truth.** Between June and November 2026, radar alone read on average 20% more rain than "Merging". Not in the same direction everywhere: in some areas it reads too much, in others too little. For totals, use "Merging"; to know whether it is raining now and where the storm is heading, use the radar.

## What you can build

Until now, using this data took about a week of work: figuring out the undocumented calls of the web viewer, handling two different coordinate systems, interpreting the "no data" values. **[dpc-radar](https://agentengineering.it/dpc-radar/)** is an open Python library, Apache-2.0 licensed, that does this work for you. Its site has the guide, the notebooks and the full reference.

```bash
pip install dpc-radar
```

Here is the rain of the last 24 hours over Gioia del Colle:

```python
import asyncio
from dpc_radar import RadarClient

async def main() -> None:
    async with RadarClient() as radar:
        rain = await radar.latest("CUM24")    # the last 24 hours, all of Italy
    print(rain.sample([(16.92, 40.80)]))      # millimetres, or None if nobody measured

asyncio.run(main())
```

If you don't want to install anything, the [first notebook](https://colab.research.google.com/github/agent-engineering-studio/dpc-radar/blob/main/notebooks/01_first_rain_map.ipynb) opens in the browser and draws today's rain map in five minutes.

On top of the basic data, the library answers the questions that come right after:

- **can I trust this map?** It checks a frame against the previous one and discards suspicious pixels, saying why;
- **does the radar see this place?** It gives a reliability score for every point in Italy;
- **how rare is this rain, here?** A hundred millimetres in a day in Genoa happens almost every year; in Bari, once in a generation;
- **what will fall in the next two hours?** It moves the rain along its motion and gives the probability that it exceeds a threshold;
- **what does the official alert say?** It reads the Department's criticality bulletin, zone by zone.

And then there are three uses that go beyond the script.

**Your own archive.** Since the Department keeps maps for about five months, the library can save them every night, automatically. A year from now you will have this winter's rain.

**A map for the town hall website.** The project includes a ready-made page, in Italian and English, built with the Italian Public Administration design kit. It opens on the town's coordinates and, point by point, shows the rain, how rare it is, the official alert and how far the radar can be trusted.

![The rain page opened on the Municipality of Gioia del Colle](https://raw.githubusercontent.com/agent-engineering-studio/dpc-radar/main/docs/images/demo-comune.png)

**An AI assistant that doesn't make up numbers.** dpc-radar includes an MCP server: a standard way to give an assistant like Claude tools to read data. Asked "how much rain fell in Messina in the last three hours?", the assistant answers with the number computed on the map of that moment, and says which map it comes from. And when the library writes the report of an event, every number in the text is checked against the data before being saved: a number that isn't there gets rejected.

## The limits, stated clearly

**It is not an alert system.** The official alert is the criticality bulletin of the Department and of the regional civil protection. What you compute from the radar sits next to the alert, never in its place.

**A map of measured rain is not a forecast.** It says what fell, not what will fall. Even the library's two-hour nowcast moves the rain that is already there, but cannot see storms that form later.

**Far from the radars and behind the mountains, the data is less certain.** The reliability score exists precisely so you know in advance.

**The history has a gap.** There is a fifteen-year radar archive, from 2010 to 2025, published by the Bruno Kessler Foundation. But it is radar only, without the rain gauge correction: useful for understanding trends, not for quoting totals.

## Why it's worth it

We all pay for the radars. The more people can read their data, the more that money returns: a farmer who knows how much rain fell on their field rather than at the station twenty kilometres away, a municipal technician checking the rain on at-risk roads, a teacher turning the storm on the evening news into a lesson on measurement and error, a journalist showing what actually fell next to the alert that had been issued.

The code is open, the data is open, the limits are written down. The rest is built by those who use them.

---

**Further reading:** the [dpc-radar site](https://agentengineering.it/dpc-radar/), the [code on GitHub](https://github.com/agent-engineering-studio/dpc-radar), the [five notebooks](https://github.com/agent-engineering-studio/dpc-radar/tree/main/notebooks) and the page on [reuse in the Public Administration](https://github.com/agent-engineering-studio/dpc-radar/blob/main/docs/riuso.md) (in Italian).

**Get involved:** found a trap in the data, or built something with dpc-radar? Tell us in the [GitHub discussions](https://github.com/orgs/agent-engineering-studio/discussions).

*Radar data © Dipartimento della Protezione Civile, CC BY-SA 4.0. This article and the library are not affiliated with the Department.*
