# Media Masala CRM

A full-featured Customer Relationship Management system built for the media production industry.

## Features

- **Sales Pipeline** — Lead generation, tracking, assignment, and conversion
- **Project Management** — Project lifecycle from lead conversion to completion
- **Task Management** — Task creation, assignment, tracking, and completion
- **Product Catalog** — Product registry with categorization
- **HR Operations** — Employee attendance, leave management, and EOD reporting
- **Analytics & Reports** — Sales funnel, productivity, and attendance analytics
- **Administration** — Employee onboarding, role management, and permission configuration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React 18 + TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Neon.tech) |
| ORM | Prisma 5 |
| Auth | NextAuth.js + JWT |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon.tech](https://neon.tech) account)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mediamasaala-max/MediaaMasala-CRM.git
   cd MediaaMasala-CRM
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # Configure your DATABASE_URL, JWT_SECRET
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env   # Configure NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET
   npm run dev
   ```

4. **Access the app** at `http://localhost:3000`

### Default Login

| Field | Value |
|-------|-------|
| Email | `superadmin@media-masala.com` |
| Password | `Password@123` |

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 4000) |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins |

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g. `http://localhost:4000/api`) |
| `NEXTAUTH_URL` | Frontend base URL |
| `NEXTAUTH_SECRET` | NextAuth session encryption key |

## Deployment

- **Backend** → [Render](https://render.com) (Node.js)
- **Frontend** → [Vercel](https://vercel.com) (Next.js)

See [full system documentation](Doumentations/Media_Masala_CRM_System_Documentation.md) for detailed deployment instructions.

## Documentation

Full documentation is available in the [`Doumentations/`](Doumentations/) directory:
- [System Documentation](Doumentations/Media_Masala_CRM_System_Documentation.md) — Complete API reference, database design, RBAC, and deployment guide
- [Hierarchy Scoping](Doumentations/Hierarchy_Scoping_Explained.md) — How team/department scoping works
- [Testing Guide](Doumentations/Sales_Hierarchy_Manual_Testing.md) — Manual testing procedures

## License

Proprietary — Media Masala © 2026
