# 💼 Media Masala CRM — Enterprise Production CRM System

[![Live Project](https://img.shields.io/badge/Live-crm.mediaamasala.com-00C853?style=for-the-badge&logo=google-chrome&logoColor=white)](https://crm.mediaamasala.com)
[![GitHub License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](https://github.com/Alfaz-17/MediaaMasala-CRM)
[![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=yellow)](https://next-auth.js.org)

An enterprise-grade Customer Relationship Management (CRM) system engineered for the media production industry. Used daily by ~10–12 staff members to manage sales pipelines, HR workflows, projects, tasks, and analytics.

---

## 🌟 Architectural Features & Design Patterns

### 1. 🔑 4-Level Hierarchical Role-Based Access Control (RBAC)
* **Roles**: `Super Admin` ➔ `Admin/Manager` ➔ `Team Lead` ➔ `Employee`.
* **Hierarchy Scoping**: Access tokens control query scoping. Employees see only their assigned records; Team Leads see their team's records; Admins and Super Admins have global access.
* **Token Implementation**: Secure session state managed via **NextAuth.js** using encrypted JWTs containing user role, team, and department metadata.

### 2. 🗄️ Relational Database Schema Design
* **Engine & ORM**: PostgreSQL database hosted on **Neon.tech** and queried using **Prisma 5 ORM**.
* **Normalization**: The schema includes relations for `Users`, `Roles`, `Teams`, `Leads`, `Projects`, `Tasks`, `Products`, and `Attendance` records.
* **Integrity**: Enforces cascading delete/update constraints, database-level indexes on frequently filtered fields (`lead.status`, `task.dueDate`), and transaction rollbacks during lead-to-project conversions.

### 3. 📊 Analytics Dashboard & Reporting
* **Performance Indicators**: Renders real-time business metrics including sales funnels, project milestones, employee billing hours, and attendance logs.
* **UI Componentry**: Rich widgets built with Tailwind CSS, supporting interactive charts and CSV exports for executive summary reports.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Next.js 14 Frontend] -->|Auth Sessions| NextAuth[NextAuth.js + JWT]
    Client -->|REST API Requests| Express[Node.js/Express.js Backend]
    Express -->|Prisma Queries| Neon[(PostgreSQL - Neon.tech)]
    Express -->|Verify Token| JWT[JWT Validation Layer]
    Express -->|Enforce Hierarchy| RBAC[RBAC Scoping Filter]
```

---

## 📂 Codebase Directory Structure

```bash
MediaaMasala-CRM/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.js             # Seed script for roles, teams, & users
│   ├── src/
│   │   ├── config/             # DB & authentication environment config
│   │   ├── controllers/        # Controllers for Leads, Attendance, Projects
│   │   ├── middlewares/        # Authentication and RBAC scoping middlewares
│   │   ├── routes/             # REST endpoints (auth, users, leads, etc.)
│   │   └── index.ts            # API Server bootstrap
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js 14 App Router layout & pages
│   │   ├── components/         # Dashboard layouts, charts, modals
│   │   ├── hooks/              # Custom React hooks (fetch, validation)
│   │   └── lib/                # API Client and helper utils
│   └── package.json
├── Documentations/             # Detailed guides & manual testing plans
└── README.md
```

---

## 📊 Database Schema Design (Prisma)

Here is a simplified view of the schema relations defined in [schema.prisma](file:///C:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/backend/prisma/schema.prisma):

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
}

model Role {
  id          Int          @id @default(autoincrement())
  name        String       @unique // SuperAdmin, Admin, TeamLead, Employee
  users       User[]
}

model Team {
  id          Int          @id @default(autoincrement())
  name        String       @unique
  users       User[]
  leads       Lead[]
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

### Auth & User Routes
* **`POST /api/auth/login`**: Authenticates user credentials and issues JWT token.
* **`GET /api/users/profile`**: Returns current profile & permission scopes.

### Leads & CRM Pipeline
* **`GET /api/leads`**: Fetches leads scoped by user hierarchy (Employee vs Team Lead vs Admin).
* **`POST /api/leads`**: Registers a new incoming sales lead.
* **`PUT /api/leads/:id/convert`**: Promotes a Qualified lead to a Project (DB transaction).

### HR & Attendance Routes
* **`POST /api/attendance/clock-in`**: Creates attendance record with timestamp.
* **`POST /api/attendance/clock-out`**: Updates attendance record and EOD details.
* **`GET /api/attendance/summary`**: Returns monthly reports for managers.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
* Node.js (v18 or higher)
* PostgreSQL instance (Neon.tech or local)
* Git client

### 2. Configure Backend `.env`
Create a `.env` file in the `/backend` folder:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@ep-neon-db.neon.tech/mediamasala?sslmode=require"
JWT_SECRET="your-jwt-signing-key"
ALLOWED_ORIGINS="http://localhost:3000"
```

### 3. Run Backend Server
```bash
cd backend
npm install
npx prisma db push
npm run seed:demo # Seeds all departments, roles, test accounts, and 50+ leads for demo
npm run dev
```

### 4. Configure Frontend `.env`
Create a `.env` file in the `/frontend` folder:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-encryption-secret"
```

### 5. Run Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔒 Default Login Credentials

For manual testing and verification, you can use the following seeded accounts. 
Password for all accounts (except `mediaamasala@gmail.com`) is **`Password@123`**.

### 1. System Administrators (Global Scope)
* **Super Admin**: `superadmin@media-masala.com` (Password: `Password@123`)
* **Admin**: `mediaamasala@gmail.com` (Password: `mediaa@crm07`)

### 2. Department & Role Hierarchies
Here are representative test accounts for demonstrating the 4-level Hierarchical RBAC:

| Department | Role | Email | Password |
|---|---|---|---|
| **Administration** | Admin | `superadmin@media-masala.com` | `Password@123` |
| **Administration** | Admin | `mediaamasala@gmail.com` | `mediaa@crm07` |
| **Administration** | HR Manager | `raviparmar11102001@gmail.com` | `Password@123` |
| **Sales** | Business Development Executive (BDE) | `darshraj@gmail.com` | `Password@123` |
| **Sales** | Relationship Manager (RM) | `kiranchoudhary5931@gmail.com` | `Password@123` |
| **Product** | Product Manager (PM) | `bhargavmg@gmail.com` | `Password@123` |
| **Product** | Product Architect (PROD_ARC) | `alfazb@gmail.com` | `Password@123` |
| **Creative** | Head of Creative | `krishishah@gmail.com` | `Password@123` |
| **Creative** | UI/UX Designer | `danish@gmail.com` | `Password@123` |
| **Operations** | Operations Manager (OM) | `rpdesigner36@gmail.com` | `Password@123` |
| **Project** | Project Manager (PROJ_M) | `jaiswaltanu1705@gmail.com` | `Password@123` |

---

## 🧪 Manual Testing & Demo Guide

To explain and demonstrate the CRM during your interview, follow these testing scenarios:

### Scenario 1: Hierarchical RBAC Verification (Leads & Tasks Scoping)
1. **Login as Admin** (`superadmin@media-masala.com` / `Password@123`):
   - Navigate to the **Leads** or **Tasks** module.
   - Verify you can see all records in the system across all departments.
2. **Login as a BDE** (`darshraj@gmail.com` / `Password@123`):
   - Navigate to **Leads**.
   - Verify that this employee only sees their own assigned leads (scoping prevents seeing other employees' leads).
3. **Login as a Product Manager** (`bhargavmg@gmail.com` / `Password@123`):
   - Navigate to **Products**.
   - Verify you can manage products and see tasks specific to the Product department.

### Scenario 2: HR Workflow (Attendance & Leave Request)
1. **Clock-In**:
   - Login as any user (e.g. `danish@gmail.com` / `Password@123`).
   - Click **Clock In** on the dashboard. Verify that it logs the current time and location.
2. **Apply for Leave**:
   - Go to the **Leaves** tab and click **Request Leave**.
   - Fill in details (type, dates, reason) and submit.
3. **Approve Leave**:
   - Login as Admin (`superadmin@media-masala.com` / `Password@123`).
   - Go to **Leaves** -> **Pending Requests**.
   - Approve the leave request, and verify that the status changes to **Approved**.

### Scenario 3: Daily EOD Reporting
1. **Submit EOD**:
   - Login as `danish@gmail.com` / `Password@123`.
   - Go to **EOD Reports** and click **Submit EOD**.
   - Verify that your EOD report appears in your list.
2. **Review EOD**:
   - Login as Admin.
   - Go to **Reports** -> **EOD Reports** to view submissions from all staff.

---

## 🚀 Deployment Guide

Follow these steps to deploy the project to production on **Vercel** and **Render**:

### 1. Database Setup (Production)
Choose a PostgreSQL provider (e.g., **Neon.tech**, **Supabase**, or **Render PostgreSQL**).
1. Create a database instance and copy the connection string (`DATABASE_URL`).
2. Run database migrations to initialize tables:
   ```bash
   cd backend
   DATABASE_URL="your-production-database-url" npx prisma migrate deploy
   ```

### 2. Backend Deployment on Render
1. Create a new **Web Service** on Render and connect your repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment/Language**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `node dist/server.js`
3. Add the following **Environment Variables**:
   - `DATABASE_URL`: `your-production-postgresql-url`
   - `JWT_SECRET`: `your-secure-jwt-secret-string`
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
   - `NODE_ENV`: `production`
   - `PORT`: `4000`

### 3. Frontend Deployment on Vercel
1. Create a new project on Vercel and import your repository.
2. Configure settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
3. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api`
   - `NEXTAUTH_URL`: `https://your-frontend.vercel.app`
   - `NEXTAUTH_SECRET`: `your-secure-nextauth-secret-string` (Generate using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
4. Click **Deploy**.

---

## 📄 Documentation Links
* [Full System Architecture Specification](file:///C:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/Doumentations/Media_Masala_CRM_System_Documentation.md)
* [Hierarchy Scoping Protocol & Rules](file:///C:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/Doumentations/Hierarchy_Scoping_Explained.md)
* [Manual QA Testing Guide](file:///C:/Users/alfaz/OneDrive/Desktop/Media-masala%20projects/Mediaa-masala-CRM/Doumentations/Sales_Hierarchy_Manual_Testing.md)
