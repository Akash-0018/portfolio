// Shown when the API is unreachable so the page never renders empty. Kept in one
// place because both the featured grid and the full archive fall back to it.
const FALLBACK_PROJECTS = [
  { id: 1, title: 'Enterprise RAG Document Intelligence', description: 'Production hybrid retrieval system with multi-format chunking, pgvector indexing, and reranking.', tech_stack: ['Python', 'FastAPI', 'pgvector', 'LangChain'], category: 'RAG Infrastructure', featured: true, order_index: 1 },
  { id: 2, title: 'Autonomous Multi-Agent Orchestrator', description: 'Stateful agent runtime built with LangGraph and Model Context Protocol (MCP) for complex workflows.', tech_stack: ['LangGraph', 'Python', 'MCP', 'FastAPI'], category: 'Agentic AI', featured: true, order_index: 2 },
  { id: 3, title: 'Low-Latency Streaming AI Platform', description: 'High-concurrency chat and inference proxy supporting streaming responses and model routing.', tech_stack: ['FastAPI', 'Redis', 'OpenAI', 'React.js'], category: 'LLM Systems', featured: true, order_index: 3 },
  { id: 4, title: 'Automated Code Review Engine', description: 'Agentic code analysis system providing multi-stage security, performance, and architecture audits.', tech_stack: ['Python', 'FastAPI', 'GitHub API', 'Docker'], category: 'AI Operations', featured: false, order_index: 4 },
  { id: 5, title: 'Vector DB Benchmarking Toolkit', description: 'Performance comparison framework for Chroma, Qdrant, Pinecone, and pgvector under peak load.', tech_stack: ['Python', 'pgvector', 'ChromaDB', 'Locust'], category: 'Data & Indexing', featured: false, order_index: 5 },
  { id: 6, title: 'Semantic Cache & Gateway Proxy', description: 'Sub-millisecond LLM response cache utilizing embedding similarity matching to reduce API costs.', tech_stack: ['FastAPI', 'Redis', 'SentenceTransformers'], category: 'LLM Systems', featured: false, order_index: 6 },
]

export const FALLBACK_FEATURED_PROJECTS = FALLBACK_PROJECTS.filter((p) => p.featured)

export default FALLBACK_PROJECTS
