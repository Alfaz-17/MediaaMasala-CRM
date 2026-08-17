# 💼 Media Masala CRM — Enterprise Production CRM System

<div align="center">

[![Live Project](https://img.shields.io/badge/Live_App-crm.mediaamasala.com-00C853?style=for-the-badge&logo=google-chrome&logoColor=white)](https://crm.mediaamasala.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](https://github.com/Alfaz-17/MediaaMasala-CRM)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma_5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=yellow)](https://next-auth.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**An enterprise-grade Customer Relationship & Resource Management System custom-engineered for media production companies.**  
*Powers daily sales pipelines, team hierarchies, HR attendance tracking, project lifecycle workflows, and real-time business analytics.*

[Explore Live Demo](https://crm.mediaamasala.com) • [API Documentation](#-api-reference) • [Setup Guide](#-installation--setup) • [Test Accounts](#-default-login-credentials)

</div>

---

## 💡 System Overview

**Media Masala CRM** solves multi-department operational fragmentation by centralizing lead distribution, employee scoping, daily attendance logging, project conversion, and executive analytics into a unified web platform. Designed for production teams (~10–50 employees), it features a granular **4-Level Hierarchical Role-Based Access Control (RBAC)** model ensuring absolute data isolation across roles.

### 🌟 Key Platform Highlights
- **🔒 Hierarchical Data Scoping**: Automatic query filtering enforcing record-level visibility (`SuperAdmin` ➔ `Admin/Manager` ➔ `Team Lead` ➔ `Employee`).
- **📈 End-to-End Sales Pipeline**: Full lead lifecycle tracking, automated lead-to-project conversions via transactional DB operations.
- **⏱️ HR & Attendance System**: Live clock-in/clock-out timestamps, geo/IP logging, leave application approvals, and monthly summary metrics.
- **📝 Automated EOD Reporting**: Structured daily end-of-day submission workflows for staff and review panels for department heads.
- **💼 Products & Portfolio Directory**: Product catalog, client project milestones, task assignments, and budget metrics.

---

## 🖥️ Interactive Screenshots

| Analytics & Executive Dashboard | RBAC & Permission Matrix |
| :---: | :---: |
| ![System Dashboard](./Screen%20Shots/Screenshot%202026-08-01%20140129.png) | ![App Permissions Matrix](./Screen%20Shots/Screenshot%202026-08-01%20140206.png) |
| *Real-time metrics, lead pipelines & activity logs* | *Role-based resource permissions & route scoping* |

| Software Products Catalog | System Configuration Settings |
| :---: | :---: |
| ![Software Products Management](./Screen%20Shots/Screenshot%202026-08-01%20140145.png) | ![System Settings](./Screen%20Shots/Screenshot%202026-08-01%20140217.png) |
| *Product listings & team allocation* | *Global app configurations & department settings* |

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend Layer (Next.js 14 App Router)"]
        UI[UI Components & Dashboard Pages]
        AuthClient[NextAuth.js Session Provider]
    end

    subgraph Security ["Security & Auth Layer"]
        JWT[Encrypted JWT Bearer Tokens]
        RBAC[Hierarchical RBAC Middleware]
    end

    subgraph Backend ["Backend API Layer (Express.js + TypeScript)"]
        Routes[REST API Endpoints]
        Controllers[Business Logic Controllers]
        Prisma[Prisma ORM Client]
    end

    subgraph Storage ["Database Layer"]
        Neon[(PostgreSQL Database on Neon.tech)]
    end

    UI -->|Session Handshake| AuthClient
    UI -->|Authenticated REST Requests| Routes
    Routes --> JWT
    JWT --> RBAC
    RBAC --> Controllers
    Controllers --> Prisma
    Prisma --> Neon
```

---

## 🔑 4-Level Hierarchical RBAC Model

The system strictly enforces data isolation at the API middleware layer:

```
┌─────────────────────────────────────────────────────────┐
│ 1. Super Admin  : Global access across all departments   │
├─────────────────────────────────────────────────────────┤
│ 2. Admin/Manager: Department-wide & cross-team oversight │
├─────────────────────────────────────────────────────────┤
│ 3. Team Lead    : Scoped exclusively to assigned team   │
├─────────────────────────────────────────────────────────┤
│ 4. Employee     : Scoped exclusively to self-owned data  │
└─────────────────────────────────────────────────────────┘
```

- **Query Injection**: Middleware injects user role, department ID, and team ID into Prisma dynamic query filters (`where: { userId: currentUserId }`).
- **Token Security**: Tokens are signed using secret keys with automated expiration and refresh handling via NextAuth.

---

## 📂 Repository Structure

```bash
MediaaMasala-CRM/
├── backend/
│   ├── prisma/
│   │   ├── migrations/         # PostgreSQL schema migration histories
│   │   ├── schema.prisma       # Prisma ORM models & relationships
│   │   ├── seed.ts             # Department & default user seeds
│   │   └── seed_demo.ts        # Comprehensive demo seed data (50+ leads)
│   ├── src/
│   │   ├── config/             # DB & auth environment configurations
│   │   ├── controllers/        # Lead, Project, Task, Attendance logic
│   │   ├── middleware/         # Auth verification & RBAC scoping engine
│   │   ├── routes/             # REST endpoints (auth, leads, tasks, etc.)
│   │   ├── utils/              # Permission checks, loggers, custom errors
│   │   └── server.ts           # Express server bootstrap
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js 14 App Router layout & views
│   │   ├── components/         # UI components, data tables, modals, cards
│   │   ├── hooks/              # Custom React hooks (permissions, table filters)
│   │   ├── lib/                # API client, NextAuth configuration, utils
│   │   └── types/              # NextAuth & API response type definitions
│   ├── package.json
│   └── tailwind.config.ts
├── Doumentations/              # Comprehensive System Spec & QA Guides
├── Screen Shots/               # Dashboard screenshots & UI assets
└── README.md
```

---

## 📊 Relational Database Schema (Prisma)

Below is an overview of the core Prisma schema relationships defined in [`schema.prisma`](file:///c:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/backend/prisma/schema.prisma):

```prisma
model User {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  password    String
  name        String
  roleId      Int
  role        Role         @relation(fields: [roleId], references: [id])
  teamId      Int?
  team        Team?        @relation(fields: [teamId], references: [id])
  leads       Lead[]       @relation("AssignedLeads")
  tasks       Task[]       @relation("AssignedTasks")
  attendance  Attendance[]
  eodReports  EodReport[]
}

model Role {
  id          Int          @id @default(autoincrement())
  name        String       @unique // SuperAdmin, Admin, TeamLead, Employee
  users       User[]
}

model Lead {
  id          Int          @id @default(autoincrement())
  title       String
  status      String       // New, Contacted, Qualified, Proposal, Won, Lost
  assignedTo  User?        @relation("AssignedLeads", fields: [userId], references: [id])
  userId      Int?
  teamId      Int?
  team        Team?        @relation(fields: [teamId], references: [id])
  project     Project?
}

model Project {
  id          Int          @id @default(autoincrement())
  name        String
  leadId      Int          @unique
  lead        Lead         @relation(fields: [leadId], references: [id])
  status      String       // InProgress, OnHold, Completed
  tasks       Task[]
}
```

---

## 📡 API Reference

### 🔐 Authentication & Profile
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and issues JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieves active user profile and permission scope |

### 📈 Leads & Sales Pipeline
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leads` | Scoped | Lists leads filtered by hierarchical user permissions |
| `POST` | `/api/leads` | Employee+ | Registers a new sales lead in the system |
| `PUT` | `/api/leads/:id` | Assigned / Admin | Updates lead details or status pipeline stage |
| `PUT` | `/api/leads/:id/convert` | Manager+ | Converts a Qualified Lead into a Project (DB Transaction) |

### ⏱️ HR, Attendance & EOD
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/clock-in` | Authenticated | Logs clock-in timestamp and IP location |
| `POST` | `/api/attendance/clock-out` | Authenticated | Logs clock-out timestamp and daily summary |
| `POST` | `/api/eod` | Authenticated | Submits Daily End-of-Day report |
| `GET` | `/api/reports/eod` | Manager+ | Views EOD reports submitted across departments |

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm` (v9+)
- **Database**: PostgreSQL (Hosted on [Neon.tech](https://neon.tech) or Local Instance)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/backend`:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://user:password@ep-neon-db.neon.tech/mediamasala?sslmode=require"
   JWT_SECRET="your-secure-jwt-secret-key"
   ALLOWED_ORIGINS="http://localhost:3000"
   ```
4. Push Prisma schema & seed demo data:
   ```bash
   npx prisma db push
   npm run seed:demo
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/frontend`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000/api"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secure-nextauth-encryption-secret"
   ```
4. Launch the frontend development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Default Test Accounts

Use these seeded test accounts to test hierarchical access control:

> [!NOTE]
> Standard password for all seeded accounts (except Admin) is **`Password@123`**.

| Department | Role | Email | Password | Scope Level |
| :--- | :--- | :--- | :--- | :--- |
| **Administration** | Super Admin | `superadmin@media-masala.com` | `Password@123` | Global System Access |
| **Administration** | Admin | `mediaamasala@gmail.com` | `mediaa@crm07` | Global System Access |
| **Administration** | HR Manager | `raviparmar11102001@gmail.com` | `Password@123` | HR & Staff Access |
| **Sales** | BDE Executive | `darshraj@gmail.com` | `Password@123` | Assigned Leads Only |
| **Sales** | Relationship Manager | `kiranchoudhary5931@gmail.com` | `Password@123` | Team Scoped Access |
| **Product** | Product Architect | `alfazb@gmail.com` | `Password@123` | Product & Spec Access |
| **Creative** | UI/UX Designer | `danish@gmail.com` | `Password@123` | Creative Team Access |
| **Project** | Project Manager | `jaiswaltanu1705@gmail.com` | `Password@123` | Project Portfolio Scoped |

---

## 🧪 Manual QA Testing Scenarios

### Scenario 1: RBAC Hierarchy Scoping
1. Log in as **Super Admin** (`superadmin@media-masala.com`). Verify full visibility of all leads, tasks, and system settings across departments.
2. Log in as **BDE Executive** (`darshraj@gmail.com`). Verify that only sales leads assigned specifically to this user are displayed in the Leads view.

### Scenario 2: Attendance & Leave Workflow
1. Log in as **UI/UX Designer** (`danish@gmail.com`). Click **Clock In** on the dashboard header.
2. Navigate to **Leaves** -> **Request Leave** and submit a vacation request.
3. Log in as **Super Admin**, navigate to **Leaves** -> **Pending Requests**, and approve the request.

---

## 🚀 Production Deployment

### 1. Database Migrations
```bash
cd backend
DATABASE_URL="your-production-postgresql-url" npx prisma migrate deploy
```

### 2. Render Deployment (Backend Service)
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `node dist/server.js`

### 3. Vercel Deployment (Frontend Next.js)
- **Root Directory**: `frontend`
- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build`

---

## 📄 Deep Documentation Links
- 📘 [Full System Architecture Specification](file:///c:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/Doumentations/Media_Masala_CRM_System_Documentation.md)
- 🔒 [Hierarchy Scoping Protocol & Middleware Rules](file:///c:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/Doumentations/Hierarchy_Scoping_Explained.md)
- 🧪 [Manual QA Testing Suite](file:///c:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/Doumentations/Sales_Hierarchy_Manual_Testing.md)

---

<div align="center">
  <sub>Built with ❤️ by Media Masala Engineering Team • Built for scale</sub>
</div>
