# RapidBooth Roadmap

## Phase Overview

| Phase | Feature | Priority | Status |
|-------|---------|----------|--------|
| 1 | Project Foundation & Marketing Site | P0 | Complete |
| 2 | Conversational Intake Engine | P0 | Complete |
| 3 | AI Site Generator | P0 | Planned |
| 4 | Live Preview System | P0 | Planned |
| 5 | Deployment Service | P0 | Planned |
| 6 | Rep Dashboard & Analytics | P1 | Planned |
| 7 | Billing & Stripe Integration | P1 | Planned |
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

### Description
Component library with vertical-specific templates assembled dynamically based on intake data. Claude API generates content tailored to the business.

### Key Features
- Component library (hero, nav, footer, contact, services, gallery, testimonials, about)
- 4 vertical templates (home services, restaurant, professional services, retail)
- AI-generated content (headlines, descriptions, CTAs)
- Theme customization (colors, fonts, spacing)
- Responsive output

---

## Phase 4: Live Preview System

### Description
Real-time site preview that updates as the intake progresses. Users see their site build in real-time with responsive preview options.

### Key Features
- Iframe-based live rendering
- Mobile/desktop/tablet preview toggle
- Component arrangement controls
- Theme/style customization panel
- Real-time updates during intake

---

## Phase 5: Deployment Service

### Description
Automated deployment of generated sites to subdomains with SSL provisioning and DNS configuration.

### Key Features
- One-click deployment to subdomain
- SSL certificate provisioning
- Deployment status tracking and history
- Site management (start/stop/update)
- Custom domain support
- DNS configuration guidance

---

## Phase 6: Rep Dashboard & Analytics

### Description
Dashboard for sales reps to track sessions, manage client pipeline, and view performance metrics.

### Key Features
- Sales session list with status tracking
- Client pipeline (lead → prospect → customer)
- Revenue analytics with charts
- Rep performance metrics
- Session history with conversation logs
- Filter and search functionality

---

## Phase 7: Billing & Stripe Integration

### Description
Stripe-powered subscription management for the $30/month plan.

### Key Features
- Stripe Checkout for new subscriptions
- Customer portal for self-service management
- Invoice history and PDF downloads
- Payment method management
- Subscription lifecycle (create/update/cancel)
- Webhook handling for payment events
- Usage-based billing metrics

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
