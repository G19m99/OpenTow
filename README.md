# OpenTow

A B2B SaaS dispatch platform for towing companies. Multi-tenant system with role-based access where dispatchers create calls, drivers claim and complete them, and admins manage everything.

## Demo

[Demo hosted on Netlify](https://opentow.netlify.app/)

## Features

- Real-time reactive updates via Convex
- Multi-organization support with tenant switching
- Role-based access control (admin, dispatcher, driver)
- Call dispatch workflow: open → assigned → en route → on scene → hooked → in transit → completed
- Impound lot management with billing tracking
- Driver shift management
- Customer database with phone lookup
- Role-specific dashboards and navigation
- Dark theme UI

## Tech Stack

React 19, TypeScript, React Router 7, TailwindCSS 4, shadcn/ui, Convex, Recharts

## Architecture

### Multi-Tenancy

- Each towing company is a **tenant** with isolated data.
- **Users can belong to multiple tenants**, with tenant-specific roles (admin, dispatcher, driver).
- All domain data (calls, customers, impounds, invites) is **scoped by tenantId**.
- The active tenant is tracked via `userSessionTenants`, allowing seamless org switching.
- Every query and mutation filters by the current tenant to prevent cross-tenant access.

### Authentication & Onboarding

- Authentication via **Google OAuth** using `@convex-dev/auth`.
- On first login:
  - If the user's email matches a pending invite, they are auto-linked to that organization and assigned a role.
  - Otherwise, users land on an onboarding screen to **create a new tenant**.
- Session state is managed by Convex, and protected routes ensure users only access tenant-specific data.

### Role-Based Views

| Role | Pages |
|---|---|
| Admin | Dashboard, Dispatch, Calls, Impounds, Users, Settings |
| Dispatcher | Dashboard, Dispatch, Calls, Impounds |
| Driver | Dashboard, Available Calls, My Calls, Profile |

## Getting Started

### Prerequisites

- Node.js
- A [Convex](https://convex.dev) account
- Google OAuth credentials ([setup guide](https://labs.convex.dev/auth/config/oauth/google))

### Development

```bash
npm install
npx convex dev     # Start Convex backend
npm run dev        # Start Vite dev server
```

### Build

```bash
npm run build      # Type-check + production build
npm run lint       # ESLint
```
