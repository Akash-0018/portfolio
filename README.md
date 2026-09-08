# Akash PG — Portfolio Site

A portfolio site for an AI Engineer: a FastAPI + SQLite backend with a small
admin CMS, and a React/Vite frontend with a Three.js background.

The production deployment is a **single container** — the backend serves the
built React bundle and the API from the same origin.

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router
- **Styling:** Plain CSS (`src/index.css`) with CSS custom properties, plus
  inline style objects. *No Tailwind.*
- **3D / animation:** Three.js via React Three Fiber, Framer Motion, GSAP
- **State:** Zustand
- **HTTP:** Axios

### Backend
- **Framework:** FastAPI (Python 3.11)
- **ORM:** SQLAlchemy 2.x
- **Migrations:** Alembic
- **Auth:** JWT (PyJWT) with bcrypt password hashing
- **Server:** Uvicorn

### Database & deployment
- **Database:** SQLite (`app.db`; a persistent disk at `/app/data` on Render)
- **Container:** Multi-stage Dockerfile (Node build → Python runtime)
- **Hosting:** Render Blueprint (`render.yaml`)

---

## Project Structure

```text
├── backend/
│   ├── core/              # Settings, engine/session, migration runner
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic request/response models
│   ├── routers/           # API route handlers
│   ├── utils/             # Auth, email, rate limiting
│   ├── migrations/        # Alembic environment and versions
│   ├── scripts/           # Seed / admin-rotation scripts
│   ├── uploads/           # Legacy on-disk uploads (new ones go to the DB)
│   ├── alembic.ini
│   ├── main.py            # App entrypoint, lifespan, SPA fallback
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # canvas/ sections/ ui/
│   │   ├── pages/         # Home, AllProjects, Admin, 404
│   │   ├── constants/     # Offline fallback data
│   │   ├── services/      # Axios client + endpoint bindings
│   │   └── store/         # Zustand store
│   └── vite.config.js
├── Dockerfile
├── docker-compose.yml
└── render.yaml
```

---

## Configuration

All secrets come from the environment. `backend/.env` is gitignored; create it
from the table below.

| Variable | Required | Notes |
|---|---|---|
| `SECRET_KEY` | **yes** | JWT signing key. The app refuses to start without it. Generate with `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `ADMIN_PASSWORD` | for first run | Seeds the initial admin. Without it the seeder is skipped and no admin exists. |
| `ADMIN_USERNAME` | no | Defaults to `Akash` |
| `ADMIN_EMAIL` | no | Login identity and contact-notification recipient |
| `DATABASE_URL` | no | Defaults to `sqlite:///./app.db` |
| `CORS_ORIGINS` | no | Comma-separated. Only needed for front-ends on a *different* origin. Never `*` — the API sends credentials. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | no | Contact-form notification email. If unset, notifications are skipped; messages are still stored and readable in the admin inbox. |

---

## Getting Started

### Local development (two processes)

**Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .\.venv\Scripts\activate
pip install -r requirements.txt
python main.py                 # http://127.0.0.1:8000
```

Migrations run automatically on startup. API docs: http://127.0.0.1:8000/docs

**Frontend**

```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

`frontend/.env.development` points the dev server at `http://127.0.0.1:8000`.

### Docker (single container, production-shaped)

```bash
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(48))") ADMIN_PASSWORD='choose-a-password' docker compose up --build
```

Everything is served from http://localhost:8000 — SPA and API on one origin.

---

## Database Migrations

Alembic owns the schema. There is no `create_all()`.

```bash
cd backend
alembic revision --autogenerate -m "describe the change"   # after editing models/
alembic upgrade head                                       # apply (also runs at startup)
alembic downgrade -1                                       # roll back one revision
alembic current                                            # show the applied revision
```

A database created before Alembic was introduced is detected at startup and
stamped at the baseline revision instead of having the initial migration
replayed over its existing tables.

### Inspecting the SQLite database

```bash
sqlite3 backend/app.db
```

```
.tables            list tables
.schema projects   show a table definition
.quit
```

---

## Admin

Reach the dashboard at `/admin`, or press **Ctrl/Cmd + Alt + A** anywhere on the
site. It manages projects, seminars, the profile photo, the seminar section's
visibility, and the contact-form inbox.

**Rotating the admin password:** the startup seeder only ever creates the *first*
user, so change `ADMIN_PASSWORD` and then run:

```bash
cd backend
python -m scripts.seed_user
```

---

## Notes & Known Limits

- Contact submissions are rate limited to **5 per IP per hour**, counted
  in-process. The counters reset on restart and are not shared across workers;
  a multi-process deployment needs Redis-backed limiting instead.
- Uploaded images are stored as blobs in the database, not on disk, so they
  survive redeploys on ephemeral filesystems. This is fine at portfolio scale
  and would not be at larger volumes.
- Admin JWTs live in `localStorage` and last 24 hours. There is no refresh or
  server-side revocation.
