# Traveloop

Traveloop is a full-stack travel planning app built with Next.js 15, Prisma, Auth.js, Tailwind CSS, shadcn-style primitives, and server actions.

## Project Structure

- `app/` contains routes, metadata, loading states, error boundaries, and API route handlers.
- `components/` contains reusable UI primitives, layout shells, and the marketing homepage.
- `features/` contains domain modules for dashboard, trips, itinerary, budget, checklist, journal, and profile.
- `lib/` contains Prisma, auth, validation schemas, and shared utilities.
- `actions/` contains server actions for secure mutations.
- `prisma/` contains the relational schema, seed data, and Prisma client generation.

## Prisma Design

The schema is normalized around `User`, `Trip`, `TripStop`, `Activity`, `TripActivity`, `Budget`, `Expense`, `Checklist`, `ChecklistItem`, `JournalEntry`, `SharedTrip`, `Destination`, and `ActivityCategory`.

- `Trip` is the owning aggregate root for itinerary, budget, checklist, journal, and sharing.
- `TripStop` stores the ordered city sequence and links stops to `Destination` when known.
- `TripActivity` bridges planned trip timing with the catalog of activities.
- `Budget` is one-to-one with `Trip` and rolls up `Expense` rows for analytics.
- `Checklist` is one-to-one with `Trip` and contains packed-state line items.
- `SharedTrip` provides the public slug and read-only publishing state.
- `Destination` and `ActivityCategory` power search, filters, and destination cards.

## Neon Setup

1. Create a Neon PostgreSQL database.
2. Copy the connection string into `DATABASE_URL`.
3. Run `npx prisma migrate dev --name init` to create the schema.
4. Run `npx prisma db seed` to load demo destinations, categories, and a sample trip.

## Authentication Setup

- Auth uses NextAuth/Auth.js with credentials-based email/password sign-in.
- Passwords are hashed with bcryptjs before persisting.
- Sessions use secure JWT cookies and the Prisma adapter for durable account records.
- Protected routes redirect unauthenticated visitors to `/login`.

## UI Architecture

- The landing page is a client marketing surface with motion, testimonials, and a CTA.
- Auth pages are isolated in the `(auth)` route group.
- Protected app pages share the `AppShell` layout with a responsive sidebar and topbar.
- Feature code lives in domain-specific folders so trip, itinerary, budget, checklist, journal, and profile logic stay separate.

## Feature Flow

### Landing Page
- Hero, feature cards, testimonials, and CTA sections introduce the product.
- Motion is handled by Framer Motion and the visual language uses glassmorphism and layered gradients.

### Dashboard
- `app/dashboard/page.js` checks the session, loads the shell, and renders summary cards plus quick actions.

### Trip CRUD
- `features/trips/trip-form.js` validates input with React Hook Form + Zod and submits to a server action.
- `actions/trip-actions.js` creates trips inside a Prisma transaction and also creates the budget, checklist, and share record.
- Duplicate, update, and delete paths are implemented as server actions and route handlers.

### Itinerary System
- `features/itinerary/itinerary-board.js` uses Framer Motion reorder mechanics for stop sequencing.
- `app/api/destinations/route.js` and `app/api/activities/route.js` support debounced search and filtering.

### Budget Analytics
- `Budget` stores the aggregate totals for a trip.
- `Expense` rows capture the detailed spend breakdown.
- The budget page aggregates category totals for the pie chart view.

### Sharing System
- Public itineraries are exposed through `/share/[shareId]`.
- Read-only pages use the `SharedTrip` slug and the public flag.

### Journal and Checklist
- Checklist items use optimistic UI updates plus a server action to persist packed state.
- Journal entries save through a server action from the trip journal screen.

## Environment Variables

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_MAPS_API_KEY`
- `OPENWEATHER_API_KEY`
- `RESEND_API_KEY`

## Setup Commands

1. Install dependencies.
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `NEXTAUTH_SECRET`.
3. Run `npx prisma migrate dev --name init`.
4. Run `npx prisma db seed`.
5. Start the app with `npm run dev`.

## Demo account

- Email: `demo@traveloop.app`
- Password: `traveloop123`

## Deployment Guide

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the production `DATABASE_URL` to Neon.
4. Set `NEXTAUTH_URL` to the Vercel domain.
5. Set `NEXTAUTH_SECRET` and any optional API keys.
6. Run the Prisma migration and seed commands in the deployment workflow or during initial provisioning.

## Improvement Roadmap

- AI itinerary suggestions powered by travel preferences and trip context.
- Weather, Google Maps, and currency conversion integrations.
- Expense splitting and collaborative editing.
- Offline-first PWA support for journals and checklists.
- PDF export for itineraries and trip summaries.