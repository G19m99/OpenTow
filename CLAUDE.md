# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenTow is a B2B SaaS dispatch platform for towing companies. It's a multi-tenant system with role-based access control where towing companies manage calls, dispatchers assign work, and drivers claim/complete tow calls. Features include call dispatch, driver shift management, impound lot management, and customer tracking.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npx convex dev` — Start Convex backend dev server (run alongside `npm run dev`)
- `npm run build` — Type-check (`tsc -b`) then Vite production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build locally

There is no test runner configured.

## Architecture

### Stack

- **Frontend**: React 19 + TypeScript + React Router 7 + TailwindCSS 4 + shadcn/ui (New York style)
- **Backend**: Convex (serverless database, real-time queries, mutations)
- **Auth**: Google OAuth via `@convex-dev/auth` and `@auth/core`
- **UI**: Dark-only theme with green accents, Geist font, mobile-first layout
- **Deployment**: Netlify

### Directory Layout

- `src/` — Frontend React application
- `convex/` — Backend: schema, queries, mutations, auth config
- `convex/_generated/` — Auto-generated Convex types (gitignored, do not edit)

### Path Aliases

- `@/*` → `./src/*`
- `@c/*` → `./convex/*`

### Multi-Tenancy

Every data query is scoped to a `tenantId`. The `userTenants` junction table links users to organizations with roles. `userSessionTenants` tracks the active tenant per auth session. Use `convex/lib/tenant.ts` helpers (`getCurrentUserTenant`, `getCurrentUserTenantId`) in all backend functions to resolve the current tenant context.

### RBAC (Role-Based Access Control)

Three roles: `admin`, `dispatcher`, `driver`. Roles are stored as an array on `userTenants.roles`. Enforce permissions in Convex functions using helpers from `convex/lib/tenant.ts`: `hasRole()`, `requireRole()`, `requireRoleOrThrow()`, `requireAnyRoleOrThrow()`.

### Routing & Role-Based Views

| Route | Component | Access |
|---|---|---|
| `/login` | SignInForm | Public |
| `/create-tenant` | CreateTenantForm | Authenticated, no tenant |
| `/org-picker` | OrgPicker | Authenticated, multi-org |
| `/` | Dashboard (role-routed) | all roles |
| `/dispatch` | Dispatch | admin, dispatcher |
| `/calls` | CallsList | admin, dispatcher |
| `/calls/:id` | CallDetail | all roles |
| `/available` | AvailableCalls | driver |
| `/my-calls` | MyCalls | driver |
| `/drivers` | Drivers | admin, dispatcher |
| `/users` | UserManagement | admin |
| `/impounds` | Impounds | admin, dispatcher |
| `/settings` | Settings | admin |
| `/profile` | Profile | all roles |

The Dashboard (`/`) renders a role-specific variant: AdminDashboard, DispatcherDashboard, or DriverDashboard.

### Layout

- **Header** (`src/layout/Navbar.tsx`): Sticky top bar with logo, role badge, driver shift toggle, user avatar dropdown
- **MobileNav** (`src/layout/MobileNavbar.tsx`): Fixed bottom nav with role-based items
- No sidebar — mobile-first layout

### Data Flow

- Frontend uses Convex `useQuery`/`useMutation` hooks for reactive, real-time data — no Redux or separate state management.
- Backend functions live in `convex/features/` organized by domain (calls, customers, drivers, impounds, tenants, users, invites), each with `queries.ts` and `mutations.ts`.
- `convex/lib/` contains cross-cutting concerns: `tenant.ts` (permissions/tenant resolution), `callNumber.ts` (sequential call number generation).

### Auth Flow

1. Google OAuth login at `/login`
2. On first login, `afterUserCreatedOrUpdated` callback in `convex/auth.ts` calls `acceptInvite` to auto-link invited users
3. Users without a tenant go to `/create-tenant` or `/org-picker`
4. Active tenant is stored in `userSessionTenants`

### Database Schema

Defined in `convex/schema.ts`. Core tables:

- `tenants`, `userTenants` (with `isOnShift` for drivers), `userSessionTenants`, `invites`
- `calls` — Tow calls with 8 statuses: `open` → `assigned` → `en_route` → `on_scene` → `hooked` → `in_transit` → `completed` | `cancelled`
- `customers` — Customer records linked by phone
- `callStatusHistory` — Audit log of call status changes
- `impounds` — Impound lot management with billing
- Plus Convex auth tables (`users`, `authSessions`, etc.)

Call priorities: `normal`, `urgent`, `emergency`
Service types: `breakdown`, `accident`, `lockout`, `fuel_delivery`, `tire_change`, `jump_start`, `winch_out`, `transport`, `other`

### Shared Components

- `src/components/ui/status-badge.tsx` — StatusBadge, PriorityBadge, ImpoundStatusBadge
- `src/components/calls/CallCard.tsx` — Reusable call card (compact and full modes)
- `src/components/calls/InCallControls.tsx` — Driver call workflow controls (status progression, navigate, call, notes)

### UI Components

shadcn/ui components live in `src/components/ui/`. Config in `components.json` (New York style, zinc base color, lucide icons). Add new components with `npx shadcn@latest add <component>`.

### Key Invariants

1. **Multi-tenancy**: Every table has `tenantId`. Every query filters by it. Every mutation sets it.
2. **Auth**: Google OAuth via `@convex-dev/auth`. Do NOT use localStorage auth.
3. **RBAC**: Roles are arrays on `userTenants`, not a single role on `users`.
4. **Do NOT modify**: `convex/lib/tenant.ts`, `convex/auth.ts`, `convex/http.ts`, `convex/auth.config.ts`, `convex/lib/invites.ts`
