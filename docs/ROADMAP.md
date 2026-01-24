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
| 8 | Appointment Scheduling | P1 | Planned |
| 9 | Review Aggregation | P2 | Planned |
| 10 | Content Self-Service Editor | P2 | Planned |

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

### Description
Built-in scheduling system that integrates with generated sites, allowing customers to book appointments directly.

### Key Features
- Calendar widget for generated sites
- Booking management dashboard
- Email notifications (confirmation, reminder, cancellation)
- Availability settings (business hours, blocked times)
- Timezone support
- Buffer time between appointments
- Booking confirmation flow

---

## Phase 9: Review Aggregation

### Description
Multi-platform review display widget that aggregates and displays business reviews on generated sites.

### Key Features
- Review display widget with multiple layouts
- Support for Google, Yelp, and Facebook reviews
- Review response management
- Rating analytics and trends
- Review request automation
- Filtering and moderation controls

---

## Phase 10: Content Self-Service Editor

### Description
WYSIWYG page editor that allows business owners to update their sites without coding knowledge.

### Key Features
- Drag-and-drop block editing
- Text editing with rich formatting
- Image upload and gallery management
- SEO settings (meta tags, OG tags, schema)
- Publish/draft workflow
- Version history with rollback
- Mobile-responsive editing interface

---

## Future Considerations (Post-MVP)

- Voice input support (Whisper/Fireflies.ai integration)
- Offline-first iPad app for field sales
- Google Business Profile sync
- AI SEO assistant
- Multi-product bundling for retention
- White-label partner program
- GEO optimization for AI search visibility
