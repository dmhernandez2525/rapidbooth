# RapidBooth

**Fresh Sites, Harvested in 30 Minutes.**

AI-powered website generation for small businesses. Get a professional, fully-functional website through a simple conversation. No coding, no templates, no hassle.

## Overview

RapidBooth combines conversational AI intake with automated site generation and deployment to deliver production-ready websites in under 30 minutes. Built for small businesses — home services, restaurants, retail, and professional services — who need a web presence without the complexity.

### Key Features

- **AI Website Generation** — Unique sites tailored to your business, not template fill-ins
- **Conversational Intake** — Natural dialogue replaces complicated forms
- **Live Preview** — Watch your site build in real-time as you talk
- **Instant Deployment** — One-click publish with custom domain and SSL
- **Content Ownership** — Export anytime, no lock-in contracts
- **Appointment Scheduling** — Built-in booking directly on your site
- **Review Aggregation** — Display Google/Yelp/Facebook reviews
- **Content Self-Service** — Update your site without coding

## Architecture

```
rapidbooth/
├── apps/
│   ├── web/          # Next.js 14 marketing site & dashboard
│   └── api/          # Express API server
├── packages/
│   └── shared/       # Shared types and utilities
├── docs/             # Architecture & roadmap documentation
├── render.yaml       # Render deployment blueprint
└── turbo.json        # Turborepo build orchestration
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Express 4, TypeScript, PostgreSQL |
| Build | Turborepo, npm workspaces |
| Deployment | Render (static + web service + PostgreSQL) |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL (for API development)

### Installation

```bash
# Clone the repository
git clone git@github.com:dmhernandez2525/rapidbooth.git
cd rapidbooth

# Install dependencies
npm install

# Start development servers
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint all packages |
| `npm run type-check` | TypeScript type checking |
| `npm run clean` | Clean build artifacts |
| `npm run format` | Format code with Prettier |

## Deployment

The project deploys to Render via the `render.yaml` blueprint:

- **rapidbooth-web** — Static site (Next.js export)
- **rapidbooth-api** — Node.js web service
- **rapidbooth-db** — PostgreSQL database

### Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `PORT` | API | Server port (default: 10000) |
| `NODE_ENV` | API | Environment (production) |
| `DATABASE_URL` | API | PostgreSQL connection string |
| `CORS_ORIGIN` | API | Allowed CORS origins |

## Project Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1. Foundation | Complete | Monorepo, marketing site, API skeleton |
| 2. Intake Engine | In Progress | Conversational AI business discovery |
| 3. Site Generator | Planned | Component library + template assembly |
| 4. Live Preview | Planned | Real-time site preview during builds |
| 5. Deployment Service | Planned | Auto-deploy generated sites |
| 6. Rep Dashboard | Planned | Sales session & pipeline tracking |
| 7. Billing | Planned | Stripe subscription management |
| 8. Scheduling | Planned | Appointment booking system |
| 9. Reviews | Planned | Multi-platform review aggregation |
| 10. Content Editor | Planned | WYSIWYG self-service editing |

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) — System design and technical decisions
- [Roadmap](./docs/ROADMAP.md) — Feature timeline and priorities

## License

Proprietary. All rights reserved.
