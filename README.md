# 🗳️ VoteSecure — Online Voting System

A **production-ready**, full-stack online voting platform with enterprise-grade security, real-time analytics, and a premium dark-mode UI.

## 🧱 Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + TailwindCSS |
| Backend | Django 4.2 + Django REST Framework |
| Database | PostgreSQL 16 |
| Cache / Pub-Sub | Redis 7 |
| Real-time | WebSockets (Django Channels) |
| Auth | JWT (SimpleJWT) |
| Reverse Proxy | Nginx |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker Desktop installed and running
- Git

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd online-election
```

The `.env` file is already configured for local development. For production, edit `backend/.env` and change:
- `SECRET_KEY` — random string ≥ 32 chars
- `VOTE_SALT` — unique random string
- `FIRST_ADMIN_PASSWORD` — strong password
- `FERNET_KEY` — run `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` and paste output

### 2. Start All Services

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5432`
- **Redis** on port `6379`
- **FastAPI backend** on port `8000`
- **Next.js frontend** on port `3000`
- **Nginx** on port `80` (routes everything)

### 3. Access the App

| Service | URL |
|---|---|
| Frontend | http://localhost |
| API | http://localhost/api/v1 |
| API Docs | http://localhost:8000/docs |

### 4. Default Admin Login

```
Email: admin@election.local
Password: Admin@123456
```

---

## 🏃 Local Development (without Docker)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Set env vars
set DATABASE_URL=postgresql://user:pass@localhost/election_db
set REDIS_URL=redis://localhost:6379/0

# Run migrations and start server
python manage.py makemigrations accounts elections votes audit
python manage.py migrate
python manage.py runserver 8000
# Note: For WebSockets locally outside docker, use daphne:
# daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:3000
```

---

## 📁 Project Structure

```
online-election/
├── backend/                 # Django REST Framework application
│   ├── config/              # Django core settings (asgi, wsgi, urls)
│   ├── apps/                # Django modular apps
│   │   ├── accounts/        # JWT Auth + User Model
│   │   ├── elections/       # Elections + Candidates
│   │   ├── votes/           # Voting Logic
│   │   ├── analytics/       # Live Result Stats
│   │   └── audit/           # Action tracking middleware
│   ├── websocket/           # Django Channels Consumers
│   ├── utils/               # Encryption helpers
│   ├── requirements.txt     # Python deps
│   └── manage.py            # Django CLI
│
├── frontend/                # Next.js 14 application
│   ├── app/                 # App Router pages
│   ├── components/          # UI components
│   └── lib/                 # API clients
│
├── nginx/                   # Reverse proxy config
├── docker-compose.yml       # All services
└── .github/workflows/ci.yml # CI/CD pipeline
```

---

## 🔐 Security Architecture

| Threat | Mitigation |
|---|---|
| Duplicate votes | `UNIQUE(voter_hash, election_id)` at DB level |
| Voter identity leak | One-way `SHA256(user_id + election_id + salt)` hash |
| Vote content leak | Fernet AES-128-CBC encryption before storage |
| Brute force auth | Redis sliding window rate limiter |
| Token theft | Short-lived access tokens (15min) + HttpOnly refresh |
| XSS | Next.js JSX escaping + CSP headers via Nginx |
| CSRF | SameSite cookies + custom headers |
| Unauthorized results | `results_public` flag + admin-only guard |

---

## 📡 API Quick Reference

```
POST   /api/v1/auth/register        Register voter
POST   /api/v1/auth/login           Login → JWT tokens
POST   /api/v1/auth/refresh         Refresh access token
GET    /api/v1/auth/me              Current user

GET    /api/v1/elections            List elections
GET    /api/v1/elections/{id}       Election detail
GET    /api/v1/elections/{id}/results  Results (if published)

POST   /api/v1/votes                Cast vote
GET    /api/v1/votes/status/{id}    Has current user voted?

POST   /api/v1/admin/elections      Create election
PATCH  /api/v1/admin/elections/{id} Update election
POST   /api/v1/admin/elections/{id}/candidates  Add candidate
POST   /api/v1/admin/elections/{id}/publish     Publish results
DELETE /api/v1/admin/elections/{id} Delete election
GET    /api/v1/admin/stats          System statistics

GET    /api/v1/analytics/elections/{id}  Live analytics
WS     /ws/elections/{id}               Real-time vote feed
```

---

## 🧪 Running Tests

```bash
cd backend
pip install aiosqlite pytest pytest-asyncio httpx
pytest tests/ -v
```

---

## 🚀 Production Deployment

### Option A: Railway / Render (Simple)
1. Push to GitHub
2. Connect repo to Railway
3. Add environment variables from `backend/.env.example`
4. Deploy — Railway auto-detects Dockerfile

### Option B: VPS / DigitalOcean
```bash
# On server
git clone <repo> && cd online-election
cp backend/.env.example backend/.env
# Edit backend/.env with production values
docker compose up -d
```

### Option C: Vercel (Frontend) + Railway (Backend)
1. Deploy frontend to Vercel — set `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy backend to Railway with PostgreSQL and Redis addons

---

## 💡 Future Enhancements

- **AI Fraud Detection**: Isolation Forest on voting patterns to flag anomalies
- **Blockchain**: Solidity smart contract to store vote hashes immutably on Ethereum
- **Face Recognition**: deepface biometric verification at vote time
- **Email Verification**: OTP via SMTP before first vote
- **Multi-language**: i18n support
- **Audit Export**: Admin can export PDF audit reports

---

## 📄 License

MIT — Free to use, modify, and distribute.
