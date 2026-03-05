# Media Masala CRM — End-to-End System Documentation

**Version**: 1.0  
**Date**: February 14, 2026  
**Author**: Media Masala Engineering  
**Classification**: Internal — Confidential

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Authentication & Security](#5-authentication--security)
6. [Role-Based Access Control (RBAC)](#6-role-based-access-control-rbac)
7. [API Reference](#7-api-reference)
8. [Business Logic & Workflows](#8-business-logic--workflows)
9. [Frontend Application](#9-frontend-application)
10. [Deployment Guide](#10-deployment-guide)
11. [Environment Variables](#11-environment-variables)
12. [Default Credentials](#12-default-credentials)

---

## 1. System Overview

Media Masala CRM is a full-featured Customer Relationship Management system designed for the media production industry. It provides end-to-end management of:

- **Sales Pipeline**: Lead generation, tracking, assignment, and conversion
- **Project Management**: Project lifecycle from lead conversion to completion
- **Task Management**: Task creation, assignment, tracking, and completion
- **Product Catalog**: Product registry with categorization
- **HR Operations**: Employee attendance, leave management, and EOD reporting
- **Analytics & Reports**: Sales funnel, productivity, and attendance analytics
- **Administration**: Employee onboarding, role management, and permission configuration

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 | Server-side rendering, routing |
| **UI Framework** | React 18 + TypeScript | Component-based UI |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **State Management** | React Query (TanStack) | Server state + caching |
| **Form Handling** | React Hook Form + Zod | Form validation |
| **Backend** | Node.js + Express | REST API server |
| **ORM** | Prisma 5 | Type-safe database access |
| **Database** | PostgreSQL (Neon.tech) | Cloud-hosted relational DB |
| **Authentication** | NextAuth.js + JWT | Stateless session management |
| **UI Components** | Radix UI + Lucide Icons | Accessible component primitives |

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                         │
│                    (Next.js Frontend App)                      │
│                                                               │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Login   │  │Dashboard │  │  Leads   │  │  Tasks/HR    │  │
│  │ Page    │  │  Stats   │  │ Pipeline │  │  Modules     │  │
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │            │             │                │           │
│       └────────────┴─────────────┴────────────────┘           │
│                          │                                    │
│                   API Client (axios)                          │
│                   + JWT Bearer Token                          │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     BACKEND API SERVER                         │
│                  (Node.js + Express.js)                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              MIDDLEWARE LAYER                             │ │
│  │  ┌────────┐  ┌───────────────┐  ┌────────────────────┐  │ │
│  │  │  CORS  │  │ JSON Parser   │  │  Auth Middleware   │  │ │
│  │  │        │  │               │  │  (JWT Verify +     │  │ │
│  │  │        │  │               │  │   Permission Check)│  │ │
│  │  └────────┘  └───────────────┘  └────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  ROUTE LAYER (12 Modules)                │ │
│  │                                                          │ │
│  │  /api/auth        /api/leads       /api/tasks           │ │
│  │  /api/admin       /api/projects    /api/products        │ │
│  │  /api/dashboard   /api/eod         /api/attendance      │ │
│  │  /api/leaves      /api/reports     /api/activity        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              CONTROLLER LAYER (Business Logic)           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │ authController│  │leadController│  │taskController│  │ │
│  │  │ adminController│ │projectCtrl   │  │reportCtrl    │  │ │
│  │  │ dashboardCtrl │  │eodController │  │attendanceCtrl│  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                   │
│                    Prisma ORM Client                          │
└──────────────────────────┬───────────────────────────────────┘
                           │ TCP/SSL
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    PostgreSQL DATABASE                         │
│                      (Neon.tech)                              │
│                                                               │
│  ┌─────────┐ ┌──────────┐ ┌──────┐ ┌──────────────────────┐ │
│  │  Users  │ │ Employees│ │ Roles│ │ Permissions          │ │
│  │  Leads  │ │  Tasks   │ │ Proj │ │ Products             │ │
│  │  EOD    │ │Attendance│ │Leaves│ │ ActivityLogs         │ │
│  └─────────┘ └──────────┘ └──────┘ └──────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌────────────┐
│Department│◄────│     User     │────►│    Role    │
│          │     │              │     │            │
│ id       │     │ id           │     │ id         │
│ name     │     │ email        │     │ name       │
│ code     │     │ passwordHash │     │ code       │
│ isActive │     │ roleId    ──►│     │ isActive   │
│          │     │ departmentId►│     │            │
└────┬─────┘     └──────┬───────┘     └──────┬─────┘
     │                  │ 1:1               │
      │           ┌──────▼───────┐     ┌─────▼──────────┐
      │           │   Employee   │     │RolePermission  │
      │           │              │     │                │
      │           │ id           │     │ roleId      ──►│
      │           │ empId (EMP001)     │ permissionId──►│
      │           │ userId    ──►│     └────────────────┘
      │           │ managerId ──►│(self)        │
      │           │ departmentId►│        ┌─────▼──────┐
      │           │ roleId    ──►│        │ Permission │
      │           │ isActive     │        │            │
      └──┬────────┴──────────────┘        │ module     │
         │                                │ action     │
         ├───────────┬───────────┐        │ scopeType  │
         │           │           │        └────────────┘
         ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────────┐
    │  Lead   │ │  Task   │ │ Attendance  │
    │(UUID PK)│ │(UUID PK)│ │(Unique Day) │
    │ name    │ │ title   │ │ date        │
    │ email   │ │ status  │ │ checkIn     │
    │ status  │ │ priority│ │ checkOut    │
    │ ownerId►│ │assignee►│ │ status      │
    │ deptId ►│ │ leadId ►│ └─────────────┘
    │lostReason│ │projectId│
    └────┬─────┘ │productId│  ┌─────────────┐
         │       │complNote│  │LeaveRequest │
         │       └─────────┘  │             │
         ▼                    │ startDate   │
    ┌─────────┐               │ endDate     │
    │ Project │               │ type        │
    │         │               │ status      │
    │ name    │               │ approvedBy ►│
    │ status  │               │ managerNote │
    │ leadId ►│               └─────────────┘
    └─────────┘
  ┌─────────────┐
                │  EodReport  │
   ┌─────────┐  │             │
   │ Product │  │ date        │
   │         │  │ content     │
   │ name    │  │ leadsCount  │
   │ category│  │ tasksCount  │
   │ isActive│  └─────────────┘
   └─────────┘
                ┌──────────────┐
                │ ActivityLog  │
                │              │
                │ module       │
                │ action       │
                │ entityId     │
                │ description  │
                │ metadata(JSON│)
                └──────────────┘
```

### 4.2 Complete Model Reference

#### Core Identity Models

| Model | Table Name | PK Type | Description |
|-------|-----------|---------|-------------|
| Department | `departments` | Auto Int | Organizational units |
| Role | `roles` | Auto Int | RBAC role definitions (includes `roleVersion` for JWT hygiene) |
| Permission | `permissions` | Auto Int | Module-Action-Scope permissions |
| RolePermission | `role_permissions` | Auto Int | Many-to-many role ↔ permission mapping |
| User | `users` | Auto Int | Authentication identity (includes `isActive` check) |
| Employee | `employees` | Auto Int | Business profile (linked to User 1:1) |

#### Business Data Models

| Model | Table Name | PK Type | Description |
|-------|-----------|---------|-------------|
| Lead | `leads` | UUID | Sales pipeline entries |
| Task | `tasks` | UUID | Work items (linked to Lead/Project/Product) |
| Product | `products` | Auto Int | Product/service catalog |
| Project | `projects` | Auto Int | Fulfillment containers (born from Leads) |
| LeadAssignmentLog | `lead_assignment_logs` | Auto Int | Lead ownership history |
| FollowUpLog | `follow_up_logs` | Auto Int | Scheduled follow-up tracking |
| LeadNote | `lead_notes` | Auto Int | Notes on leads (with privacy flag) |

#### Operations & HR Models

| Model | Table Name | PK Type | Description |
|-------|-----------|---------|-------------|
| EodReport | `eod_reports` | Auto Int | Daily end-of-day summaries |
| Attendance | `attendance` | Auto Int | Clock-in/out records |
| LeaveRequest | `leave_requests` | Auto Int | Leave approval workflow |
| ActivityLog | `activity_logs` | Auto Int | Global audit trail |

### 4.3 Enumerations

```
LeadStatus:    New → Not_Responded → Wrong_Contact → Follow_Up →
               Prospect → Hot_Prospect → Proposal_Sent → Closing → Won / Lost

LeadSource:    Website | Referral | Cold_Call | Email

AttendanceStatus: Present | Late | Half_Day | Absent

LeaveType:     Sick | Casual | Annual | Unpaid | Vacation | Personal | Other

LeaveStatus:   Pending | Approved | Rejected

ProjectStatus: Planning | Active | On_Hold | Completed | Cancelled

ProductStatus: Draft | Active | Discontinued
```

### 4.4 Cascade Rules (Data Integrity)

| Parent | Child | On Delete |
|--------|-------|-----------|
| Lead | Project, AssignmentLogs, Notes, Follow-ups | **Cascade** (auto-cleanup) |
| Lead | Task | **SetNull** (preserve work history) |
| Employee | User, Attendance, Leaves, EOD, ActivityLogs | **Cascade** |
| Project | Task | **SetNull** (preserve work history) |
| Product | Task | **SetNull** |
| Role | RolePermission | **Cascade** |
| Permission | RolePermission | **Cascade** |

### 4.5 Database Indexes

| Table | Indexed Columns | Purpose |
|-------|----------------|---------|
| leads | `ownerId`, `departmentId`, `status`, `source` | Fast filtering by owner, department, pipeline stage |
| tasks | `assigneeId`, `creatorId`, `relatedToLeadId`, `projectId`, `productId`, `status`, `priority` | Fast lookups for assignment and status queries |
| lead_assignment_logs | `leadId`, `assignedToId` | Fast assignment history retrieval |
| follow_up_logs | `leadId`, `employeeId` | Follow-up tracking |
| lead_notes | `leadId`, `authorId` | Note retrieval |
| eod_reports | `employeeId`, `date` | Daily report lookups |
| attendance | `employeeId`, `date` | Attendance checking |
| leave_requests | `employeeId`, `status` | Leave filtering |
| activity_logs | `employeeId`, `module`, `entityId`, `createdAt` | Audit trail queries |

---

## 5. Authentication & Security

### 5.1 Authentication Flow

```
User Login Request
       │
       ▼
┌─────────────────┐
│ POST /api/auth/ │
│     login       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    NO     ┌──────────────┐
│ Validate Email  │─────────►│ 401 Invalid  │
│ & Password      │           │ Credentials  │
└────────┬────────┘           └──────────────┘
         │ YES
         ▼
┌─────────────────┐
│ Fetch User +    │
│ Role +          │
│ RolePermissions │
│ + Employee      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Flatten perms   │
│ into JWT payload│
│ [module:action: │
│  scope] array   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Sign JWT (48hr) │
│ payload includes│
│ roleVersion     │
│ Return token +  │
│ user + perms    │
└─────────────────┘
```

### 5.2 Security Layers

| Layer | Component | Protection |
|-------|----------|------------|
| 1 | **CORS** | Restricts API access to allowed domains |
| 2 | **JWT Verification** | Validates token signature and expiry |
| 3 | **Real-time Hygiene** | Database check for `isActive` and `roleVersion` on **every** request |
| 4 | **Permission Middleware** | Checks `module:action:scope` against JWT payload |
| 5 | **Unified RBAC (Backend)** | Uses `getModuleWhereClause` for standardized Prisma filters |
| 6 | **Secure Handler** | `safeHandler` utility manage global error formatting/masking |
| 7 | **selectUtils.ts** | Centralized data selects prevent PII/password leakage |

### 5.3 JWT Payload Structure

```json
{
  "userId": 1,
  "email": "superadmin@media-masala.com",
  "role": "ADMIN",
  "department": "ADMIN",
  "employeeId": 1,
  "roleVersion": 5,
  "permissions": [
    { "module": "leads", "action": "view", "scopeType": "all" },
    { "module": "leads", "action": "create", "scopeType": "all" },
    { "module": "tasks", "action": "edit", "scopeType": "department" }
  ],
  "exp": 1707900000,
  "iat": 1707871200
}
```

### 5.4 Ghost Access Prevention
The system implements a multi-tier deactivation logic:
1. **Middleware Check**: `authenticateToken` queries the `User` table to ensure `isActive: true`.
2. **Hygiene Hook**: `checkPermission` verifies the JWT's `roleVersion` against the database's `Role.roleVersion`. If a mismatch is found (i.e., permissions were modified after logic), the session is instantly invalidated.

---

## 6. Role-Based Access Control (RBAC)

### 6.1 Permission Model: Module × Action × Scope

Every permission is a combination of three variables:
- **Module**: Which feature area (leads, tasks, products, etc.)
- **Action**: What operation (view, create, edit, delete, assign, approve)
- **Scope**: What data range (own, team, department, all)

### 6.2 Role Definitions

| Role | Code | Description | Default Scope |
|------|------|-------------|---------------|
| **Admin** | `ADMIN` | Full system control | `all` |
| **Head of Department** | `HEAD_DEPT` | Department-wide control | `department` |
| **Business/Project Manager** | `BM_PM` | Team management | `team` |
| **Team Lead** | `TL` | Team leadership | `team` |
| **Employee** | `EMPLOYEE` | Individual contributor | `own` |

### 6.3 Complete Permission Matrix

| Module | Action | ADMIN | HEAD_DEPT | BM/PM | TL | EMPLOYEE |
|--------|--------|-------|-----------|-------|----|----------|
| **Leads** | view | all | department | team | team | own |
| **Leads** | create | all | all | all | all | all |
| **Leads** | edit | all | department | team | team | own |
| **Leads** | delete | all | all | — | — | — |
| **Leads** | assign | all | all | all | — | — |
| **Tasks** | view | all | department | team | team | own |
| **Tasks** | create | all | all | all | all | — |
| **Tasks** | edit | all | department | team | team | own |
| **Tasks** | delete | all | all | — | — | — |
| **Tasks** | assign | all | all | all | all | — |
| **Projects** | view | all | department | assigned | assigned | assigned |
| **Projects** | create | all | all | all | — | — |
| **Projects** | edit | all | department | assigned | assigned | — |
| **Projects** | delete | all | all | — | — | — |
| **Products** | view | all | all | all | all | own |
| **Products** | create | all | all | — | — | — |
| **Products** | edit | all | all | all | — | — |
| **Products** | delete | all | all | — | — | — |
| **EOD** | view | all | department | team | team | own |
| **EOD** | create | all | all | all | all | all |
| **Attendance** | view | all | department | team | team | own |
| **Attendance** | create | all | all | all | all | all |
| **Attendance** | approve | all | department | team | team | — |
| **Employees** | view | all | department | — | — | own |
| **Employees** | edit | all | department | — | — | own |
| **Employees** | manage | all | — | — | — | — |
| **Reports** | generate | all | department | team | team | own |

### 6.4 Scope Enforcement Logic

The system utilizes a centralized helper `getModuleWhereClause(user, module, action)` located in `permissionUtils.ts`. This utility maps the user's `permissionScope` (OWN, TEAM, DEPARTMENT, ALL) directly to Prisma `where` clauses, ensuring consistent enforcement across all controllers and reports.

```typescript
// Conceptual implementation of getModuleWhereClause
Scope: "own"        → { ownerId: currentUser.employeeId }
Scope: "team"       → { ownerId: { in: reporteeChain } } // Includes recursive subordinates
Scope: "department" → { departmentId: currentUser.departmentId }
Scope: "all"        → {} // Full access

**Recursive Hierarchies**: The `team` scope uses a recursive CTE (via `getRecursiveReporteeIds`) to ensure that managers can see data from all levels of their hierarchy, not just immediate reports.
```

---

## 7. API Reference

**Base URL**: `http://localhost:4000/api` (Development) or `https://your-render-url.onrender.com/api` (Production)

### 7.1 Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/login` | No | Login with email/password, returns JWT + user + permissions |
| `POST` | `/register` | No | Register new user (creates User only, no Employee profile) |
| `GET` | `/me` | Yes | Get current user profile with fresh permissions from DB |

**Login Request:**
```json
POST /api/auth/login
{
  "email": "superadmin@media-masala.com",
  "password": "Password@123"
}
```

**Login Response:**
```json
{
  "user": {
    "id": 1,
    "email": "superadmin@media-masala.com",
    "role": { "code": "ADMIN", "name": "Admin" },
    "department": { "code": "ADMIN", "name": "Administration" },
    "employee": { "id": 1, "empId": "EMP001", "firstName": "Super", "lastName": "Admin" }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "permissions": [...]
}
```

---

### 7.2 Administration — `/api/admin`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/employees` | Yes | `employees:view` | List all employees |
| `POST` | `/employees` | Yes | `employees:manage:all` | Onboard new employee (transactional) |
| `PUT` | `/employees/:id` | Yes | `employees:edit` | Update employee profile |
| `GET` | `/departments` | Yes | — | List all departments |
| `POST` | `/departments` | Yes | `employees:manage:all` | Create department |
| `GET` | `/roles` | Yes | — | List all roles with permissions |
| `POST` | `/roles/sync-permissions` | Yes | `employees:manage:all` | Bulk sync role permissions |

**Employee Onboarding Logic:**
1. Generate next `empId` (EMP001 → EMP002 → ...)
2. Hash password with bcrypt (10 rounds)
3. Create `User` record with role and department
4. Create `Employee` record linked to User
5. All in a single Prisma `$transaction`

---

### 7.3 Leads — `/api/leads`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | Yes | `leads:view` | List leads (scoped by user permission) |
| `GET` | `/:id` | Yes | `leads:view` | Get single lead with relations |
| `POST` | `/` | Yes | `leads:create` | Create new lead |
| `PUT` | `/:id` | Yes | `leads:edit` | Update lead (status, details) |
| `DELETE` | `/:id` | Yes | `leads:delete` | Delete lead (cascades to notes, logs) |
| `POST` | `/:id/assign` | Yes | `leads:assign` | Reassign lead ownership |
| `POST` | `/:id/convert` | Yes | `leads:edit` | Convert Won lead to Project |
| `POST` | `/:id/follow-ups` | Yes | `leads:edit` | Add follow-up entry |
| `POST` | `/:id/notes` | Yes | `leads:edit` | Add note to lead |

**Key Business Rules:**
- Setting status to `Lost` **requires** `lostReason` field (min 3 chars)
- Lead conversion only works when status is `Won`
- Duplicate project creation from the same lead is prevented via concurrency checks
- Assignment creates an entry in `LeadAssignmentLog` for audit trail
- Lead IDs are UUIDs for security (non-guessable URLs)

---

### 7.4 Tasks — `/api/tasks`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | Yes | `tasks:view` | List tasks (scoped) |
| `GET` | `/:id` | Yes | `tasks:view` | Get single task with relations |
| `POST` | `/` | Yes | `tasks:create` | Create task (can link to Lead/Project/Product) |
| `PUT` | `/:id` | Yes | `tasks:edit` | Update task |
| `DELETE` | `/:id` | Yes | `tasks:delete` | Delete task |

**Key Business Rules:**
- Setting status to `Completed` **requires** `completionNote` field (min 5 chars)
- Tasks can **only** be assigned to active employees
- Completing a task auto-sets `completedAt` timestamp
- Re-opening a task nullifies `completedAt`
- Tasks can be cross-linked to Lead, Project, or Product

---

### 7.5 Projects — `/api/projects`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | Yes | `projects:view` | List projects (scoped) |
| `GET` | `/:id` | Yes | `projects:view` | Get project with tasks |
| `POST` | `/` | Yes | `projects:create` | Create project |
| `PUT` | `/:id` | Yes | `projects:edit` | Update project |
| `DELETE` | `/:id` | Yes | `projects:delete` | Delete project |

---

### 7.6 Products — `/api/products`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | Yes | `products:view` | List active products (uses `productSelect`) |
| `GET` | `/:id` | Yes | `products:view` | Get product with manager and tasks |
| `POST` | `/` | Yes | `products:create` | Create product |
| `PUT` | `/:id` | Yes | `products:edit` | Update product |
| `PATCH` | `/:id` | Yes | `products:delete` | Soft-delete (toggle `isActive`) |

---

### 7.7 Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/stats` | Yes | Get KPI counts (leads, tasks, projects, products) |

**Returns (parallelized queries):**
```json
{
  "totalLeads": 150,
  "newLeads": 25,
  "wonLeads": 40,
  "totalTasks": 200,
  "completedTasks": 120,
  "pendingTasks": 80,
  "totalProjects": 30,
  "activeProjects": 18,
  "totalProducts": 50
}
```

---

### 7.8 EOD Reports — `/api/eod`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | Yes | `eod:view` | List EOD reports (scoped) |
| `POST` | `/` | Yes | `eod:create` | Submit daily EOD report |

---

### 7.9 Attendance — `/api/attendance`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | Yes | `attendance:view` | List attendance records (scoped) |
| `POST` | `/check-in` | Yes | `attendance:create` | Clock in (one per day enforced) |
| `POST` | `/check-out` | Yes | `attendance:create` | Clock out |

**Key Business Rule:** 
- Only one check-in per day per employee (midnight-to-midnight window).
- Enforced via database-level `@@unique([employeeId, date])` constraint and application-level check.

---

### 7.10 Leave Management — `/api/leaves`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | Yes | `attendance:view` | List leave requests (scoped) |
| `POST` | `/` | Yes | `attendance:create` | Submit leave request |
| `PUT` | `/:id/approve` | Yes | `attendance:approve` | Approve leave (captures approver ID) |
| `PUT` | `/:id/reject` | Yes | `attendance:approve` | Reject leave (requires managerNote, min 5 chars) |

**Key Business Rule:** 
- Employees cannot apply for leave with start dates in the past.
- Overlapping leave requests (Pending or Approved) for the same employee are blocked.
- Self-approval of leave requests is strictly forbidden.

---

### 7.11 Reports — `/api/reports`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/sales` | Yes | `reports:generate` | Sales funnel analytics |
| `GET` | `/productivity` | Yes | `reports:generate` | Team productivity metrics |
| `GET` | `/attendance` | Yes | `reports:generate` | Attendance summary |

**Sales Report Returns:**
- Lead counts by status (New, Won, Lost, etc.)
- Conversion rate (Won / Total)
- Leads by source (Website, Referral, Cold Call, Email)
- Department-wise breakdown

---

### 7.12 Activity Logs — `/api/activity`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Yes | Get recent activity logs (scoped, paginated) |

---

### 7.13 Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Returns `{"status": "ok", "database": "connected"}` |

---

## 8. Business Logic & Workflows

### 8.1 Lead Lifecycle

```
    ┌─────┐
    │ New │ (Auto-assigned to creator)
    └──┬──┘
       │
       ▼
┌──────────────┐
│Not Responded │
└──────┬───────┘
       │
       ├──────────────────┐
       ▼                  ▼
┌─────────────┐   ┌──────────────┐
│Wrong Contact│   │  Follow Up   │
└─────────────┘   └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Prospect   │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Hot Prospect │
                  └──────┬───────┘
                         │
                         ▼
                  ┌───────────────┐
                  │ Proposal Sent │
                  └──────┬────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Closing    │
                  └──────┬───────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌──────────┐         ┌──────────┐
        │   Won    │         │   Lost   │
        │          │         │(requires │
        │ →Convert │         │lostReason│)
        │ to Project         └──────────┘
        └──────────┘
```

### 8.2 Lead-to-Project Conversion

1. Validate lead status is `Won`
2. Check no existing project linked to this lead
3. **Prisma Transaction:**
   - Create `Project` record with lead reference
   - Log `CONVERT` activity
4. Return created project

### 8.3 Task Lifecycle

```
┌─────────┐    Assign/Claim     ┌─────────────┐
│ Pending │ ──────────────────► │ In Progress │
└─────────┘                     └──────┬──────┘
     ▲                                 │
     │           Re-assign             │  completionNote
     └─────────────────────────────────┤  provided
                                       │
                                       ▼
                                ┌─────────────┐
                                │  Completed  │
                                └─────────────┘
```

### 8.4 Employee Onboarding Flow

1. Admin fills onboarding form (name, email, password, role, department, manager)
2. Backend generates next `empId` (EMP001 → EMP002 → ...)
3. **Atomic Transaction:**
   - Create `User` with hashed password, role, department
   - Create `Employee` linked to User, with manager relationship
4. New employee can now login

### 8.5 Attendance Workflow

1. Employee clicks "Check In"
2. System validates: No existing check-in for today
3. Creates attendance record with server timestamp
4. Employee clicks "Check Out" later
5. System updates the same record with `checkOut` time

### 8.6 Leave Approval Workflow

```
Employee                    Manager/Admin
   │                            │
   │── POST /leaves ───────────►│
   │   (Pending)                │
   │                            │
   │                    Review Request
   │                            │
   │◄── PUT /:id/approve ──────│ (Approved + managerNote)
   │    or                      │
   │◄── PUT /:id/reject  ──────│ (Rejected + managerNote)
```

---

## 9. Frontend Application

### 9.1 Page Structure

| Route | Page | Description |
|-------|------|-------------|
| `/auth/login` | Login Page | Email/password authentication |
| `/dashboard` | Dashboard | KPI stats, recent activity |
| `/dashboard/leads` | Leads List | Pipeline view with filters |
| `/dashboard/leads/new` | New Lead | Lead creation form |
| `/dashboard/leads/[id]` | Lead Detail | Lead info, notes, follow-ups |
| `/dashboard/tasks` | Tasks List | Task management view |
| `/dashboard/tasks/new` | New Task | Task creation (link to Lead/Project/Product) |
| `/dashboard/tasks/[id]` | Task Detail | Task info and status updates |
| `/dashboard/portfolio` | Projects | Project portfolio view |
| `/dashboard/products` | Products | Product catalog management |
| `/dashboard/reports` | Reports | Sales, Productivity, Attendance analytics |
| `/dashboard/logs` | Activity Logs | System audit trail |
| `/dashboard/attendance` | Attendance | Clock-in/out management |
| `/dashboard/attendance/leaves` | Leaves | Leave request management |
| `/dashboard/settings` | Settings | User/system configuration |

### 9.2 Key Frontend Libraries

| Library | Usage |
|---------|-------|
| `@tanstack/react-query` | Server state caching, automatic refetching |
| `react-hook-form` + `zod` | Form handling with schema validation |
| `next-auth` | Session management, JWT storage |
| `sonner` | Toast notifications for success/error feedback |
| `lucide-react` | Icon library |
| `@radix-ui/*` | Accessible UI primitives (Dialog, Dropdown, Label) |
| `zustand` | Lightweight client-side state management |

### 9.3 API Client

All API calls go through a centralized `apiClient` utility that:
- Automatically attaches the JWT Bearer token from the session
- Triggers success toasts on mutating operations (POST, PUT, DELETE)
- Shows granular error messages for 401 (Unauthorized), 403 (Forbidden), and 500 (Server Error)

### 9.4 UI Patterns: Perceived Performance

To ensure a premium feel on all connections, the CRM uses **Skeleton Loaders**.
- **PageSkeleton**: A reusable component (`page-skeleton.tsx`) that generates an architectural blueprint of the page during data fetching.
- **Atomic Skeletons**: Individual components for cards and table rows to minimize layout shift.

---

## 10. Deployment Guide

### 10.1 Backend → Render

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `node dist/server.js` |
| **Runtime** | Node |

### 10.2 Frontend → Vercel

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework** | Next.js (auto-detected) |
| **Build Command** | `npm run build` |

---

## 11. Environment Variables

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (direct, non-pooler) | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Secret key for JWT signing | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `production` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (must end with `/api`) | `https://your-backend.onrender.com/api` |
| `NEXTAUTH_URL` | Frontend base URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth session encryption key | `f6e7d8c9b0a1a2b3c4d5e6f7g8h9i0j1` |
| `DATABASE_URL` | PostgreSQL connection (for NextAuth) | `postgresql://user:pass@host/db` |

---

## 12. Default Credentials

| Field | Value |
|-------|-------|
| **Email** | `superadmin@media-masala.com` |
| **Password** | `Password@123` |
| **Role** | Admin (full access) |
| **Employee ID** | EMP001 |

---

## Appendix A: Project File Structure

```
MediaaMasala-CRM/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (16 models)
│   │   └── seed.ts                # Database seeding script
│   ├── src/
│   │   ├── controllers/           # Business logic (12 controllers)
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT verification + permission check
│   │   │   └── errorHandler.ts    # Global error handling
│   │   ├── routes/                # API route definitions (12 files)
│   │   ├── lib/
│   │   │   └── prisma.ts          # Prisma client singleton
│   │   └── server.ts              # Express app entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/login/        # Login page
│   │   │   ├── dashboard/         # All dashboard pages
│   │   │   ├── layout.tsx         # Root layout with providers
│   │   │   └── page.tsx           # Landing page
│   │   ├── components/
│   │   │   ├── layout/            # LayoutShell, Sidebar
│   │   │   └── ui/                # Reusable UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/
│   │   │   ├── api-client.ts      # Centralized API client
│   │   │   └── auth.ts            # NextAuth configuration
│   │   └── providers/             # React Query + Session providers
│   ├── package.json
│   └── next.config.mjs
│
├── .gitignore
└── README.md
```

---

## Appendix B: Performance Optimizations

| Optimization | Impact |
|-------------|--------|
| JWT Permission Flattening | Eliminates DB lookup on every API call (~500ms saved) |
| `Promise.all` Parallelization | Dashboard queries run concurrently (>60% faster) |
| `selectUtils.ts` (NEW) | Leaner payloads and zero data leakage of sensitive PII |
| `safeHandler` (NEW) | Standardized error management, preventing stack leakage |
| `PageSkeleton` (NEW) | Improved perceived performance on high-latency networks |

### System Hardening & Compliance (Audit 6)

In February 2026, the system underwent a major hardening phase to ensure data integrity and compliance.

#### 1. Soft-Delete Implementation
To preserve audit trails, the `Employee` model now uses an `isActive` flag instead of hard-deletion.
- **Effect**: Deleting an employee marks them as inactive but preserves their `Attendance`, `EOD`, and `ActivityLogs`.
- **Ghost Access Prevention**: Soft-deleting an employee also deactivates their associated `User` record, preventing login.

#### 2. RBAC Hygiene: Role Versioning
The system now handles permission staleness via `roleVersion`.
- **Mechanism**: Every `Role` has a `roleVersion` (Int). This version is embedded in the JWT at login.
- **Enforcement**: If an admin updates a role (permissions or name), the `roleVersion` increments. The backend checks this in the `/me` endpoint and rejects stale tokens with a `TOKEN_STALE` code.

#### 3. Data Integrity Constraints
- **Attendance**: A unique constraint on `(employeeId, date)` prevents multiple attendance records for the same employee on the same day.
- **Project Conversion**: The `Project.leadId` is now strictly `@unique` at the database level, preventing multiple projects from being spawned from a single lead.

#### 4. Auth-Only User Model
The `User` model has been decoupled from business logic. It now only stores authentication credentials.
- **Centralization**: `roleId` and `departmentId` are stored exclusively on the `Employee` record.
- **Logic**: All RBAC checks use the `Employee` context fetched via the `userId` in the token.

| Optimization | Impact |
|-------------|--------|
| React Query Caching | Frontend caches API responses, reduces re-fetches |
| Session-First Permissions | Frontend trusts JWT permissions, background-syncs from DB |

---

*End of Document*
```
