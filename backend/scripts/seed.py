"""
Starter project catalogue.

main.py calls seed_projects() on every startup; it only inserts when the
projects table is empty, so anything edited through the admin dashboard is
never overwritten. To load the catalogue by hand:

    python -m scripts.seed
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session

from core.database import SessionLocal
from core.migrations import run_migrations
from services.project_service import ProjectService

PROFESSIONAL = "Professional"
CLIENT = "Client Project"
FREELANCE = "Freelance Project"
COLLEGE = "College Project"
GENERAL = "Others / General"

# Subcategories - College projects only.
FULL_STACK = "Full-Stack"
ML = "ML"
AI = "AI"
MCP = "MCP"

_REACT_FASTAPI = ["FastAPI", "SQLAlchemy", "SQLite", "React", "Vite", "Tailwind CSS"]


def _college(subcategory: str, **fields) -> dict:
    return {"category": COLLEGE, "subcategory": subcategory, **fields}


def _college_web(title: str, description: str, tech_stack=None) -> dict:
    return _college(FULL_STACK, title=title, description=description, tech_stack=tech_stack or _REACT_FASTAPI)


PROJECTS = [
    # --- Professional ---------------------------------------------------------
    {
        "title": "Fusefy 2.0 — AI Governance SaaS",
        "description": "A ground-up rebuild of the Fusefy AI governance platform as a standalone multi-tenant SaaS that can also be embedded inside Jira Data Center.",
        "long_description": "Teams register AI use cases, run threat assessments, map risks to compliance-framework controls, keep a risk register, and generate design documents and features that sync to Jira. The backend is async FastAPI on PostgreSQL with row-level security for tenant isolation, with queue workers for the assessment pipeline, Prowler-based cloud security (CSPM) scans, and automated code review. A RAG pipeline keeps a Pinecone index in sync with the database, so controls can be matched by vector search instead of an LLM call per control. Infrastructure is Terraform on AWS (App Runner, RDS, SQS, S3, SES) across dev, staging and production.",
        "tech_stack": ["Python", "FastAPI", "SQLModel", "PostgreSQL", "Pinecone", "OpenAI API", "LiteLLM", "Next.js", "React", "Terraform", "AWS"],
        "category": PROFESSIONAL,
        "featured": True,
    },
    {
        "title": "Campus AI — B2B Networking Platform",
        "description": "A multi-tenant professional networking and matchmaking platform where each 'campus' is a branded business community on its own subdomain.",
        "long_description": "Members find each other through AI semantic search with reranking, connect and chat in real time, and book free or paid consultations; paid bookings split revenue through Stripe Connect and generate Zoom links. Google ADK agents act as a campus concierge, a matchmaker, and a 'Market Connector' that scouts buyers and drafts outreach assets (email, LinkedIn post, one-pager, call script). Also includes AI parsing of uploaded documents, profile enrichment from web search, role-based access, bulk CSV/XLSX import, tiered campus plans and revenue dashboards. Runs on Google Cloud: Cloud Run, Cloud SQL, Firestore, Pub/Sub, Vertex AI and Vector Search.",
        "tech_stack": ["Python", "FastAPI", "PostgreSQL", "Firestore", "Vertex AI Gemini", "Google ADK", "Vector Search", "Stripe Connect", "Next.js", "React", "GCP"],
        "category": PROFESSIONAL,
        "featured": True,
    },
    {
        "title": "Fusefy — AI Governance for Jira",
        "description": "An AI governance, risk and compliance app that runs inside Jira Cloud as an Atlassian Forge app.",
        "long_description": "Teams record AI use cases (through an AI questionnaire, document upload or a manual form), run LLM-assisted threat and control assessments against compliance frameworks, generate design documents and features, and push them back to Jira as stories. It also covers TCO / ROI and Bedrock cost estimation, model-validation and code-review workflows, an executive adoption dashboard and PDF reports. Serverless TypeScript on AWS built with SST: Lambda, API Gateway, DynamoDB, Step Functions and Bedrock.",
        "tech_stack": ["TypeScript", "Atlassian Forge", "React", "AWS Lambda", "DynamoDB", "Step Functions", "AWS Bedrock", "OpenAI API", "SST"],
        "category": PROFESSIONAL,
        "featured": True,
    },
    {
        "title": "Realtty AI — Real-Estate Investment Platform",
        "description": "An AI real-estate investment platform for realtty.ai with property recommendations and analysis, market-intelligence jobs, and an admin / user web app.",
        "long_description": "The FastAPI backend is built around a Google ADK agent and covers property recommendations, submissions, enquiries, a knowledge hub, and Zoho CRM sync. Batch jobs for ingestion, normalisation, amenities and market analysis run on BigQuery and Pub/Sub, using Gemini on Vertex AI and Tavily web search. The Next.js frontend has Leaflet maps, charts and PDF reports, and is covered by Playwright and load tests.",
        "tech_stack": ["FastAPI", "Google ADK", "Vertex AI Gemini", "PostgreSQL", "BigQuery", "Pub/Sub", "Next.js", "Ant Design", "Playwright"],
        "live_url": "https://realtty.ai",
        "category": PROFESSIONAL,
        "featured": True,
    },
    {
        "title": "Fusefy Lambda Agents",
        "description": "A suite of containerised AWS Lambda AI agents that generate use cases, features, architecture diagrams, code, control mappings, SOW documents and proposals for Fusefy.",
        "long_description": "Each agent ships as its own Docker-packaged Lambda, backed by OpenAI and AWS Bedrock models through LangChain. Alongside the agents are a cloud-security (CSPM) scanner and a job that syncs the knowledge base from DynamoDB to S3 and Pinecone. Deployed through Bitbucket Pipelines.",
        "tech_stack": ["Python", "AWS Lambda", "Docker", "LangChain", "OpenAI API", "AWS Bedrock", "DynamoDB", "Pinecone"],
        "category": PROFESSIONAL,
    },
    {
        "title": "Enterprise Intranet Portal",
        "description": "A company intranet with employee directory, newsfeed, ideation hub, governance documents, code repository, global search, role-based admin and an audit log.",
        "long_description": "A FastAPI service on Azure App Service and Azure SQL. Users sign in with Microsoft Entra ID, and the API pulls directory data and mail from Microsoft Graph. The newsfeed supports polls, @mentions and scheduled posts with approval; code submissions are reviewed by the reporting manager. Files live in Azure Blob Storage, and releases go out through Azure Pipelines.",
        "tech_stack": ["FastAPI", "Azure SQL", "Alembic", "React", "Vite", "Microsoft Entra ID", "Microsoft Graph", "Azure Blob Storage", "Azure Pipelines"],
        "category": PROFESSIONAL,
    },
    {
        "title": "Vacant Land Agent",
        "description": "A prototype chat agent that searches vacant-land listings and can start an outbound call to the owner through an n8n workflow.",
        "tech_stack": ["Node.js", "Express", "React", "Tailwind CSS", "Chart.js", "n8n", "Gemini"],
        "category": PROFESSIONAL,
    },
    # --- Client ---------------------------------------------------------------
    {
        "title": "The Mannan Crackers — E-commerce Store",
        "description": "A live online store for a fireworks retailer: categorised catalogue, checkout and quick-order lists, order tracking and downloadable invoices.",
        "long_description": "Built in Django for a real client. Customers browse a categorised price list and place orders; staff and admins manage inventory, stock and order status from their own dashboards. Generates PDF invoices and a downloadable price list, and sends WhatsApp order notifications through the Meta WhatsApp Cloud API. Role-based accounts (admin, staff, customer) with an approval flow, configurable handling fees, and sitemap / robots.txt for SEO.",
        "tech_stack": ["Python", "Django", "SQLite", "django-allauth", "ReportLab", "WhatsApp Cloud API", "Gunicorn"],
        "github_url": "https://github.com/themannancrackers/Crackers_website",
        "live_url": "https://themannancrackers.com",
        "category": CLIENT,
        "featured": True,
    },
    {
        "title": "Kalyan Jewellers Voice Campaign Manager",
        "description": "A campaign manager and call-analytics dashboard for multilingual (English, Tamil, Hindi) automated outbound voice calls, orchestrated with n8n.",
        "long_description": "The campaign manager handles campaign creation, language templates, contact import / export, ElevenLabs voice settings and analytics. An Express webhook server receives call events from n8n, which places calls through Twilio, and feeds a separate call-analytics dashboard.",
        "tech_stack": ["React", "Redux Toolkit", "Tailwind CSS", "Node.js", "Express", "n8n", "ElevenLabs", "Twilio"],
        "github_url": "https://github.com/akashg018/Campaign-UI",
        "category": CLIENT,
    },
    # --- Freelance ------------------------------------------------------------
    {
        "title": "TurfZone — Turf Booking Platform",
        "description": "A sports-turf booking platform where players find facilities, book time slots, pay online, form teams and leave reviews.",
        "long_description": "Django apps cover accounts, facilities, bookings, payments, reviews and teams. Payments run through Razorpay, Google sign-in through django-allauth, and booking confirmations go out by email, with WhatsApp Business templates prepared for booking and payment messages.",
        "tech_stack": ["Python", "Django", "Django REST Framework", "django-allauth", "Razorpay", "SQLite"],
        "github_url": "https://github.com/Akash-0018/Turf",
        "category": FREELANCE,
    },
    {
        "title": "StudyBuddy AI",
        "description": "An AI study companion that answers subject-specific questions with Google Gemini, supports Indian languages, and uses uploaded documents as context.",
        "long_description": "A Flask backend with Google OAuth login, saved chat sessions, subject classification and language detection. Accepts PDF, DOCX, PPTX, Excel and image uploads, reading images with OCR (Tesseract / OpenCV). React chat UI with syntax highlighting.",
        "tech_stack": ["Python", "Flask", "SQLAlchemy", "Google Gemini API", "Tesseract OCR", "OpenCV", "React"],
        "github_url": "https://github.com/Akash-0018/Nexus-the-chatbot",
        "category": FREELANCE,
    },
    # --- Others / General -----------------------------------------------------
    {
        "title": "AuraBot — College AI Chatbot SaaS",
        "description": "A multi-tenant RAG chatbot platform for colleges: a superadmin onboards each college, which gets its own knowledge base and chatbot on its own subdomain.",
        "long_description": "Celery workers ingest and chunk PDF / DOCX documents, embed them with sentence-transformers and store them in PostgreSQL with pgvector for hybrid retrieval. The chat pipeline adds intent routing, guardrails, admission-lead extraction and notifications on top of Gemini and Groq models, and records support tickets, feedback and retrieval logs.",
        "tech_stack": ["FastAPI", "PostgreSQL", "pgvector", "Celery", "Redis", "sentence-transformers", "Gemini", "Groq", "React", "Tailwind CSS"],
        "github_url": "https://github.com/auronixtechnologies/Aura-Bot",
        "category": GENERAL,
        "featured": True,
    },
    {
        "title": "BDM Field Sales App",
        "description": "A mobile-first field-sales app for a device distributor's 12 business-development managers and 820 outlets, with GPS-verified visits and a manager dashboard.",
        "long_description": "Visits are verified with a Haversine geofence and a GPS-accuracy threshold, with a disambiguation step when outlets share a geofence. Outlets are ranked by a 0–100 priority score built from revenue, revenue drop against the 3-month average, recency and risk. Includes store-type checklists, a manager audit suite, a CSV cleaning pipeline and a pytest suite.",
        "tech_stack": ["FastAPI", "SQLModel", "pytest", "React", "TypeScript", "TanStack Query", "Leaflet", "Recharts", "Docker"],
        "github_url": "https://github.com/Akash-018/IT-World-Assessment",
        "live_url": "https://bdm-field-sales.onrender.com/",
        "category": GENERAL,
    },
    {
        "title": "PixelTest — Front-End Assessment Workspace",
        "description": "A browser-based assessment workspace: an admin uploads a reference screenshot and candidates rebuild it in HTML / CSS / JS (or solve SQL challenges) with a live preview.",
        "long_description": "Three resizable panels: the reference image, a Monaco editor, and a sandboxed iframe preview with viewport presets and autosave. The SQL track runs graded challenges in the browser with sql.js (SQLite on WebAssembly). FastAPI backend with JWT admin auth, PostgreSQL in production, deployed with Docker on Render.",
        "tech_stack": ["React", "TypeScript", "Vite", "Monaco Editor", "sql.js", "FastAPI", "PostgreSQL", "Docker"],
        "github_url": "https://github.com/Akash-018/Auronix_Assessment",
        "category": GENERAL,
    },
    {
        "title": "Auronix Technologies Website",
        "description": "A full-stack company website with a team showcase, portfolio projects filterable by domain, client case studies, a blog and lead capture.",
        "long_description": "A layered FastAPI backend on PostgreSQL with JWT-protected admin endpoints for team, projects, leads and blog. Uploaded images are converted to WebP, stored in Postgres and served from a cached endpoint. Ships as a single Docker image on Render.",
        "tech_stack": ["React", "Vite", "FastAPI", "SQLAlchemy", "PostgreSQL", "JWT", "Docker"],
        "github_url": "https://github.com/auronixtechnologies/Auronix-website",
        "live_url": "https://auronix.onrender.com",
        "category": GENERAL,
    },
    {
        "title": "Auronix Practice Portal",
        "description": "A technical interview and practice portal with timed MCQ and coding tests, plus user and admin dashboards.",
        "long_description": "Coding tests run Python in the browser through Pyodide, and both test types flag tab switches to the admin. The admin dashboard exports results to PDF.",
        "tech_stack": ["React", "Vite", "React Router", "Pyodide", "jsPDF"],
        "github_url": "https://github.com/auronixtechnologies/Auronix-Assessment-Platform",
        "category": GENERAL,
    },
    {
        "title": "LinkedIn Outreach Automation",
        "description": "A LinkedIn outreach tool that scrapes profiles and sends messages with Puppeteer, synced to Google Sheets and managed from a React dashboard.",
        "long_description": "An Express API for profiles, messaging and campaigns, plus a scraper service with cron-scheduled campaigns, a worker pool and live campaign events over WebSockets. React + MUI dashboard for campaigns, messaging and contacts.",
        "tech_stack": ["Node.js", "Express", "Puppeteer", "Google Sheets API", "Socket.IO", "React", "MUI"],
        "github_url": "https://github.com/Akash-0018/Complete_linkedin_automation",
        "category": GENERAL,
    },
    {
        "title": "Python Master Levels",
        "description": "A gamified, level-based Python practice app that runs learners' code entirely in the browser with Pyodide.",
        "tech_stack": ["React", "Vite", "Pyodide", "Framer Motion"],
        "category": GENERAL,
    },
    # --- College: AI ----------------------------------------------------------
    _college(
        AI,
        title="LLM-Powered Resume Analyzer",
        description="Analyzes resumes against industry standards and job descriptions using LLMs, returning tailored improvement feedback and ATS-score suggestions.",
        tech_stack=["FastAPI", "Google Gemini API", "OpenAI API", "Anthropic API", "PyMuPDF", "React", "Vite", "Tailwind CSS"],
        featured=True,
    ),
    _college(
        AI,
        title="Automated Project Report Generator",
        description="Generates structured academic project documentation and reports with Google Gemini from a few user inputs.",
        tech_stack=["FastAPI", "Google Gemini API", "SQLAlchemy", "SQLite", "React", "Vite", "Tailwind CSS"],
    ),
    # --- College: MCP ---------------------------------------------------------
    _college(
        MCP,
        title="Context-Aware Multi-Agent Academic Assistant",
        description="Orchestrates specialised AI sub-agents over the Model Context Protocol to answer domain queries, solve academic tasks and summarise research papers in one shared context.",
        tech_stack=["FastAPI", "MCP", "Google Gemini API", "Anthropic API", "MongoDB", "Redis", "Celery", "React", "Vite", "Tailwind CSS"],
        featured=True,
    ),
    # --- College: ML ----------------------------------------------------------
    _college(
        ML,
        title="Fake News Detection System",
        description="Flags misleading news articles using NLP preprocessing and a TF-IDF based machine-learning classifier.",
        tech_stack=["FastAPI", "Scikit-Learn", "NLTK", "Pandas", "NumPy", "React", "Tailwind CSS"],
    ),
    _college(
        ML,
        title="Student Feedback Sentiment Analysis",
        description="Classifies course and instructor feedback as positive, negative or neutral using NLP sentiment analysis.",
        tech_stack=["Flask", "Flask-SQLAlchemy", "NLTK", "React", "Tailwind CSS"],
    ),
    # --- College: Full-Stack --------------------------------------------------
    _college_web("Online Examination & Result Management", "Online exam creation, timed tests, automatic evaluation and instant result generation."),
    _college_web("Smart Attendance Management System", "Attendance tracking with QR-code check-ins, GPS verification and real-time reports for faculty.", ["FastAPI", "SQLAlchemy", "SQLite", "React", "Tailwind CSS", "Axios"]),
    _college_web("College Placement Management System", "Coordinates campus recruitment drives, eligibility filtering, interview schedules and offer tracking."),
    _college_web("Online Job Portal for Freshers", "Job postings, resume submissions, application tracking and interview scheduling for graduating students."),
    _college_web("Online E-Learning Platform", "Video courses, module quizzes, downloadable resources and student progress tracking."),
    _college_web("Digital Certificate Verification System", "Lets third parties verify student certificates instantly by unique ID or QR code."),
    _college_web("Online Voting System", "Student union elections with voter authentication, ballot casting and live vote tallying."),
    _college_web("Online Grievance Redressal System", "Institutional grievance handling with automatic multi-level escalation when complaints go unresolved."),
    _college_web("Student Complaint Management System", "Students submit, prioritise and track complaints while administrators manage the resolution workflow.", ["Django", "Bootstrap", "HTML5", "CSS3", "JavaScript", "SQLite"]),
    _college_web("Research Paper Submission & Review System", "Conference paper submissions, reviewer assignment, revision tracking and editor decisions.", ["Django", "Bootstrap", "HTML5", "CSS3", "SQLite"]),
    _college_web("College Event Management System", "Event publishing, registrations, ticket booking and schedule management for campus events."),
    _college_web("Library Management System", "Book cataloguing, issue/return tracking, fine calculation and availability search."),
    _college_web("Faculty Workload Management System", "Tracks teaching hours, research duties and committee work to balance faculty workload."),
    _college_web("College Bus Route & Attendance System", "Bus route planning, stop allocation and daily boarding verification for college transport."),
    _college_web("Smart Hostel Room Allocation System", "Hostel applications, preference matching, capacity monitoring and bed allocation."),
    _college_web("Hostel Management System", "Hostel administration: resident attendance, mess billing, maintenance requests and rooms."),
    _college_web("Blood Bank Management System", "Donor registry, blood-group inventory and emergency request dispatch between donors and hospitals.", ["FastAPI", "SQLModel", "SQLite", "React", "Vite", "Tailwind CSS"]),
    _college_web("Personal Expense Tracker", "Budget tracking, expense categories and spending charts for students.", ["React", "Vite", "HTML5", "CSS3", "JavaScript"]),
]

for _index, _project in enumerate(PROJECTS, start=1):
    _project["order_index"] = _index


def seed_projects(db: Session) -> int:
    """Insert the catalogue into an empty projects table; return rows added."""
    return ProjectService(db).seed_defaults(PROJECTS)


def seed():
    run_migrations()
    session = SessionLocal()
    try:
        added = seed_projects(session)
        if added:
            print(f"[OK] Seeded {added} projects.")
        else:
            print("[SKIP] Projects table already has rows - nothing seeded.")
    finally:
        session.close()


if __name__ == "__main__":
    seed()
