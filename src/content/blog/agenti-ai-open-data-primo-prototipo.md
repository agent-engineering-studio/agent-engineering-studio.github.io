---
title: "Agenti AI e Open Data: come costruire il primo prototipo"
description: "Un tutorial pratico per creare un agente AI che interroga dataset pubblici italiani. Zero costi di infrastruttura, tutto open source."
pubDate: 2026-05-16
author: "Giuseppe Zileni"
tags: ["tutorial", "open-data", "agenti-ai", "python"]
draft: false
---

Quando ho iniziato a lavorare su Agent Engineering Studio, una delle prime domande era: **come si costruisce un agente AI utile senza un budget enterprise?**

La risposta, come spesso accade nell'open source, stava nei dati pubblici. L'Italia ha un patrimonio enorme di open data — dal portale [dati.gov.it](https://www.dati.gov.it) ai dataset ISTAT, passando per i dati di mobilità e quelli ambientali. Sono tutti lì, liberi, spesso ignorati.

Questo post mostra come costruire un agente minimale che:
1. Interroga un dataset pubblico via API REST
2. Risponde a domande in linguaggio naturale
3. Può girare sul tuo laptop senza costi cloud

## Lo stack

- **Python 3.12** — runtime
- **LangChain** — orchestrazione dell'agente
- **Ollama + Llama 3** — LLM locale, zero costi di inference
- **requests** — per le API open data
- **CKAN API** — il formato usato da dati.gov.it e molti portali europei

## Il dataset: incidenti stradali ISTAT

Useremo i dati ISTAT sugli incidenti stradali, disponibili su dati.gov.it in formato CSV e via API CKAN. È un caso d'uso concreto: possiamo chiedere all'agente quanti incidenti ci sono stati in una regione in un anno, quali fasce orarie sono più rischiose, ecc.

## Struttura dell'agente

```python
from langchain.agents import initialize_agent, Tool
from langchain_community.llms import Ollama
import requests

CKAN_BASE = "https://www.dati.gov.it/opendata/api/3/action"

def cerca_dataset(query: str) -> str:
    """Cerca dataset sul portale dati.gov.it"""
    r = requests.get(f"{CKAN_BASE}/package_search", params={"q": query, "rows": 3})
    results = r.json().get("result", {}).get("results", [])
    if not results:
        return "Nessun dataset trovato."
    return "\n".join(f"- {d['title']}: {d['notes'][:100]}" for d in results)

tools = [
    Tool(
        name="CercaDataset",
        func=cerca_dataset,
        description="Cerca dataset pubblici italiani. Input: termine di ricerca in italiano."
    )
]

llm = Ollama(model="llama3")
agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)

risposta = agent.run("Trova dataset sugli incidenti stradali in Italia")
print(risposta)
```

## Eseguilo

```bash
# Installa dipendenze
pip install langchain langchain-community requests ollama

# Avvia Llama 3 in locale
ollama pull llama3
ollama serve

# Esegui l'agente
python agent_opendata.py
```

## Cosa succede sotto il cofano

L'agente usa il pattern **ReAct** (Reasoning + Acting): per ogni domanda, il modello decide quale tool chiamare, osserva il risultato, e ragiona sul passo successivo. Non serve fine-tuning: il modello usa gli strumenti come farebbe un programmatore al terminale.

## Prossimi passi

Nei prossimi post esploreremo come:
- Aggiungere un tool per scaricare e analizzare i CSV direttamente
- Collegare più portali open data (regioni, comuni, ISPRA)
- Deployare l'agente su un server economico con FastAPI

---

**Il codice completo** è su [github.com/agent-engineering-studio](https://github.com/agent-engineering-studio). Se trovi utile questo materiale, considera di [supportare il progetto](/support) — ogni contributo finanzia l'infrastruttura e i prossimi tutorial.
