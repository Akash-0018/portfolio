"""
Seed script — run once after DB is created to populate projects.
Usage: python -m app.seed
"""
from app.database import create_tables, SessionLocal
from app.models.project import Project


PROJECTS = [
    {
        "title": "RAG-Powered Document Intelligence",
        "description": "An enterprise-grade Retrieval-Augmented Generation system that lets businesses query their internal documents using natural language.",
        "long_description": "Built with LangChain, ChromaDB, and FastAPI. Supports multi-format ingestion (PDF, DOCX, XLSX), semantic chunking, and hybrid BM25+vector search. Deployed on AWS with auto-scaling.",
        "tech_stack": ["Python", "LangChain", "ChromaDB", "FastAPI", "OpenAI API", "AWS", "Docker"],
        "github_url": "https://github.com/akashpg",
        "live_url": None,
        "category": "RAG",
        "featured": True,
        "order_index": 1,
    },
    {
        "title": "Agentic AI Workflow Orchestrator",
        "description": "A multi-agent orchestration framework where autonomous AI agents collaborate to complete complex business tasks end-to-end.",
        "long_description": "Uses LangGraph for stateful agent workflows, with specialized agents for research, code generation, validation, and reporting. Integrates MCP (Model Context Protocol) for tool use.",
        "tech_stack": ["Python", "LangGraph", "OpenAI API", "MCP", "FastAPI", "PostgreSQL", "Redis"],
        "github_url": "https://github.com/akashpg",
        "live_url": None,
        "category": "Agentic AI",
        "featured": True,
        "order_index": 2,
    },
    {
        "title": "Conversational AI Platform",
        "description": "A production-ready conversational AI platform with context-aware responses, multi-model support, and real-time streaming.",
        "long_description": "Supports OpenAI GPT-4, Google Gemini, and local Ollama models. Features conversation history, user sessions, and a React-based chat UI with streaming responses.",
        "tech_stack": ["Python", "FastAPI", "OpenAI API", "Google Gemini", "Ollama", "React.js", "WebSockets"],
        "github_url": "https://github.com/akashpg",
        "live_url": None,
        "category": "LLM",
        "featured": True,
        "order_index": 3,
    },
    {
        "title": "AI-Powered Code Review Assistant",
        "description": "An automated code review tool that uses LLMs to analyze pull requests, detect bugs, suggest improvements, and enforce best practices.",
        "long_description": "Integrates with GitHub webhooks. Uses a chain-of-thought prompting strategy to provide structured, actionable feedback with severity ratings.",
        "tech_stack": ["Python", "FastAPI", "OpenAI API", "GitHub API", "Docker", "PostgreSQL"],
        "github_url": "https://github.com/akashpg",
        "live_url": None,
        "category": "AI Automation",
        "featured": False,
        "order_index": 4,
    },
    {
        "title": "Vector Database Explorer",
        "description": "A visual exploration tool for semantic search and embedding spaces built on top of ChromaDB and PostgreSQL pgvector.",
        "long_description": "Allows users to upload documents, view embedding clusters in 2D/3D using UMAP dimensionality reduction, and perform semantic queries with similarity scores.",
        "tech_stack": ["Python", "ChromaDB", "pgvector", "FastAPI", "React.js", "UMAP", "Sentence Transformers"],
        "github_url": "https://github.com/akashpg",
        "live_url": None,
        "category": "RAG",
        "featured": False,
        "order_index": 5,
    },
    {
        "title": "Intelligent Automation Pipeline",
        "description": "An end-to-end AI automation system that extracts, transforms, and routes data from unstructured sources using LLM-powered classification.",
        "long_description": "Processes emails, PDFs, and web content. LLMs extract structured data, classify intent, and trigger downstream workflows via webhooks and APIs.",
        "tech_stack": ["Python", "LangChain", "FastAPI", "Celery", "Redis", "Django", "PostgreSQL"],
        "github_url": "https://github.com/akashpg",
        "live_url": None,
        "category": "AI Automation",
        "featured": False,
        "order_index": 6,
    },
]


def seed():
    create_tables()
    session = SessionLocal()
    try:
        for p in PROJECTS:
            project = Project(**p)
            session.add(project)
        session.commit()
        print(f"[OK] Seeded {len(PROJECTS)} projects successfully.")
    finally:
        session.close()


if __name__ == "__main__":
    seed()
