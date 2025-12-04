# Copilot Instructions for SnugSafe

This document provides guidance for GitHub Copilot when working on the SnugSafe repository.

## Project Overview

SnugSafe is a secure digital file storage solution with fine-tuned access control. Users authenticate via passkeys using Corbado for secure, cross-platform authentication.

## Repository Structure

This is a monorepo with three main services:

```
/
├── frontend/          # React app using Vite, TypeScript, TailwindCSS
├── server/            # Express.js Node server with TypeScript
├── docker-compose.yml # Local development orchestration
└── package.json       # Root package with Docker commands
```

### Frontend (`/frontend`)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **Styling**: TailwindCSS with Radix UI components
- **State Management**: TanStack Query
- **Authentication**: Corbado passkey authentication

### Backend (`/server`)

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: AWS S3 compatible storage
- **Authentication**: Corbado Node SDK

## Development Commands

### Starting Development Environment

```bash
# From root directory - starts all services with Docker Compose
npm run dev

# Stop all services
npm run docker:down

# View logs
npm run docker:logs
```

### Frontend Commands (run from `/frontend`)

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript compile + Vite build
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run generate-routes  # Generate TanStack Router routes
```

### Backend Commands (run from `/server`)

```bash
npm run dev          # Start with ts-node-dev (hot reload)
npm run build        # TypeScript compile
npm run start        # Start server (uses ts-node-dev)
```

## Coding Conventions

### TypeScript

- Use strict TypeScript configuration
- Prefer `interface` for object types
- Use explicit return types for functions
- Use path aliases (`@/*` maps to `./src/*` in frontend)

### File Naming

- React components: PascalCase (e.g., `FileList.tsx`, `TagManager.tsx`)
- Routes: kebab-case with `.lazy.tsx` or `.tsx` suffix
- API routes: `[feature].route.ts` pattern
- Utilities: camelCase

### React Patterns

- Use functional components with hooks
- Prefer named exports for components
- Use TanStack Query for data fetching
- Components go in `/frontend/src/components`
- UI primitives in `/frontend/src/components/ui`

### Backend Patterns

- API routes follow `/api/v1/[resource]` structure
- Use middleware for authentication (`authMiddleware`)
- Prisma for all database operations
- Route files: `[feature].route.ts`

### Database

- Prisma schema located at `/server/prisma/schema.prisma`
- Use UUIDs for primary keys
- Model names use lowercase/camelCase (e.g., `user`, `userFile`, `fileShare`) - follow existing conventions

## Environment Variables

### Frontend (`.env`)
- `VITE_API_URL` - Backend API URL
- `VITE_CORBADO_PROJECT_ID` - Corbado project ID
- `VITE_CORBADO_FRONTEND_API_URL` - Corbado frontend API URL

### Backend (`.env`)
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port
- `FRONTEND_URL` - Frontend URL for CORS

## Testing

When adding tests, follow these guidelines:
- Place tests alongside the code they test
- Use descriptive test names
- Mock external services (S3, Corbado)

## Common Tasks

### Adding a New API Endpoint

1. Create route file in `/server/src/api/v1/[feature]/`
2. Follow existing route patterns
3. Add authentication middleware if needed
4. Register route in `/server/src/server.ts`

### Adding a New Frontend Component

1. Create component in `/frontend/src/components/`
2. Use existing UI components from `/frontend/src/components/ui/`
3. Follow existing styling patterns with TailwindCSS

### Adding a New Route

1. Create route file in `/frontend/src/routes/`
2. Run `npm run generate-routes` to update route tree
3. Use TanStack Router conventions
