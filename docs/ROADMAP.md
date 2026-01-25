# RapidBooth Roadmap

## Phase Overview

| Phase | Feature | Priority | Status |
|-------|---------|----------|--------|
| 1 | Project Foundation & Marketing Site | P0 | Complete |
| 2 | Conversational Intake Engine | P0 | Complete |
| 3 | AI Site Generator | P0 | Complete |
| 4 | Live Preview System | P0 | Complete |
| 5 | Deployment Service | P0 | Complete |
| 6 | Rep Dashboard & Analytics | P1 | Complete |
| 7 | Billing & Stripe Integration | P1 | Complete |
| 8 | Appointment Scheduling | P1 | Complete |
| 9 | Review Aggregation | P2 | Complete |
| 10 | Content Self-Service Editor | P2 | Complete |

---

## Phase 1: Project Foundation & Marketing Site

**Status:** Complete

### Deliverables
- Turborepo monorepo with npm workspaces
- Next.js 14 marketing website (landing, features, pricing, about, contact)
- Express API server with health check, CORS, rate limiting
- Shared types package
- Tailwind CSS with RapidBooth branding
- render.yaml deployment blueprint
- GitHub Actions CI pipeline
- Comprehensive documentation

---

## Phase 2: Conversational Intake Engine

**Status:** In Progress

### Description
AI-powered business discovery through natural conversation. Uses Claude API to guide business owners through a 6-phase intake process, extracting structured data for site generation.

### Key Features
- Chat-based UI with message bubbles and typing indicators
- Claude API integration for conversational AI
- 6-phase intake framework (discovery, audit, features, design, content, close)
- Real-time message streaming
- Phase progress tracking
- Intake data extraction and storage
- Session persistence and resumption

### Technical Details
- WebSocket or SSE for real-time streaming
- Structured prompt engineering for each phase
- PostgreSQL storage for sessions and extracted data

---

## Phase 3: AI Site Generator

**Status:** Complete

### Description
Component library with vertical-specific templates assembled dynamically based on intake data. Claude API generates content tailored to the business.

### Deliverables
- Site generation service with template detection and component assembly
- 4 vertical templates (home services, restaurant, professional services, retail)
- Claude API content generation with per-template default fallbacks
- Theme engine with color schemes, font families, and border radius per style
- REST API endpoints (generate, generate-direct, get, list)
- Frontend site renderer with 8 section components (navbar, hero, about, services, testimonials, contact, gallery, booking, footer)
- Interactive preview page with device toggle (desktop/tablet/mobile)
- Sample site demos for each vertical template
- Intake-to-preview flow with completion CTA

---

## Phase 4: Live Preview System

**Status:** Complete

### Description
Real-time site preview that updates as the intake progresses. Users see their site build in real-time with responsive preview options.

### Deliverables
- Split-screen builder page with chat (left) and live preview (right)
- Real-time business data extraction from conversation messages
- Client-side site generation hook (useSiteBuilder) with reactive updates
- Theme customization panel with color presets, custom pickers, font and style selectors
- Component arrangement controls with up/down reordering
- Device viewport toggle (desktop/tablet/mobile)
- Progressive preview that evolves as intake conversation progresses
- Template auto-detection from business type keywords

---

## Phase 5: Deployment Service

**Status:** Complete

### Description
Automated deployment of generated sites to subdomains with SSL provisioning and DNS configuration.

### Deliverables
- Deployment service with async pipeline simulation (queued → building → SSL → DNS → deploying → live)
- REST API: create, get, list, stop, redeploy, update custom domain, stats
- Build log tracking with timestamped entries
- Subdomain auto-generation from business name
- Custom domain support with CNAME guidance
- Frontend deployment page with pipeline visualization and live build log
- Deploy button integrated into builder flow after intake completion
- Site management: stop/redeploy controls

---

## Phase 6: Rep Dashboard & Analytics

**Status:** Complete

### Description
Dashboard for sales reps to track sessions, manage client pipeline, and view performance metrics.

### Deliverables
- Dashboard service with demo data seeding for 8 clients and sessions
- Metrics API: total/completed sessions, conversion rate, MRR, avg duration
- Client pipeline visualization (lead → prospect → active → churned)
- Revenue bar chart with monthly totals and MRR display
- Sessions table with status badges, phase tracking, and duration
- Filter by status and search by business name
- Client status management (pipeline stage updates)
- REST endpoints: metrics, pipeline, revenue, sessions, clients

---

## Phase 7: Billing & Stripe Integration

**Status:** Complete

### Description
Stripe-pattern subscription management for the $30/month plan.

### Deliverables
- Billing service with Stripe-compatible subscription lifecycle (create, cancel, reactivate)
- Invoice generation with payment status tracking
- Payment method storage per client
- Billing metrics (MRR, total revenue, active subscriptions, churn rate)
- Webhook handler for payment events (invoice.payment_succeeded, invoice.payment_failed, etc.)
- Frontend billing page with subscription table, invoice history, and metrics
- Tab interface switching between subscriptions and invoices
- Demo data seeding for realistic portfolio demonstration

---

## Phase 8: Appointment Scheduling

**Status:** Complete

### Description
Built-in scheduling system that integrates with generated sites, allowing customers to book appointments directly.

### Deliverables
- Scheduling service with availability configuration per site (business hours, slot duration, buffer time)
- Booking lifecycle management (create, confirm, cancel)
- Available slot calculation with conflict detection
- Weekly calendar UI with date selection and slot visualization
- Booking management with status badges and customer details
- Upcoming appointments sidebar with quick stats
- Per-site filtering for multi-business support
- Blocked dates and timezone configuration
- Confirmation code generation for customer lookups

---

## Phase 9: Review Aggregation

**Status:** Complete

### Description
Multi-platform review display widget that aggregates and displays business reviews on generated sites.

### Deliverables
- Review display widget with multiple layouts
- Support for Google, Yelp, and Facebook reviews (simulated)
- Review response management for business owners
- Rating analytics and trends with monthly stats
- Review request email automation (simulated)
- Filtering by platform, status, and rating
- Review status management (published, hidden, flagged)

---

## Phase 10: Content Self-Service Editor

**Status:** Complete

### Description
WYSIWYG page editor that allows business owners to update their sites without coding knowledge.

### Deliverables
- Block-based content editor with drag-and-drop reordering
- 10 block types: hero, text, image, gallery, services, testimonials, contact, CTA, divider, spacer
- SEO settings panel (title, description, keywords, Open Graph)
- Theme customization with live preview
- Publish/draft workflow with version control
- Version history with one-click rollback
- Image upload and management (simulated storage)
- Responsive editor interface

### API Endpoints
- `GET /api/content/draft/:siteId` - Get current draft
- `PUT /api/content/draft/:siteId` - Update draft (blocks, SEO, theme)
- `POST /api/content/draft/:siteId/blocks` - Add new block
- `PATCH /api/content/draft/:siteId/blocks/:blockId` - Update block
- `DELETE /api/content/draft/:siteId/blocks/:blockId` - Delete block
- `POST /api/content/draft/:siteId/reorder` - Reorder blocks
- `POST /api/content/draft/:siteId/publish` - Publish draft as new version
- `GET /api/content/versions/:siteId` - Get version history
- `POST /api/content/versions/:siteId/:versionId/rollback` - Rollback to version
- `POST /api/content/images/:siteId` - Upload image metadata
- `GET /api/content/images/:siteId` - List images
- `DELETE /api/content/images/:siteId/:imageId` - Delete image

---

---

## Coming Soon: Voice-Based Client Intake

**Powered by PersonaPlex Full Duplex AI**

Transform the intake experience with natural voice conversation. Instead of typing responses, business owners simply talk while PersonaPlex guides them through the discovery process.

### Current Experience
```
Rep types questions → Client dictates answers → Rep transcribes → AI generates site
```

### With PersonaPlex
```
Client: "We're a family-owned plumbing business..."
PersonaPlex: "Got it, plumbing. How long have you been in business?"
Client: "Since 1985, my dad started it..."
PersonaPlex: "Nice, that's great heritage. What areas do you serve?"
Client: "Mainly the Phoenix metro..."
[Natural conversation continues, site builds in real-time on screen]
```

### Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Full Duplex Conversation | P0 | Talk naturally without waiting for responses |
| Real-time Site Building | P1 | Site updates as client describes business |
| Back-channeling | P1 | Active listening with "uh-huh", "got it" |
| Smart Prompts | P1 | AI asks follow-up questions to fill gaps |
| Accent Adaptation | P2 | Learns client's speaking patterns |
| Multi-language | P2 | Support Spanish, French intake |

### Technical Requirements

- 24GB+ VRAM (Mac M2 Pro or higher)
- 32GB RAM recommended
- Runs 100% locally - no cloud required
- <500ms response time

---

## Future Considerations (Post-MVP)

- Offline-first iPad app for field sales
- Google Business Profile sync
- AI SEO assistant
- Multi-product bundling for retention
- White-label partner program
- GEO optimization for AI search visibility
