# AGENTS.md - DataCat

> Universal guide for AI coding agents (Claude, Codex, Gemini, Cursor)

## Project Overview

**DataCat** is a universal AI-powered data capture platform. Custom forms → AI analysis → Action delivery.

| Aspect | Details |
|--------|---------|
| Type | Full-stack web application |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind, Zustand |
| Backend | Express.js, tRPC, Prisma |
| Database | PostgreSQL, Redis |
| AI | Multi-LLM (OpenAI, Claude) |
| Deployment | Vercel (frontend), Docker (backend) |

## Quick Commands

```bash
# Development (both servers)
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:5001

# Individual services
npm run dev:frontend
npm run dev:backend

# Testing
npm test              # Playwright E2E
npm run test:ui       # Interactive mode

# Docker
npm run docker:dev    # Full stack
npm run docker:down   # Stop

# Rebranding
./scripts/dev/rebrand.sh medical
./scripts/dev/rebrand.sh custom "MyApp" "tagline"
```

## Project Structure

```
datacat/
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── stores/        # Zustand state
│   │   └── lib/           # Utilities
│   └── package.json
├── backend/                # Express API
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   └── middleware/    # Auth, validation
│   ├── prisma/            # Database schema
│   └── package.json
├── docs/                   # Documentation
├── scripts/                # Dev tools, rebranding
└── package.json            # Root orchestration
```

## Code Style Guidelines

### Frontend (TypeScript/React)
```typescript
// Zustand store pattern
import { create } from 'zustand';

interface FormStore {
  forms: Form[];
  addForm: (form: Form) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  forms: [],
  addForm: (form) => set((state) => ({ 
    forms: [...state.forms, form] 
  })),
}));
```

### Backend (Express/tRPC)
```typescript
// tRPC router pattern
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const formRouter = router({
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.form.create({ data: input });
    }),
});
```

## Key Patterns

### 1. White-Label Rebranding
All brand references use environment variables:
```typescript
// Use this pattern
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'DataCat';

// NOT this
const brandName = 'DataCat'; // Hardcoded = bad
```

### 2. Type-Safe API (tRPC)
Types are shared automatically between frontend/backend.

### 3. Form Builder
Dynamic form creation with validation schemas.

## Don't

- Hardcode brand names or colors
- Mix Prisma queries in route handlers (use services)
- Skip database migrations
- Commit .env files or API keys
- Add frontend deps to backend or vice versa

## Pre-Commit Checklist

- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] Database migrations applied if schema changed
- [ ] Brand names use environment variables
- [ ] No hardcoded credentials

---

**Last Updated**: 2026-01-08
