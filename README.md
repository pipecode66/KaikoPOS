# Sandeli POS MVP

Cloud-based restaurant management foundation focused on fast restaurant operations: login, open register, create order, send to kitchen, receive payment, discount inventory, report, and close register.

## Workspace

- `apps/api`: NestJS REST API with JWT auth, role guards, Prisma, WebSockets, seed data, and Swagger docs.
- `apps/web`: Next.js app-router frontend with Tailwind, React Query provider, Zustand POS store, and responsive operational screens.
- `docker-compose.yml`: local PostgreSQL service for development.
- `.env.example`: shared runtime variables.
- `docs/architecture.md`: architecture, module boundaries, data model notes, endpoint map, and future extensions.

## Quick Start

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL with `docker compose up -d`.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run prisma:generate`.
5. Run migrations with `npm run prisma:migrate -w apps/api`.
6. Seed demo data with `npm run prisma:seed`.
7. Start the API with `npm run dev:api`.
8. Start the frontend with `npm run dev:web`.

## Demo Credentials

- `admin@sandeli.local` / `Demo1234!`
- `caja@sandeli.local` / `Demo1234!`
- `mesa@sandeli.local` / `Demo1234!`
- `kds@sandeli.local` / `Demo1234!`

## Notes

- Swagger is exposed at `http://localhost:3001/api/docs`.
- The frontend currently uses aligned mock data for the MVP shell while the backend provides the production-oriented contract.
- Reports are query-driven from transactional data to keep the MVP simple and avoid premature report snapshot complexity.

## Vercel Deployment

This repository is prepared for deploying the frontend app in Vercel without `vercel.json`.

### Recommended Vercel settings

- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Install Command: leave Vercel default
- Build Command: leave Vercel default
- Output Directory: leave empty

### Environment variables for Vercel

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

Use [apps/web/.env.example](C:/Users/juanitou/Documents/TRABAJO/SandeliPOS/apps/web/.env.example) as reference.

### Important note

The current Vercel-ready target is the frontend. The NestJS API remains in the monorepo and should be deployed separately on a Node host with PostgreSQL access, or later adapted if you want a single-platform deployment.
