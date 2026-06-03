# Backend Context: Slay Health (website/server)

This document provides a reference to the backend codebase architecture, database models, and authentication system for the **Slay Health** web application.

---

## 🛠️ Technology Stack
* **Runtime:** Node.js (TypeScript) running on Express.
* **ORM:** Prisma ORM connecting to Supabase PostgreSQL.
* **Authentication:** Supabase OAuth JWT validation via signature verification.
* **Dependencies:** `express`, `@prisma/client`, `jsonwebtoken`, `cors`, `dotenv`, and `tsx` (for fast runtime development).

---

## 🔑 Authentication Architecture (OAuth Resource Server)

The Slay Health API operates as an OAuth 2.0 Resource Server. Instead of calling Supabase Auth endpoints over the network for every request, it performs local token verification using the project's cryptographic JWT secret.

### 1. Token Verification Middleware
* **Location:** [authMiddleware.ts](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/server/src/authMiddleware.ts)
* **Mechanics:**
  * Extracts the JWT bearer token from the `Authorization: Bearer <token>` header.
  * Decodes and validates the signature locally using `process.env.SUPABASE_JWT_SECRET` (HS256).
  * Automatically binds decoded user metadata (`sub` as the User UUID, and any custom OAuth `scope` grants) onto the Express request as `req.user`.
  * Protects routes, yielding a `401 Unauthorized` response on validation failures or token expiry.

### 2. Configuration Settings (`.env`)
* **`DATABASE_URL`**: Connects via Supavisor Transaction Pooler (`port: 6543`) with `pgbouncer=true`.
* **`DIRECT_URL`**: Connects via Session Mode (`port: 5432`) for schema migrations.
* **`SUPABASE_JWT_SECRET`**: Private signing key used by the middleware to verify incoming OAuth tokens.

---

## 🗄️ Relational Database Schema

* **File Location:** [schema.prisma](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/server/prisma/schema.prisma)

### Data Models
* **`User`**: Represents the candidate profile. Houses general demographic data, relationship statuses, and marriage timelines. Linked 1-to-1 with a `Lifestyle` record.
* **`Lifestyle`**: Stores detailed physical traits and personal habits (activity levels, steps, sleep cycles, height, weight, waist circumference, cycle data, alcohol/smoking/tobacco statuses). Associated with either a `User` or a `Prospect`.
* **`Prospect`**: Represents the potential matrimonial partner whose health and lifestyle alignment is being evaluated.
* **`Match`**: Defines a pairing between a `User` and a `Prospect`. Holds compatibility parameters like the matching algorithm `score` and completion `status` (`pending`, `ready`, `in-progress`).
* **`Report`**: Individual premarital diagnostic health categories mapped under a `Match` (`pathology`, `radiology`, `genetic`, `mentalHealth`, `lifestyle`). Tracks upload flags for both candidates.

---

## 📁 File Structure & Entrypoints

### 1. [src/index.ts](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/server/src/index.ts)
Main API entry point running on port `4000` (by default). Exposes:
* **`GET /health`** [Public]: Basic API status check.
* **`GET /api/auth/me`** [Protected]: Returns details decoded from the caller's active OAuth token.
* **`GET /api/users`** [Protected]: Returns users along with their `Lifestyle` profiles.
* **`POST /api/users`** [Protected]: Configures new user profiles and embeds lifestyle models.
* **`GET /api/matches`** [Protected]: Fetches matches alongside user, prospect, and report associations.

### 2. [test-oauth.js](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/server/test-oauth.js)
A temporary testing utility that:
* Signs a mock JWT locally using `SUPABASE_JWT_SECRET`.
* Performs query runs against the local server to verify that:
  * Public routes load.
  * Unauthenticated headers are rejected (`401`).
  * Authorized OAuth tokens pass verification (`200`).

---

## 🚀 Running and Managing the Backend

### Installation & Development
```bash
# Install dependencies
npm install

# Run hot-reloading server
npm run dev
```

### Prisma Schema Syncing
```bash
# Push schema updates directly to Supabase PostgreSQL database
npx prisma db push

# Launch Prisma Studio to visually inspect database entries
npx prisma studio
```
