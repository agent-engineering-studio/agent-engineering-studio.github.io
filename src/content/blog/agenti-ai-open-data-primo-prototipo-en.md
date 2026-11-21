---
title: "AI agents and Open Data: building your first prototype"
description: "A hands-on tutorial to build an AI agent that queries Italian public datasets. Zero infrastructure costs, fully open source."
pubDate: 2026-05-16
author: "Giuseppe Zileni"
tags: ["tutorial", "open-data", "ai-agents", "python"]
draft: true
lang: "en"
---

When I started working on Agent Engineering Studio, one of the first questions was: **how do you build a useful AI agent without an enterprise budget?**

The answer, as often happens in open source, was in public data. Italy has a huge wealth of open data — from the [dati.gov.it](https://www.dati.gov.it) portal to ISTAT datasets, through mobility and environmental data. It's all there, free, often ignored.

This post shows how to build a minimal agent that:
1. Queries a public dataset via a REST API
2. Answers questions in natural language
3. Runs on your laptop with no cloud costs

## The stack

- **Python 3.12** — runtime
- **LangChain** — agent orchestration
- **Ollama + Llama 3** — local LLM, zero inference costs
- **requests** — for the open data APIs
- **CKAN API** — the format used by dati.gov.it and many European portals

## The dataset: ISTAT road accidents

We'll use ISTAT data on road accidents, available on dati.gov.it as CSV and through the CKAN API. It's a concrete use case: we can ask the agent how many accidents happened in a region in a given year, which time slots are riskiest, and so on.

## Agent structure

```python
from langchain.agents import initialize_agent, Tool
from langchain_community.llms import Ollama
import requests

CKAN_BASE = "https://www.dati.gov.it/opendata/api/3/action"

def search_datasets(query: str) -> str:
    """Search datasets on the dati.gov.it portal"""
    r = requests.get(f"{CKAN_BASE}/package_search", params={"q": query, "rows": 3})
    results = r.json().get("result", {}).get("results", [])
    if not results:
        return "No datasets found."
    return "\n".join(f"- {d['title']}: {d['notes'][:100]}" for d in results)

tools = [
    Tool(
        name="SearchDatasets",
        func=search_datasets,
        description="Search Italian public datasets. Input: a search term in Italian."
    )
]

llm = Ollama(model="llama3")
agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)

answer = agent.run("Find datasets on road accidents in Italy")
print(answer)
```

## Run it

```bash
# Install dependencies
pip install langchain langchain-community requests ollama

# Start Llama 3 locally
ollama pull llama3
ollama serve

# Run the agent
python agent_opendata.py
```

## What happens under the hood

The agent uses the **ReAct** pattern (Reasoning + Acting): for each question, the model decides which tool to call, observes the result, and reasons about the next step. No fine-tuning needed: the model uses tools the way a programmer would at the terminal.

## Next steps

In upcoming posts we'll explore how to:
- Add a tool to download and analyse the CSVs directly
- Connect more open data portals (regions, municipalities, ISPRA)
- Deploy the agent on a cheap server with FastAPI

---

**The full code** is on [github.com/agent-engineering-studio](https://github.com/agent-engineering-studio). If you find this material useful, consider [supporting the project](/en/support) — every contribution funds the infrastructure and the next tutorials.
