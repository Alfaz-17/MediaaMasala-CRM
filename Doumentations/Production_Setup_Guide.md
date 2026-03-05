# Media Masala CRM — Production Setup Guide

**Repository**: https://github.com/mediamasaala-max/MediaaMasala-CRM.git  
**Date**: March 6, 2026  
**Branch**: `main`

---

## 1. Clone & Install

```bash
git clone https://github.com/mediamasaala-max/MediaaMasala-CRM.git
cd MediaaMasala-CRM
```

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## 2. Environment Variables

### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
# Database — PostgreSQL (Neon.tech or any PostgreSQL provider)
DATABASE_URL=postgresql://username:password@host:5432/database_name?sslmode=require

# JWT — Used for signing authentication tokens (48hr expiry)
JWT_SECRET=<generate-a-strong-random-string>

# Server
PORT=4000
NODE_ENV=production

# CORS — Comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL — Must end with /api
NEXT_PUBLIC_API_URL=https://your-backend-domain.onrender.com/api

# NextAuth — Session management
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
NEXTAUTH_SECRET=<generate-a-strong-random-string>
```

> ⚠️ `NEXTAUTH_SECRET` and `JWT_SECRET` should be different, strong random strings (32+ chars).  
> Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 3. Database Setup

Run from inside the `backend/` directory:

```bash
cd backend

# Run all migrations (creates tables & enums)
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed default data (admin user, roles, departments, permissions)
npx prisma db seed
```

### Default Admin Login (created by seed)

| Field | Value |
|-------|-------|
| Email | `superadmin@media-masala.com` |
| Password | `Password@123` |

---

## 4. Running Locally

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
# → Runs on http://localhost:4000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# → Runs on http://localhost:3000
```

---

## 5. Production Deployment

### Backend → Render (or any Node.js host)

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `node dist/server.js` |
| **Environment** | Set all backend `.env` variables in the dashboard |

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework** | Next.js (auto-detected) |
| **Build Command** | `npm run build` |
| **Environment** | Set all frontend `.env` variables in the dashboard |

---

## 6. Pending Migration (CRITICAL)

The latest commit includes a schema change that adds new `LeaveType` enum values (`Vacation`, `Personal`, `Other`). This migration **must be applied to the production database**:

```bash
cd backend
npx prisma migrate deploy
```

Without this, leave requests with type "Vacation" will crash.

---

## 7. Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14 + React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js + TypeScript |
| Database | PostgreSQL (Neon.tech recommended) |
| ORM | Prisma 5 |
| Auth | NextAuth.js (frontend) + JWT (backend, 48hr expiry) |
| State | TanStack React Query |
| UI | Radix UI + Lucide Icons |

---

## 8. Project Structure

```
MediaaMasala-CRM/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema (16 models, 7 enums)
│   │   └── seed.ts            # Seed script (admin, roles, permissions)
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth + error handling
│   │   ├── routes/            # API routes (12 modules)
│   │   ├── utils/             # RBAC helpers, permission utils
│   │   └── server.ts          # Express entry point
│   └── .env.example           # Environment variable template
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages (App Router)
│   │   ├── components/        # UI components + layout
│   │   ├── hooks/             # Custom hooks (permissions, etc.)
│   │   └── lib/               # API client, auth config
│   └── .env.example           # Environment variable template
│
├── Doumentations/             # Full system documentation
├── README.md
└── .gitignore
```

---

## 9. Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login (returns JWT + user + permissions) |
| `/api/auth/register` | POST | Register new user |
| `/api/leads` | GET/POST | Lead management |
| `/api/tasks` | GET/POST | Task management |
| `/api/projects` | GET/POST | Project management |
| `/api/products` | GET/POST | Product catalog |
| `/api/attendance` | GET/POST | Clock in/out |
| `/api/leaves` | GET/POST | Leave requests |
| `/api/eod` | GET/POST | Daily reports |
| `/api/admin/employees` | GET/POST | Employee management |
| `/api/dashboard/stats` | GET | Dashboard KPIs |
| `/api/reports/*` | GET | Sales/productivity/attendance reports |
| `/health` | GET | Health check |

All endpoints except `/auth/login`, `/auth/register`, and `/health` require a `Bearer` token in the `Authorization` header.

---

*For detailed API documentation, RBAC matrix, and business logic, see:*  
**[Full System Documentation](Doumentations/Media_Masala_CRM_System_Documentation.md)**
