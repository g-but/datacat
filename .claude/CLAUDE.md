# DataCat - Universal AI-Powered Data Capture

## Overview

DataCat is a **universal data ingestion platform** with AI analysis. Custom forms capture any data type, AI processes it, and actions are delivered to humans or machines.

## Architecture

```
datacat/
├── frontend/            # Next.js 15 (port 3000)
├── backend/             # Express.js (port 5001)
├── docs/                # Documentation
├── scripts/             # Rebranding & utilities
└── docker-compose.yml   # Infrastructure
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15.3, React 19, TypeScript, Tailwind, Zustand |
| Backend | Node.js, Express.js, tRPC |
| Database | PostgreSQL (Prisma ORM), Redis |
| AI | Multi-LLM (OpenAI, Claude, custom) |
| Testing | Playwright |

## Quick Start

```bash
# Start both servers
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:5001

# Or individually
npm run dev:frontend
npm run dev:backend

# Docker
npm run docker:dev
```

## Critical Rules

### 1. Monorepo Structure
- `frontend/` - React components, pages, state
- `backend/` - API routes, database, business logic
- Root `package.json` - orchestration scripts only

### 2. Code Locations

| Concern | Location |
|---------|----------|
| UI Components | `frontend/src/components/` |
| Pages | `frontend/src/app/` |
| State Management | Zustand stores in `frontend/src/stores/` |
| API Routes | `backend/src/routes/` |
| Database | `backend/prisma/` |
| Types | Shared via tRPC |

### 3. Rebranding System

DataCat supports white-labeling via environment variables:
```bash
# Apply preset
./scripts/dev/rebrand.sh medical

# Custom brand
./scripts/dev/rebrand.sh custom "MyApp" "Data Capture"
```

Presets: `datacat`, `hr`, `medical`, `legal`, `government`, `generic`

### 4. Environment Variables

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_BRAND_NAME=DataCat
```

**Backend** (`backend/.env`):
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=...
```

## Don't

- Mix frontend/backend code
- Hardcode brand names (use env vars)
- Skip Prisma migrations
- Commit API keys

## Testing

```bash
npm test              # Playwright tests
npm run test:ui       # Interactive mode
npm run test:headed   # With browser
```

---

**See `AGENTS.md` for universal agent guidelines.**
