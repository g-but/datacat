created_date: 2025-08-12
last_modified_date: 2025-08-12
last_modified_summary: "Big-bang: Next.js App Router + tRPC + Prisma + Auth; REST parity routes added; migration steps."

### Target
- Single Next.js app provides UI and API (tRPC + minimal REST parity)
- Prisma schema embedded in frontend repo
- Auth via cookies (Auth.js) post-transition; temporary JWT endpoints provided

### Completed
- tRPC handler + meta.ping
- Prisma client + rich schema
- REST parity for auth (login, register, me), forms (list/create/update/delete/status), submissions (create)

### Next
- Replace localStorage token with Auth.js cookie sessions in UI
- Add uploads: presign route (S3/R2), integrate in UI
- Add async jobs (Inngest or Railway worker)
- Remove Express backend and related docs after parity


