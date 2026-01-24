# RapidBooth Architecture

## System Overview

RapidBooth is a monorepo application built with Turborepo, consisting of a Next.js marketing/dashboard frontend, an Express API backend, and shared packages.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js 14)                                │
│                        apps/web - Port 3000                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  Marketing   │  │  Dashboard   │  │  Intake Chat │  │  Site       │  │
│  │  Pages       │  │  (Rep/Admin) │  │  Interface   │  │  Preview    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │ REST API
                             │
┌────────────────────────────▼─────────────────────────────────────────────┐
│                        API SERVER (Express)                                │
│                        apps/api - Port 10000                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  Intake      │  │  Site        │  │  Deploy      │  │  Billing    │  │
│  │  Engine      │  │  Generator   │  │  Service     │  │  (Stripe)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │  Scheduling  │  │  Reviews     │  │  Content     │                   │
│  │  Service     │  │  Aggregator  │  │  Editor API  │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   rapidbooth-db │
                    └─────────────────┘
```

## Technology Decisions

### Frontend: Next.js 14 (App Router)

- **Static export** for marketing pages (deployed as static site on Render)
- **Tailwind CSS** for styling with custom theme matching brand guidelines
- **TypeScript** strict mode for type safety

### Backend: Express 4

- Lightweight, well-understood framework
- Easy to add middleware (CORS, rate limiting, auth)
- TypeScript for shared type safety with frontend
- Compiles to plain JavaScript for production

### Database: PostgreSQL

- Relational model fits business/site/user relationships
- JSONB columns for flexible site configuration storage
- Render-managed for zero-ops

### Build System: Turborepo

- Parallel builds across apps and packages
- Dependency-aware task execution
- Shared configurations via packages

## Package Structure

### `apps/web`
Next.js 14 application serving:
- Marketing pages (landing, features, pricing, about, contact)
- Dashboard UI (rep dashboard, client management)
- Intake chat interface
- Site preview/editor

### `apps/api`
Express server providing:
- RESTful API endpoints
- Claude API integration for intake/generation
- Stripe webhook handling
- Site deployment orchestration

### `packages/shared`
Shared between frontend and backend:
- TypeScript type definitions
- Business/intake/site data models
- Validation schemas
- Constants and configuration

## API Design

All API endpoints are prefixed with `/api`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/intake/start` | Start intake session |
| POST | `/api/intake/message` | Send message in session |
| GET | `/api/intake/:id` | Get session state |
| POST | `/api/sites/generate` | Generate site from intake |
| GET | `/api/sites/:id/preview` | Get site preview |
| POST | `/api/sites/:id/deploy` | Deploy generated site |
| GET | `/api/dashboard/sessions` | List rep sessions |
| GET | `/api/dashboard/analytics` | Dashboard analytics |
| POST | `/api/billing/subscribe` | Create subscription |
| GET | `/api/scheduling/slots` | Available time slots |
| POST | `/api/scheduling/book` | Book appointment |
| GET | `/api/reviews/:siteId` | Get aggregated reviews |

## Security

- **Helmet** for HTTP security headers
- **CORS** restricted to known origins
- **Rate limiting** on all endpoints (100 req/15min general, 20 req/15min for generation)
- **Input validation** on all user inputs
- **Environment variables** for all secrets (never committed)
- **HTTPS only** in production (Render-managed SSL)

## Deployment Architecture

```
GitHub (main branch)
       │
       ▼ (auto-deploy)
┌──────────────────────────────────────────────────────┐
│                    Render Platform                     │
│                                                      │
│  ┌────────────────┐  ┌────────────────┐             │
│  │ rapidbooth-web │  │ rapidbooth-api │             │
│  │ (Static Site)  │  │ (Web Service)  │             │
│  │ Free tier      │  │ Free tier      │             │
│  └────────────────┘  └───────┬────────┘             │
│                              │                       │
│                     ┌────────▼────────┐             │
│                     │ rapidbooth-db   │             │
│                     │ (PostgreSQL)    │             │
│                     │ basic-256mb     │             │
│                     └─────────────────┘             │
└──────────────────────────────────────────────────────┘
```

## Data Models

### Business
```typescript
interface Business {
  id: string;
  name: string;
  type: BusinessType; // home_services | restaurant | retail | professional
  description: string;
  location: string;
  phone?: string;
  email?: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### IntakeSession
```typescript
interface IntakeSession {
  id: string;
  businessId?: string;
  repId?: string;
  status: 'active' | 'completed' | 'abandoned';
  phase: IntakePhase; // discovery | audit | features | design | content | close
  messages: IntakeMessage[];
  extractedData: Partial<Business>;
  createdAt: Date;
  completedAt?: Date;
}
```

### GeneratedSite
```typescript
interface GeneratedSite {
  id: string;
  businessId: string;
  template: string;
  components: SiteComponent[];
  theme: SiteTheme;
  content: SiteContent;
  status: 'generating' | 'preview' | 'deployed' | 'archived';
  deployUrl?: string;
  createdAt: Date;
}
```

## Performance Considerations

- Static site export eliminates server-side rendering overhead
- API rate limiting prevents abuse
- PostgreSQL connection pooling for concurrent requests
- Turborepo caching reduces build times
- CDN-served static assets via Render
