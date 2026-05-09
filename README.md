# ⚖️ Judicia — AI-Powered Judicial Insight & Transparency

<div align="center">

**Understand judicial reasoning with transparent, AI-assisted analysis.**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![LLaMA](https://img.shields.io/badge/LLaMA_3.1-Ollama-blueviolet?logo=meta)](https://ollama.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📌 Overview

**Judicia** is an AI-powered legal analysis platform that processes court judgment PDFs through a **7-agent reasoning pipeline**, delivering transparent, citizen-friendly insights. Built for India's judicial ecosystem, it helps judges, lawyers, and citizens understand the legal framework behind court decisions.

> 🏆 **Selected for Hackathon Final Round**

### Key Highlights
- 🧠 **7 Specialized AI Agents** — not a single prompt, but a collaborative multi-agent pipeline
- 📚 **RAG with Real Legal Data** — 76K+ words of Indian laws & precedents in a FAISS vector store
- 🔒 **Privacy-First** — LLaMA 3.1 runs locally via Ollama; no judgment data leaves your machine
- ⚖️ **Justice Fairness Score** — rates judgments on 4 dimensions of fairness
- 💬 **Chat with Judgment** — ask plain-English questions about any uploaded document

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        JUDICIA PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐        ┌──────────────────────────────────┐  │
│  │   React UI   │◄──────►│       FastAPI Backend             │  │
│  │  (Vite +     │  REST  │                                   │  │
│  │   Tailwind)  │  API   │  ┌─────────────────────────────┐ │  │
│  └──────────────┘        │  │  7-Agent Orchestrator        │ │  │
│                          │  │                               │ │  │
│                          │  │  1. Law Identifier            │ │  │
│                          │  │  2. Web Researcher            │ │  │
│                          │  │  3. Precedent Analyzer        │ │  │
│                          │  │  4. Logic Auditor             │ │  │
│                          │  │  5. Summary Writer            │ │  │
│                          │  │  6. Justice Scorer            │ │  │
│                          │  │  7. Timeline Extractor        │ │  │
│                          │  └──────┬──────┬──────┬──────────┘ │  │
│                          │         │      │      │            │  │
│                          │    ┌────▼──┐ ┌─▼───┐ ┌▼─────────┐ │  │
│                          │    │Ollama │ │FAISS│ │Gemini +   │ │  │
│                          │    │LLaMA  │ │ RAG │ │DuckDuckGo │ │  │
│                          │    │3.1    │ │     │ │(optional) │ │  │
│                          │    └───────┘ └─────┘ └───────────┘ │  │
│                          └──────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   SQLite Database                         │  │
│  │   Judgments · Analyses · Scores · Timelines · History     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Features

### Core Analysis
| Feature | Description |
|---------|-------------|
| 📄 **PDF Analysis** | Upload any court judgment PDF for comprehensive AI analysis |
| ⚖️ **Law Identification** | Automatically extracts IPC sections, Acts, and constitutional provisions |
| 🔍 **Precedent Analysis** | Compares judgment against similar cases using RAG |
| 🧠 **Logic Audit** | Checks reasoning consistency, burden of proof, and logical gaps |
| ✍️ **Plain-Language Summary** | Translates legal jargon into citizen-friendly summaries |

### Advanced Features
| Feature | Description |
|---------|-------------|
| ⚖️ **Justice Fairness Score** | Rates judgments 0–100 across 4 dimensions with animated gauge |
| 📅 **Case Timeline** | Extracts chronological events (FIR → Trial → Verdict) |
| 💬 **Chat with Judgment** | Interactive Q&A about the uploaded document in plain English |
| 🌐 **Web Research** | Fetches recent precedents via DuckDuckGo + Gemini synthesis |
| 📂 **Analysis History** | All past analyses persisted and retrievable from database |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/LLM** | LLaMA 3.1 (via Ollama), Gemini 2.5 Flash |
| **RAG** | FAISS, HuggingFace Embeddings (all-MiniLM-L6-v2) |
| **Agents** | LangChain, Custom Multi-Agent Orchestrator |
| **Database** | SQLite + SQLAlchemy ORM |
| **Web Search** | DuckDuckGo Search API |

---

## ⚡ Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Ollama** ([Download](https://ollama.ai))
- **Google API Key** (optional, for web research)

### 1. Clone & Setup Backend

```bash
git clone https://github.com/Vaibhavsakure/Judicia-AI-powered-judicial-insight-transparency.git
cd Judicia-AI-powered-judicial-insight-transparency

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt
```

### 2. Setup Ollama

```bash
# Install and pull the model
ollama pull llama3.1

# Start Ollama server (keep running)
ollama serve
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here   # Optional: enables web research
```

### 4. Start Backend

```bash
cd backend
python main.py
# Server starts at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### 5. Start Frontend

```bash
cd judicial-ai-react
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## 📁 Project Structure

```
judicial-ai/
├── backend/
│   ├── main.py              # FastAPI application & API routes
│   ├── agents.py            # 7-agent multi-agent orchestrator
│   ├── models.py            # SQLAlchemy database models
│   ├── database.py          # Database configuration
│   ├── schemas.py           # Pydantic schemas
│   └── requirements.txt     # Python dependencies
├── judicial-ai-react/
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── index.jsx            # Entry point with ErrorBoundary
│   │   ├── index.css            # Global styles & design system
│   │   ├── components/
│   │   │   ├── AnalysisResults.jsx  # Tabbed results dashboard
│   │   │   ├── JusticeScore.jsx     # Animated fairness gauge
│   │   │   ├── CaseTimeline.jsx     # Chronological event timeline
│   │   │   ├── JudgmentChat.jsx     # Interactive document Q&A
│   │   │   ├── Sidebar.jsx          # Upload & navigation
│   │   │   ├── HistorySidebar.jsx   # Analysis history drawer
│   │   │   ├── Header.jsx           # Top navigation bar
│   │   │   ├── WelcomeScreen.jsx    # Landing page
│   │   │   ├── ProgressSteps.jsx    # Agent progress indicator
│   │   │   ├── Toast.jsx            # Notification system
│   │   │   └── ErrorBoundary.jsx    # Error fallback UI
│   │   └── services/
│   │       └── api.js           # API service layer (axios)
│   ├── tailwind.config.js   # Custom design system tokens
│   └── package.json
├── data/
│   ├── laws.txt             # 76K+ words of Indian legal statutes
│   ├── precedents.txt       # 57K+ words of case precedents
│   └── vector_store/        # FAISS index (pre-built)
├── .env                     # Environment configuration
├── requirements.txt         # Root-level Python dependencies
└── README.md
```

---

## 🤖 Multi-Agent Pipeline

Each PDF judgment passes through **7 sequential agents**, with each agent building on the previous agent's findings:

```
📄 PDF Upload
    │
    ▼
┌─── Agent 1: Law Identifier ───────────────────────┐
│    Extracts IPC sections, Acts, Constitutional     │
│    articles from the judgment text                  │
└──────────────────────────────┬─────────────────────┘
                               ▼
┌─── Agent 2: Web Researcher ───────────────────────┐
│    Searches DuckDuckGo for recent precedents       │
│    Synthesizes findings via Gemini                  │
└──────────────────────────────┬─────────────────────┘
                               ▼
┌─── Agent 3: Precedent Analyzer ───────────────────┐
│    Compares with RAG context + web findings        │
│    Identifies relevant case law                     │
└──────────────────────────────┬─────────────────────┘
                               ▼
┌─── Agent 4: Logic Auditor ────────────────────────┐
│    Checks reasoning consistency, burden of proof,  │
│    logical gaps, and contradictions                 │
└──────────────────────────────┬─────────────────────┘
                               ▼
┌─── Agent 5: Summary Writer ───────────────────────┐
│    Creates citizen-friendly plain-language summary  │
└──────────────────────────────┬─────────────────────┘
                               ▼
┌─── Agent 6: Justice Scorer ───────────────────────┐
│    Rates fairness: Law Consistency, Precedent      │
│    Alignment, Reasoning Quality, Evidence          │
└──────────────────────────────┬─────────────────────┘
                               ▼
┌─── Agent 7: Timeline Extractor ───────────────────┐
│    Builds chronological case timeline:              │
│    Incident → FIR → Investigation → Trial → Verdict│
└───────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze` | Upload PDF & run full 7-agent analysis |
| `POST` | `/chat` | Ask questions about an analyzed judgment |
| `POST` | `/web-search` | Manual web research query |
| `GET` | `/history` | List all past analyses |
| `GET` | `/history/{id}` | Get full analysis details by ID |
| `GET` | `/health` | System health check |

Full API documentation available at `http://localhost:8000/docs` when the backend is running.

---

## ⚠️ Deployment Note

This project uses **Ollama** for local LLM inference (LLaMA 3.1, ~4.7GB model).
- Backend **must** run on a local machine or VPS with sufficient RAM (8GB+ recommended)
- Serverless platforms (Vercel, Netlify) are **not supported** for the backend
- Frontend can be deployed anywhere (Vercel, Netlify, etc.)

---

## 👥 Team

Built with ❤️ for the hackathon by the Judicia team.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
