Kaayyoo Koof Association Platform

An enterprise-grade Web & Agentic platform engineered to manage community association workflows, financial contributions, event scheduling, and real-time omni-channel notifications via Next.js and Telegram Bot API synchronization.
System Overview

    Frontend Architecture: Next.js 15+ (App Router) leveraging React Server Components (RSC) and Server Actions.

    Database Engine: Neon Serverless PostgreSQL instances paired with Drizzle ORM.

    Authentication & Security: Better Auth ecosystem utilizing JWT tokens via secure server contexts.

    Real-time Integration: Full-duplex Telegram Bot integration serving as an asynchronous user interaction layer.

    Design System: Tailored Tailwind CSS configuration driven by custom typography definitions (Inter/Manrope) and brand-specific semantic color states.

Architecture
Database Schema

The relational schema comprises 10 core tables structured via Drizzle ORM:

├── Authentication Identity Constraints
│   ├── users               # Core user credential mappings
│   ├── sessions            # Stateful session cache tracking
│   ├── accounts            # Federated OAuth and relational linking
│   └── verifications       # Secure token storage for verification flows
└── Application Domains
    ├── members             # Profiles linked to users with strict RBAC states
    ├── contributions       # Financial audit ledger for member dues
    ├── events              # Event entity models and capacity tracking
    ├── event_attendance    # Junction table mapping member registration 
    ├── announcements       # Global communication broadcast entities
    └── telegram_logs       # Webhook ingress payload audit logs

Application Structure

app/
├── (public)/
│   ├── page.tsx                    # Landing view & branding presentation
│   ├── announcements/page.tsx      # Public broadcast feed
│   └── events/page.tsx             # Public scheduling ledger & entry gates
├── (auth)/
│   ├── sign-in/page.tsx            # Access control gates
│   └── sign-up/page.tsx
├── member/                         # Protected Member context
│   ├── page.tsx                    # Core metrics dashboard
│   └── profile/page.tsx            # Self-service profile mutation engine
├── admin/                          # RBAC Restricted Context (Admin Dashboard)
│   ├── page.tsx                    # High-level analytical overview
│   ├── members/page.tsx            # State management for organization users
│   ├── events/page.tsx             # Event mutation engine & capacity controls
│   ├── contributions/page.tsx      # Financial audit trail & ledger view
│   └── announcements/page.tsx      # Target audience message creation view
└── api/
    ├── auth/[...all]/route.ts     # Better Auth REST handler endpoints
    └── telegram/webhook/route.ts   # Edge-compatible Telegram Webhook receiver

System Capabilities
Client Interfaces

    Dynamic Landing Workspace: Performant introduction layout featuring responsive call-to-actions.

    Event Registrations: Real-time event interaction, seat configuration monitoring, and historical event lookups.

    Secure Authentication Blocks: Decoupled register and sign-in matrices built safely around user data requirements.

Portal Operations

    Financial Ledgers: Personal historical ledgers for transparent verification of community contributions.

    Profile Engines: Direct, self-service editing access for identity records and contact settings.

Administrative Governance

    Data Control Panels: Unified lists of systemic profiles featuring inline identity tier changes.

    Ledger Generation Systems: Instant generation of contribution timelines categorized by operational periods and profiles.

    Broadcast Controllers: Outbound dispatch mechanisms pushing real-time content changes to active interfaces.