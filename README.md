# NextStep Academy

**Tagline:** "Learn. Practice. Interview. Launch Your Career."

A modern AI‑powered EdTech & CareerTech platform that guides students from learning through interview preparation to job readiness.

## Tech Stack
- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend:** FastAPI (Python) + SQLAlchemy + Alembic
- **Database:** PostgreSQL
- **Auth:** JWT with bcrypt password hashing
- **Containerisation:** Docker & docker‑compose

## Quick Start
```bash
# Clone the repo
git clone <repo-url>
cd NextstepacademyApp

# Set up environment variables
cp .env.example .env
# Edit .env with your secrets

# Build and run containers
docker compose up --build
```

- Backend API: http://localhost:8000
- Frontend dev server: http://localhost:3000

## Project Structure
```
backend/
frontend/
common/
Dockerfile (backend & frontend)
docker-compose.yml
.env.example
```
