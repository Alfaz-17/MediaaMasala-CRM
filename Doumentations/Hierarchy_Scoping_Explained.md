# CRM Hierarchy & Scoping — How It Works

## How the Team Hierarchy is Built

The entire hierarchy is based on **one field: "Reporting To" (`managerId`)** in the Employee record.

When you add a new staff member in **Settings → Employees → Add Employee**, there's a **"Reporting To"** dropdown. Whoever you select there becomes their manager. That single field creates the whole tree.

### Example: Building the Sales Team

```
Step 1: Add "Sales HOD"     → Reporting To: (nobody / blank)
Step 2: Add "Sales BM"      → Reporting To: Sales HOD   ← BM reports to HOD
Step 3: Add "Sales BDM-1"   → Reporting To: Sales BM    ← BDM-1 reports to BM
Step 4: Add "Sales BDE-1A"  → Reporting To: Sales BDM-1 ← BDE-1A reports to BDM-1
```

This creates:
```
Sales HOD
└── Sales BM
    ├── Sales BDM-1
    │   ├── BDE-1A
    │   ├── BDE-1B
    │   ├── BDE-1C
    │   └── BDE-1D
    └── Sales BDM-2
        ├── BDE-2A
        ├── BDE-2B
        ├── BDE-2C
        └── BDE-2D
```

---

## How the System Uses This for Scoping

The system has a function called `getRecursiveReporteeIds()` that walks down the reporting chain to find all subordinates.

| When you login as... | System looks up... | You can see data for... |
|---|---|---|
| **BDE-1A** (scope: `own`) | Nobody reports to BDE-1A | Only your own data |
| **BDM-1** (scope: `team`) | Who reports to BDM-1? → BDE-1A, 1B, 1C, 1D | Your data + all 4 BDEs' data |
| **BM** (scope: `team`) | Who reports to BM? → BDM-1, BDM-2. Who reports to them? → all 8 BDEs | Your data + BDMs + all 8 BDEs = **recursive** |
| **HOD** (scope: `department`) | All employees in Sales Department | Everyone in Sales Department |
| **Admin** (scope: `all`) | Everything | All departments, all employees |

---

## The 4 Scope Types

| Scope | What It Means | Best For |
|---|---|---|
| `own` | Only your own records | BDE, regular employees |
| `team` | Your records + everyone who reports to you (recursively) | BDM, BM, Managers |
| `department` | Everyone in your department | HOD, Department Heads |
| `all` | Everyone across all departments | Admin |

### Key Difference: `team` vs `department`

- **`team` scope** = Follows the "Reporting To" chain **recursively** (your direct reports + their reports + their reports...)
- **`department` scope** = Everyone in your **department**, regardless of reporting line
- **`own` scope** = Only yourself
- **`all` scope** = The entire organization

---

## How Scopes Are Assigned

Scopes are tied to **Roles** via the **Permission Matrix** (Settings → Permissions).

Each role gets permissions like:
- `leads → view → team` (can view team's leads)
- `attendance → view → department` (can view department attendance)
- `eod → create → own` (can submit own EOD)

The Permission Matrix controls WHAT each role can see/do, and the "Reporting To" field controls WHO is in their team.

---

## Summary

> **You build the hierarchy by setting "Reporting To" when adding staff. The system automatically figures out who can see whose data based on that chain + the role's permission scope.**
