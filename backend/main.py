"""
JUDICIAL AI BACKEND – FULL WORKING VERSION
========================================
• LLaMA 3.1 via Ollama (Local)
• RAG with FAISS
• Multi-Agent Reasoning
• Web Research (Gemini + DuckDuckGo)
• Compatible with existing agents.py
"""

import os
import io
import sys
import re
import PyPDF2
from dotenv import load_dotenv

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.messages import HumanMessage

# --------------------------------------------------
# BASIC SETUP
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
load_dotenv()

from agents import MultiAgentOrchestrator   # IMPORTANT: your existing agents.py

# --------------------------------------------------
# FASTAPI
# --------------------------------------------------
app = FastAPI(
    title="Judicial AI Backend",
    version="2.2.0",
    description="AI-powered legal judgment analysis platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # REQUIRED for judges & ngrok
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# OLLAMA (LOCAL LLM)
# --------------------------------------------------
llm = None
try:
    llm = ChatOllama(
        model="llama3.1",
        temperature=0.3,
        base_url="http://localhost:11434"
    )
    llm.invoke([HumanMessage(content="ping")])
    print("✅ Ollama LLaMA 3.1 connected")
except Exception as e:
    print("❌ Ollama not running:", e)

# --------------------------------------------------
# GEMINI (CLOUD LLM)
# --------------------------------------------------
gemini_llm = None
if os.getenv("GOOGLE_API_KEY"):
    try:
        gemini_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.3,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        print("✅ Gemini connected")
    except Exception as e:
        print("⚠️ Gemini error:", e)
else:
    print("⚠️ GOOGLE_API_KEY missing – web search disabled")

# --------------------------------------------------
# WEB SEARCH
# --------------------------------------------------
search_tool = DuckDuckGoSearchResults(max_results=5)

# --------------------------------------------------
# VECTOR DB (RAG)
# --------------------------------------------------
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
VECTOR_PATH = os.path.join(BASE_DIR, "../data/vector_store")

vector_db = None
if os.path.exists(VECTOR_PATH):
    try:
        vector_db = FAISS.load_local(
            VECTOR_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )
        print("✅ Vector DB loaded")
    except Exception as e:
        print("⚠️ Vector DB error:", e)

# --------------------------------------------------
# DATA MODELS
# --------------------------------------------------
class WebQuery(BaseModel):
    query: str

# --------------------------------------------------
# HELPERS
# --------------------------------------------------
def extract_text_from_pdf(data: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(data))
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
        return text[:10000]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid PDF file")

def extract_urls(raw: str) -> list:
    urls = re.findall(r'https?://[^\s,\]\'"]+', raw)
    cleaned = []
    for u in urls:
        u = re.sub(r'[,\]\)\}\'"]$', '', u)
        if u.startswith("http") and len(u) > 20:
            cleaned.append(u)
    return cleaned[:5]

# --------------------------------------------------
# 🔥 WEB SEARCH FUNCTION (FIXED FORMAT)
# --------------------------------------------------
def web_search(query: str):
    """
    MUST return:
    {
      "answer": str,
      "sources": [
         {"title": str, "url": str, "snippet": str}
      ]
    }
    """
    if not gemini_llm:
        return {
            "answer": "Web research unavailable (Gemini not configured)",
            "sources": []
        }

    raw_results = search_tool.run(query)
    urls = extract_urls(str(raw_results))

    if not urls:
        return {
            "answer": "No reliable web sources found",
            "sources": []
        }

    # ✅ FIX: sources are DICTIONARIES (not strings)
    sources = []
    for i, url in enumerate(urls):
        sources.append({
            "title": f"Legal Source {i+1}",
            "url": url,
            "snippet": "Relevant legal precedent from web research"
        })

    prompt = f"""
You are a legal research assistant.

Query:
{query}

Sources:
{chr(10).join([s['url'] for s in sources])}

Provide a concise legal analysis (2 paragraphs).
"""

    response = gemini_llm.invoke(prompt)

    return {
        "answer": response.content.strip(),
        "sources": sources
    }

# --------------------------------------------------
# MULTI-AGENT SYSTEM
# --------------------------------------------------
multi_agent = None
if llm:
    try:
        multi_agent = MultiAgentOrchestrator(
            llm=llm,
            web_search_function=web_search   # ✅ WORKING
        )
        print("✅ Multi-Agent initialized (with Web Search)")
    except Exception as e:
        print("❌ Multi-Agent failed:", e)

# --------------------------------------------------
# CORE ANALYSIS
# --------------------------------------------------
def run_analysis(text: str):
    context = ""
    if vector_db:
        docs = vector_db.similarity_search(text, k=3)
        context = "\n".join(d.page_content for d in docs)

    if not multi_agent:
        return {
            "summary": "LLM not active",
            "analysis": "",
            "laws": ""
        }

    return multi_agent.run(
        judgment_text=text,
        rag_context=context
    )

# --------------------------------------------------
# API ENDPOINTS
# --------------------------------------------------
@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    data = await file.read()
    text = extract_text_from_pdf(data)
    result = run_analysis(text)

    return {
        "filename": file.filename,
        "summary": result.get("summary"),
        "laws": result.get("laws"),
        "analysis": result.get("analysis"),
        "web_sources": result.get("web_sources", [])
    }

@app.post("/web-search")
def manual_web_search(query: WebQuery):
    return web_search(query.query)

@app.get("/health")
def health():
    return {
        "status": "online",
        "ollama": bool(llm),
        "vector_db": bool(vector_db),
        "multi_agent": bool(multi_agent),
        "web_search": bool(gemini_llm)
    }

# --------------------------------------------------
# STARTUP
# --------------------------------------------------
@app.on_event("startup")
async def startup():
    print("\n🚀 JUDICIAL AI BACKEND READY (FULLY WORKING)")
    print("   Open /docs for API testing")
    print("   Share ngrok link with judges\n")

# --------------------------------------------------
# RUN
# --------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
