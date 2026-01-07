created_date: 2025-08-12
last_modified_date: 2025-08-12
last_modified_summary: "Adopt Next.js App Router + tRPC + Auth.js + Prisma as unified platform; deprecate Express."

### Decision

Adopt a single-platform architecture:
- Next.js (App Router) for web and API
- tRPC + Zod for type-safe contracts
- Auth.js (JWT sessions) for authentication
- Prisma + PostgreSQL for data
- Direct-to-storage uploads (S3/R2) via route handlers
- Background jobs via serverless (Inngest) or a worker service (Railway)

Express backend is deprecated and scheduled for replacement by tRPC route handlers feature-by-feature.

### Rationale
- Eliminate CORS and duplicated auth
- Share schemas/types end-to-end (DRY)
- Reduce infra and deployment complexity on Vercel

### Plan
1) Introduce tRPC handler and auth scaffolding
2) Add health/meta router
3) Migrate endpoints iteratively (auth, forms, submissions)
4) Move AI analysis to async workers
5) Remove unused Express routes and services


