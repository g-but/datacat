created_date: 2025-08-12
last_modified_date: 2025-08-12
last_modified_summary: "Add Vercel + backend proxy guidance and env vars."

### Deploying DataCat Frontend to Vercel (with Backend Proxy)

- **Root Directory**: `frontend`
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: Next.js default

#### Environment Variables

- **Required (Prod)**
  - `BACKEND_URL`: Base URL of your backend, e.g. `https://api.datacat.ch`

- **Optional**
  - `NEXT_PUBLIC_API_URL`: If set, the browser will call this base directly. If omitted, the app uses relative `/api/...` paths that are proxied to `BACKEND_URL`.
  - `SKIP_CONTENTLAYER`: Set to `true` to skip the blog content build while focusing on core app features.

#### How the Frontend Talks to the Backend

- `frontend/next.config.ts` defines a rewrite:
  - `source: /api/:path*` → `destination: ${BACKEND_URL}/api/:path*`
- The app calls the backend with relative paths like `/api/v1/...`, which work locally and on Vercel.
- For local development, if `BACKEND_URL` is not set, it defaults to `http://localhost:5001`.

#### Local Development

1. Start backend on `http://localhost:5001`
2. From project root: `npm run dev` (starts frontend and backend)
3. The frontend will proxy `/api/*` to the backend automatically.

#### Blog (MDX) Notes

- Blog is optional. When not needed, set `SKIP_CONTENTLAYER=true` in your env to skip `contentlayer` during install/build.
- Add MDX posts under `frontend/content/blog/`. They render with minimal dependencies.



