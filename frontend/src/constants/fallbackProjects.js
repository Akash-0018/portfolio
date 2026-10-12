// Shown when the API is unreachable so the page never renders empty. Kept in one
// place because both the featured grid and the full archive fall back to it.
// A short mirror of the featured entries in backend/scripts/seed.py.
const FALLBACK_PROJECTS = [
  { id: 1, title: 'Fusefy 2.0 — AI Governance SaaS', description: 'A ground-up rebuild of the Fusefy AI governance platform as a standalone multi-tenant SaaS that can also be embedded inside Jira Data Center.', tech_stack: ['FastAPI', 'PostgreSQL', 'Pinecone', 'Next.js', 'Terraform', 'AWS'], category: 'Professional', featured: true, order_index: 1 },
  { id: 2, title: 'Campus AI — B2B Networking Platform', description: "A multi-tenant professional networking and matchmaking platform where each 'campus' is a branded business community on its own subdomain.", tech_stack: ['FastAPI', 'Vertex AI Gemini', 'Google ADK', 'Stripe Connect', 'Next.js', 'GCP'], category: 'Professional', featured: true, order_index: 2 },
  { id: 3, title: 'Fusefy — AI Governance for Jira', description: 'An AI governance, risk and compliance app that runs inside Jira Cloud as an Atlassian Forge app.', tech_stack: ['TypeScript', 'Atlassian Forge', 'AWS Lambda', 'DynamoDB', 'AWS Bedrock'], category: 'Professional', featured: true, order_index: 3 },
  { id: 4, title: 'The Mannan Crackers — E-commerce Store', description: 'A live online store for a fireworks retailer: categorised catalogue, checkout and quick-order lists, order tracking and downloadable invoices.', tech_stack: ['Django', 'SQLite', 'ReportLab', 'WhatsApp Cloud API'], live_url: 'https://themannancrackers.com', category: 'Client Project', featured: true, order_index: 4 },
  { id: 5, title: 'LLM-Powered Resume Analyzer', description: 'Analyzes resumes against industry standards and job descriptions using LLMs, returning tailored improvement feedback and ATS-score suggestions.', tech_stack: ['FastAPI', 'Google Gemini API', 'OpenAI API', 'Anthropic API', 'React'], category: 'College Project', subcategory: 'AI', featured: true, order_index: 5 },
  { id: 6, title: 'Context-Aware Multi-Agent Academic Assistant', description: 'Orchestrates specialised AI sub-agents over the Model Context Protocol to answer domain queries, solve academic tasks and summarise research papers in one shared context.', tech_stack: ['FastAPI', 'MCP', 'Google Gemini API', 'MongoDB', 'Celery', 'React'], category: 'College Project', subcategory: 'MCP', featured: true, order_index: 6 },
]

export const FALLBACK_FEATURED_PROJECTS = FALLBACK_PROJECTS.filter((p) => p.featured)

export default FALLBACK_PROJECTS
