# Akash PG — Portfolio Site

A modern, responsive portfolio website for an AI Engineer featuring a FastAPI/PostgreSQL backend and a React/Vite/Three.js/Tailwind CSS frontend.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Vanilla CSS & Tailwind CSS (if configured)
- **3D Graphics & Animations:** Three.js / React Three Fiber, GSAP, Framer Motion
- **State Management:** Zustand
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Database ORM:** SQLAlchemy
- **Authentication:** JWT tokens
- **WebServer:** Uvicorn

### Database & DevOps
- **Database:** SQLite3 (`app.db`)
- **Containerization:** Multi-stage Docker setup (Single Container)
- **Deployment:** Render Blueprint (`render.yaml`)

---

## 📂 Project Structure

```text
├── backend/               # FastAPI application code
│   ├── models/            # SQLAlchemy database models
│   ├── routers/           # API endpoint route handlers
│   ├── schemas/           # Pydantic validation schemas
│   ├── uploads/           # Useruploaded static assets
│   ├── main.py            # Backend entrypoint & startup lifespans
│   └── requirements.txt   # Python dependencies
├── frontend/              # Vite + React frontend code
│   ├── src/               # React components, styles, hooks, and pages
│   ├── package.json       # Node.js dependencies & scripts
│   └── vite.config.js     # Vite configuration
└── docker-compose.yml     # Multi-container local orchestration
```

---

## 🛠️ Getting Started

### Method 1: Using Docker Compose (Recommended)

1. Ensure you have **Docker** and **Docker Compose** installed on your machine.
2. In the root directory, run the following command to build and start both frontend and backend services:
   ```bash
   docker compose up --build
   ```
3. Once running, access the services:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **API Docs (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)

### Method 2: Running Locally (Without Docker)

#### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .\.venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --port 8000
   ```

#### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 🗄️ Database Access

When running via Docker Compose, you can access the PostgreSQL shell inside the running database container.

### Docker Exec Command to Access DB

To launch the interactive `psql` shell in the database container, run:

```bash
docker exec -it portfolio_db psql -U portfolio_user -d portfolio_db
```

#### Database Credentials (from `docker-compose.yml`):
- **User (`-U`):** `portfolio_user`
- **Database (`-d`):** `portfolio_db`
- **Password:** `portfolio_pass` (if prompted, or automatically resolved from environment)
- **Local port forwarding:** `5435` (connect from local tools using host `localhost` and port `5435`)

#### Useful commands inside `psql`:
- List databases: `\l`
- List tables: `\dt`
- Describe a table: `\d table_name`
- Exit shell: `\q` or `exit`
