# OpenTow

A B2B SaaS platform designed for towing companies, implementing an open dispatch model where drivers can claim jobs on a first-come, first-served basis

## Demo

coming soon!

## Features

- Real-time with reactive updates
- Multi-organization support
- Role-based access per tenant (admin, dispatcher, driver)

## Tech Stack

React, Typescript, Redux, TailwindCSS, Convex

## Architecture & Authentication

This SaaS platform supports multiple organizations (tenants), each with isolated data and user roles. The backend is powered by [Convex](https://convex.dev), and user authentication is handled via Google OAuth.

### Multi-Tenancy

- Each towing company is represented as a **tenant**.
- **Users can belong to multiple tenants**, with tenant-specific roles (e.g., admin, dispatcher, driver).
- All domain data (jobs, users, invites) is **scoped by tenantId** to ensure strict data isolation.
- The current tenant is tracked via `currentTenantId` on the user record, allowing seamless context switching.
- Queries and mutations are automatically filtered by the current tenant to prevent cross-tenant access.

### Authentication & Onboarding

- Authentication is done via **Google OAuth**, using Convex Auth.
- Upon first login:
  - If the user's email matches a pending invite (by email + tenant), they are auto-linked to that organization and assigned a role.
  - If no invite is found, users land on an onboarding screen to **create a new tenant** or (in future) **request access** to an existing one.
- Session state is managed by Convex, and protected routes ensure users only access tenant-specific data.

## Google OAuth setup

In order to use the google auth follow the instructions [here](https://labs.convex.dev/auth/config/oauth/google)
