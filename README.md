# Foodtrucks Platform

A monorepo-based ordering platform for food trucks operating at events, composed of a customer mobile app, an admin panel, and a central API.

## MVP Goal

The first product slice focuses on the platform’s critical order lifecycle:

1. Customer selects a food truck
2. Customer builds an order
3. Customer pays
4. Order is confirmed
5. Food truck receives and prepares the order
6. Customer is notified when the order is ready
7. Customer picks up the order

Detailed scope: `docs/product/mvp.md`  
Official order flow: `docs/flows/order-flow.md`

## Monorepo Structure

```txt
apps/
  admin/    Web admin panel for food trucks and platform operations
  api/      Central backend built with NestJS
  mobile/   Customer-facing mobile app built with Expo

packages/
  api-client/  Shared API client for platform integration
  config/      Shared configuration
  schemas/     Shared schemas and contracts
  types/       Shared TypeScript types
  utils/       Shared utilities    Architecture reference: docs/architecture/monorepo.md
Environment and deployment baseline: docs/architecture/environments-and-deploy.md
Railway staging runbook: docs/architecture/railway-staging.md
Clerk runtime auth configuration: docs/auth/clerk-runtime-config.md

Core Stack
Node.js 22.x LTS
pnpm 10.x
Turborepo 2.5.x
TypeScript 5.8.x
ESLint 10.x
Prettier 3.3.0
Applications
Mobile: Expo SDK 52
Admin: Next.js 16.2.x
API: NestJS 11.x
ORM: Prisma 7.x
Database: PostgreSQL 16.13

Official version source: docs/architecture/version-matrix.md

Operating Rules

The project follows a strict execution protocol to preserve technical consistency and reduce rework.

backlog.md is the canonical source of execution status
No task moves out of READY without explicit human approval
No safe installation or upgrade happens without version-matrix
No API contract is considered trustworthy without Swagger and Scalar
If a task touches Prisma, prisma generate is mandatory before REVIEW or DONE
Root Scripts
pnpm dev
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm clean
Current Repository Status

The repository already includes:

Monorepo foundation
Shared TypeScript configuration
Shared ESLint and Prettier configuration
Central documentation for product, authentication, orders, payments, notifications, testing, and observability

Application and backend implementation continue according to the canonical backlog.

Documentation Index
Product scope: docs/product/mvp.md
Order flow: docs/flows/order-flow.md
Architecture: docs/architecture/monorepo.md
Environments and deploy: docs/architecture/environments-and-deploy.md
Staging runbook: docs/architecture/railway-staging.md
Auth runtime config: docs/auth/clerk-runtime-config.md
Version matrix: docs/architecture/version-matrix.md
Development Notes

Before starting any task:

Read AGENTS.md
Read docs/ops/session-handoff.md
Read the session recovery instruction
Read docs/architecture/version-matrix.md
Read docs/ops/backlog.md

This project uses structured handoff and operational documentation to ensure continuity across sessions and contributors.

Status

The project is currently paused at a validated MVP checkpoint, with the next steps driven only by real product, operational, or business triggers.
