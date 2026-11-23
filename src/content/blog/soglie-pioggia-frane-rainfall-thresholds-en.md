---
title: "Is this rain enough to trigger landslides? The rainfall thresholds of Italian landslides"
description: "Third episode of the Open Data series. What a rainfall threshold says, how it comes from the landslides of the e-ITALICA catalogue, where it can mislead, and what you can build with the open rainfall-thresholds library, joined with radar rain and the landslides of ISPRA."
pubDate: 2026-11-24
author: "Giuseppe Zileni"
tags: ["open-data", "rainfall-thresholds", "landslides", "rainfall", "e-italica", "python"]
series: "opendata"
project:
  name: "rainfall-thresholds"
  repo: "https://github.com/agent-engineering-studio/rainfall-thresholds"
  docs: "https://agentengineering.it/rainfall-thresholds/"
draft: false
lang: "en"
---

Between the afternoon of 9 October 2026 and the night of the 10th, at Melito di Porto Salvo in Calabria, the radar of the Civil Protection measured 166 millimetres of rain in 35 hours. Landslides came down around Reggio.

In the first episode of this series we saw how that rain is measured. In the second, where Italy's landslides are. One question joins the two: **how much rain does it take to make a slope give way?**

There is no exact answer. There is a way, used for more than forty years, to say whether a rain looks like the rains that triggered landslides before. It is called a **rainfall threshold**, and it is the subject of this last episode.

## The data in brief

A threshold comes from a catalogue: a list of landslides, each with the rain that triggered it. For Italy the catalogue is **e-ITALICA**, kept by researchers of the CNR. It lists 6,312 rainfall-induced landslides between 1996 and 2021. For 5,974 of them we know two numbers measured at the nearest rain gauge: **how long it rained**, in hours, and **how much**, in millimetres.

The catalogue is on Zenodo, an open archive for research data, under **CC BY 4.0**: free to use, crediting the authors. No account and no key.

The **rainfall-thresholds** library brings that catalogue into a Python program, with no dependencies at all, not even NumPy. It derives the thresholds for Italy and refits them from scratch on every test, so no number is copied by hand.

## What it really measures

In 1980 the geographer Nels Caine noticed something simple. Put the **duration** of the rain and its **mean intensity**, millimetres per hour, on a chart: the rains that triggered landslides sit almost all above a line. A short rain must be violent; a long rain can be gentler. That line is the threshold.

![A log-log chart: thousands of grey dots, each an Italian landslide, above a blue line, the T5 threshold](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/id-plane-light.png)

*Every grey dot is a landslide of the e-ITALICA catalogue. The blue line is the threshold: only 5% of the landslides sit below it. Data: e-ITALICA v4, CC BY 4.0.*

The line is placed so that only **5% of past landslides** sit below it. Hence its name, **T5**. It is low on purpose: it prefers to catch one landslide too many rather than one too few.

In millimetres, for the whole of Italy, T5 asks for **28.3 millimetres in 24 hours** and 45.5 in 72. The north asks a little more, 30 in 24 hours; the south a little less, 27.1. For short bursts the regions are alike; over several days, the north needs more water before its slopes give way.

To say how far a rain is above the line, the library uses **decades**: +0.3 means twice the intensity of the threshold, +1 ten times. At Melito, the rain of those 35 hours stood at **+0.73**: more than five times the threshold of the south.

![The rain accumulated at Melito climbs to 166 millimetres in 35 hours, while the threshold of the south asks for 31](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/melito-storm-en.png)

*Melito di Porto Salvo, 9-10 October 2026: in red the rain so far, in blue the rain the threshold asks as the rain goes on. Data: radar of the Dipartimento della Protezione Civile, CC BY-SA 4.0.*

## Where it can mislead

Using thresholds in a real system, [Limen](https://github.com/agent-engineering-studio/limen), taught five lessons.

**A threshold holds for the rain it was fitted on.** The e-ITALICA thresholds come from rain gauges. Applied to other rain, they mean something else. On the rain of a weather model, which at the catalogue's landslides reads about a third of the gauges, the national threshold was passed at only 40.7% of the landslides. And Limen's engine, which uses it, caught **zero of 286 landslides** in the six regions held out for checking. Radar is not a gauge either: in 2026 it read on average 20% more than the «Merging», the rain corrected with the gauges, and not the same everywhere.

**The last event is not the one that matters.** A program cuts the rain into events: six dry hours, and the event is over. If a storm is followed by six dry hours and then two and a half millimetres of drizzle, the last event is the drizzle. A program that looks only at that one forgets the storm. The first version of the library did so, and Limen with it. Now a function takes the strongest event.

![A 109-millimetre storm in 8 hours, six dry hours, then 2.5 millimetres of drizzle: the last event says -0.65 decades, the strongest +0.78](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/drizzle-trap-en.png)

*A case built from the real hours of the Melito storm. Data: radar of the Dipartimento della Protezione Civile, CC BY-SA 4.0.*

**A missing hour is not a dry hour.** When the radar cannot see, or an hour of data is lost, a careless program writes zero. That zero can split an event in two and hide a heavy rain. With three hours missing in the middle of the Melito storm, what is still measured is 59.6 millimetres in 8 hours: already above the threshold. The library says so, and adds that the total is a lower bound.

**A threshold says how many landslides it catches, not how many false alarms it costs.** By construction T5 leaves 5% of past landslides below it. But how often is it passed when nothing happens? The catalogue cannot tell: it holds only the rain of the landslides. That needs the rain of quiet days, and a measure made on it.

**Dated landslides are few, and not everywhere.** To check a threshold you need landslides with a day. e-ITALICA has 1,603 in Liguria and 1,131 in the Marche, but 17 in Molise and 55 in Basilicata. The ISPRA events archive, since 2018, has 1,608 with the point known within a kilometre, led by Emilia-Romagna, where the floods of 2023 weigh in. In Apulia, two.

![Two tile maps of the Italian regions: the e-ITALICA landslides with their rain, and the ISPRA landslides dated to the day since 2018](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/regions-map-en.png)

*One tile per region. Left, the e-ITALICA landslides; right, the ISPRA events dated to the day with the point within 1 km. Data: e-ITALICA v4, CC BY 4.0; ISPRA IdroGEO, CC BY-SA 4.0.*

## What you can build

The library installs in one line, and brings nothing else with it.

```bash
pip install rainfall-thresholds
```

With an hourly rain series, from a gauge, a radar or a model, four lines are enough:

```python
from rainfall_thresholds import ITALICA_T5, macroregion_of, reconstruct_events, strongest_event

threshold = ITALICA_T5[macroregion_of("Calabria") or "italy"]  # the threshold of the south
events = reconstruct_events(series, no_rain_break_hours=6, min_event_mm=2.0)  # None = not measured
event = strongest_event(events, threshold)                    # the strongest event, not the last
print(threshold.exceedance(event.intensity_mm_h, event.duration_hours))  # decades above or below
```

On top of this, four uses.

**Joining the three libraries.** rainfall-thresholds does not download rain and does not look for landslides: its two sisters do, [dpc-radar](https://agentengineering.it/dpc-radar/) and [ispra-idrogeo](https://agentengineering.it/ispra-idrogeo/). None of the three depends on the others. Whoever uses them joins them: Limen, a notebook, a page. So each one grows on its own without holding the others back.

![Diagram: dpc-radar gives the hourly series, ispra-idrogeo the dated landslides, rainfall-thresholds answers with a number that is not an alert](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/three-libraries-en.png)

*How the three libraries of the series meet.*

A notebook of the project puts them together: it takes the landslides ISPRA dated since June 2026, reads 48 hours of radar at the point of each and compares them with the threshold. Of the 9 slides and flows, 8 have a rain event, and **7 of 8** sit above the threshold. It is an example, not a proof: nine landslides, almost all in the north.

**A page for public bodies.** The project includes a **calibration bench**, in Italian, built with the design kit of the Italian public administration. It opens on the landslides of the body's region, fits a threshold on the ones that matter, compares it with the national one and exports it. For Apulia, on 140 landslides, the local threshold asks 26.4 millimetres in 24 hours, the national one for the south 27.1. The cost in false alarms stays **"not measured"** until the body loads the rain of one of its gauges: never zero.

![The calibration bench open on Apulia: the chart of the threshold fitted on 140 landslides and the table of the rain it asks from 1 to 72 hours](https://raw.githubusercontent.com/agent-engineering-studio/rainfall-thresholds/main/docs/img/blog/banco-di-taratura-puglia.jpg)

*The calibration bench, open on the Comune di Gioia del Colle. Data: e-ITALICA v4, CC BY 4.0.*

**A page to understand.** The library's site has [a page to try](https://agentengineering.it/rainfall-thresholds/explainer/): pick a region, a duration and the rain that fell, and see where it stands against the threshold and the landslides of the past. It runs in the browser, with no server. Good for a school or a public meeting.

**An AI assistant that does not swap units.** The library includes an MCP server, a standard way to give tools to an assistant like Claude. The easiest mistake with thresholds is swapping the total for the intensity: writing "30.9 millimetres per hour" where the threshold asks for 30.9 millimetres in all. A check of the text finds numbers that are invented, badly rounded or in the wrong unit. It is tested on eight answers written on purpose: the four correct ones pass, and in the four wrong ones it finds exactly the mistakes put there.

## The limits, said plainly

**A threshold exceeded is not an alert.** It says the rain looks like the rain that triggered landslides before. The official alert is the criticality bulletin of the Civil Protection Department and of the regional civil protection.

**It does not say where a landslide will fall.** Slope, soil, vegetation, the rain of the weeks before: they matter as much as today's storm.

**The Italian thresholds are fitted on rain gauges.** On radar and models they are not validated. Measuring that is the work left, and it is done in Limen, on the ISPRA landslides and the radar history, region by region.

**The cost in false alarms is not measured yet** on real data. The tools to measure it are there and give the same numbers as Limen's own, tested on 2,000 cases. The number, not yet.

## Why it is worth it

This series started from a simple question: what can you do with public data on landslides and floods? The Civil Protection radar says how much it rained. The ISPRA inventory says where the mountain has already moved. The e-ITALICA catalogue says how much rain, in the past, was enough.

They are three public works, made by different people over decades. Put together, with their limits written next to them, they let a town, a researcher or a journalist ask a precise question and get an honest number. Not a forecast, not an alert: a number, with its unit and its source.

---

**Read more:** the [rainfall-thresholds site](https://agentengineering.it/rainfall-thresholds/), the [code on GitHub](https://github.com/agent-engineering-studio/rainfall-thresholds), the [four notebooks](https://github.com/agent-engineering-studio/rainfall-thresholds/tree/main/notebooks), the [calibration bench](https://github.com/agent-engineering-studio/rainfall-thresholds/tree/main/app) and the page on [reuse in the public administration](https://agentengineering.it/rainfall-thresholds/riuso/) (in Italian).

**Join in:** do you have a local threshold, dated landslides of your area, or did you find a trap in the data? Tell us in the [GitHub discussions](https://github.com/orgs/agent-engineering-studio/discussions).

*Data: e-ITALICA v4 (Brunetti M.T. et al. 2024, doi:10.5281/zenodo.14204473), CC BY 4.0. Radar rain © Dipartimento della Protezione Civile, CC BY-SA 4.0. Landslide events © ISPRA — IdroGEO, CC BY-SA 4.0. This article and the library are not affiliated with the CNR, ISPRA or the Department.*
