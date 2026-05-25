---
title: "Cantiere Neemia: an operational tool for ethical discernment of AI projects"
description: "Lab notes on a skill built to pair the technical review of AI projects with a structured ethical verification, inspired by Pope Leo XIV's encyclical Magnifica Humanitas. Three applied cases: where the skill confirms, corrects, and where it recommends redesign."
pubDate: 2026-05-25
author: "Giuseppe Zileni"
tags: ["lab-notes", "ai-ethics", "magnifica-humanitas", "cantiere-neemia", "claude-skills", "english"]
draft: false
lang: "en"
---

![Pope Leo XIV looks at the translucent face of an AI while a builder at the time of Nehemiah shows him the construction plans: two icons of building — Babel and Nehemiah — applied to the design of AI systems.](/covers/cantiere-neemia.png)

On 15 May, the Vatican published the first encyclical in history entirely dedicated to artificial intelligence: **[*Magnifica Humanitas*](https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html)** by Pope Leo XIV. Forty paragraphs of chapter three — §§90 to 130 — speak directly to those who build AI systems: about accountability, the concentration of computational power, algorithmic transparency, data residency, and the responsibility of designers (§111: *«every design choice expresses a vision of humanity»*).

Read from an engineer's perspective, the text does something the AI ethics literature rarely does: it distills 135 years of structured social thought into **six compact principles**, applies them to concrete cases of contemporary AI, and explicitly addresses *also* «all men and women of good will» (§§16, 47, 91) — believers or not. I wanted to verify whether that material could be translated into **an operational working tool** for AI project reviews. The result is called **Cantiere Neemia**.

## Two architectural icons

The encyclical proposes two construction metaphors that shape the entire discernment (§§7-10):

- **Babel** — building to dominate, to "make a name", imposing uniformity, sacrificing dignity to efficiency, deciding from the top without listening.
- **Nehemiah** — rebuilding the walls of Jerusalem by observing the ruins in silence, summoning the families, distributing the work («each their stretch of wall»), rebuilding the bonds before the stones.

These are two patterns of any technology project. What distinguishes them is not the tech stack used, but the **intent**, the **working style**, and the **values inscribed in the design**. Cantiere Neemia places every AI project along this axis and proposes concrete moves to shift it where it should be.

## Structure of the skill

Six workflow phases, taken from Nehemiah's method (Nehemiah 1-6); seven voices on a virtual team that explicitly signs its contributions (Master Builder, Guardian of Dignity, Worker of the Common Good, Wall Keeper, Prophet of the Common House, Listener to the Last Ones, Babel Watchman); at the end, seven final tests rated `PASS / WARN / FAIL`.

The most demanding test is the **John Paul II Test** (§129, in continuity with *Redemptor Hominis*, 1979): *«does the system make human life, in every aspect, more human and more worthy of the human person?»* It is a question that inverts the usual framing: it does not ask whether the system is "ethical" or "compliant", it asks whether it makes life more human.

## Three applied cases

The skill has been validated on four realistic scenarios. I report three of them here, because together they cover the spectrum of patterns the skill is designed to identify. The scenarios are fictional but plausible; the test outcomes are those actually produced by the workflow.

### Case 1 — HR CV pre-screening

*An Italian software company designs a system that reads incoming CVs, compares them with the job description, assigns a 0-100 score, and shows HR only the top 20%. Declared mission: become EU leader in pre-screening within 3 years.*

**Tally: 0 PASS · 2 WARN · 5 FAIL → redesign.**

Candidates (the population most impacted by the output) were not even part of the initial project framing. The HR domain has decades of documented bias and no fairness audit is planned. The "market leader in 3 years" aspiration is the §7 Babel pattern. The skill proposes an 8-point redesign, converting the system from autonomous filter to decision-support for human recruiters (EU AI Act compliant, Title III). Dominant pattern: **structural Babel**.

### Case 2 — Legal review assistant for small law firms

*A system for 2-15 lawyer firms that extracts clauses from contracts, compares them with a library of known risk patterns, and prepares a report. The lawyer validates, signs, decides.*

**Tally: 3 PASS · 3 WARN · 1 strong WARN → proceed with hard corrections pre go-live.**

The architectural principle is sound: lawyer central, clear accountability, chain of professional judgment respected. But three structural debts emerge: Circle 3 (the firm's clients, bar associations, junior lawyers) had no voice; client contracts — covered by professional secrecy — transit via API to non-EU providers; the frontier LLM in use is oversized for the task. The skill translates these points into **hard prerequisites for go-live**, not post-launch backlog. Pattern: **honest construction site half-way through**.

### Case 3 — Tax assistant for micro-enterprises

*A startup developing an assistant for accountants and labor consultants serving Italian micro-enterprises. Declared purpose: serve rural and southern micro-enterprises penalized by less up-to-date professional advice.*

**Tally: 3 PASS · 2 WARN · 2 strong WARN → correct purpose, incoherent execution.**

This is the most subtle and instructive case. The purpose statement is ethically oriented from the start — serving the "most fragile" of §78. But the technical execution overlooks the very fragiles it claims to serve: no tests on clients with low digital literacy, no simplified-language version, nominally accessible pricing not field-verified. Furthermore, Italian tax data covered by professional secrecy are routed via API to non-EU providers: the §71 digital subsidiarity is structurally violated. Pattern: **ethical purpose vs incoherent execution**.

## Benefits in daily use

The skill's utility emerges at three moments in a project's lifecycle.

**Pre-design.** The four Phase 1 questions — *where are we going, toward what telos, which community, whom can we not lose* — can be answered in 30 minutes and prevent weeks of work on a structurally unbalanced project. In Case 1, if candidates aren't even mentioned in the first scoping conversation, the system is already being born on a Babel trajectory.

**Pre go-live.** The seven tests work as a substantive checklist, not a formalistic one. Unlike standard compliance checklists, each test has three specific operational criteria and proposes a concrete corrective action when the outcome is not PASS. For a team approaching release, knowing that two structural debts must be paid before production is very different from receiving generic recommendations.

**For product strategy decisions.** The Babel/Jerusalem framework — with its nine documented anti-patterns and nine virtuous patterns — provides a shared vocabulary that works well even in product meetings. Saying «this is anti-pattern B7, normalized technocracy» is more productive than saying «the system should be more transparent».

**Not a blessing machine.** Case 1 demonstrates this explicitly. Case 3 demonstrates it more subtly: an ethically correct purpose is not sufficient to pass the tests if the implementation is not coherent. It is an honest threshold, in line with the encyclical's invitation in §14: *«let us not bless naive enthusiasm, nor feed sterile fears»*.

## References

Repository: [github.com/agent-engineering-studio/cantiere-neemia](https://github.com/agent-engineering-studio/cantiere-neemia). CC BY-SA 4.0 — can be adapted and used commercially as well. The repository contains the complete skill, the four worked examples in synthetic form, and the Charter of Discernment template — the signable final document ready to be brought into ethics reviews or governance boards.

Pull requests welcome, especially for: corrections to the Latin version of the README, translations into other languages, and new field-tested worked examples.

---

*«To be builders of communion, not architects of Babel.»* — *Magnifica Humanitas* §16
