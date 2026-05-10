# Traveloop

Modern full-stack AI-ready travel planning web application scaffold (Next.js + Prisma).

This repository contains the Traveloop frontend (Next.js app router) and a backend directory for API/services. The frontend is the primary development area and includes Prisma schema, seed scripts, auth, and server actions.

**Quick Start**

- Prerequisites: Node.js 18+, npm (or pnpm/yarn), and a PostgreSQL-compatible database (e.g. Neon).
- Copy environment variables:

  1. Open `frontend/.env.example` and copy to `frontend/.env.local`.
  2. Set `DATABASE_URL` to your Postgres connection string.
 3. Ensure `NEXTAUTH_SECRET` is set (Auth requires this or you'll see `MissingSecret`).

Commands (run in `frontend`):

```bash
cd frontend
npm install
# prepare Prisma client
npx prisma generate
# create DB schema (safe for dev):
npx prisma db push
# seed demo data:
node prisma/seed.js
# run dev server
npm run dev
```

Notes:
- The seed script (`prisma/seed.js`) populates a demo user and sample trip data. If the DB is empty, run `npx prisma db push` before `node prisma/seed.js`.
- If you see a `MissingSecret` error from the auth provider, confirm `NEXTAUTH_SECRET` is present in `frontend/.env.local`.

Project layout (important folders):
- `frontend/app` — Next.js app routes and pages.
- `frontend/actions` — server actions used by forms/routes (trip, budget, checklist, profile, journal, auth).
- `frontend/lib` — shared libs: `prisma` client, `auth` wrapper, validations.
- `frontend/prisma` — `schema.prisma` and `seed.js`.

Prisma & Database
- Schema: `frontend/prisma/schema.prisma`.
- Generate client: `npx prisma generate`.
- Push schema to DB without migrations: `npx prisma db push` (good for dev and CI).
- Optional: use `prisma migrate dev` for migrations if you prefer an explicit migration workflow.

Troubleshooting
- Large diffs from `node_modules`? Ensure `.gitignore` includes `node_modules` — do not commit dependencies.
- Seed errors referencing missing tables: run `npx prisma db push` before seeding.
- Server action parse/syntax errors: file edits live under `frontend/actions`; check the dev server logs and fix JS/TS parse issues.

Contributing
- Follow the existing code patterns in `frontend/app` and `features`.
- Keep `node_modules` out of source control.

License
- This project scaffold is provided for development and learning. Add a license file if you intend to publish.

If you want the README expanded with architecture diagrams, deployment steps, or CI instructions, tell me which sections to add and I will extend it.
