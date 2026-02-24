/**
 * RBAC Scope System — Canonical Types
 * 
 * This file is the SINGLE SOURCE OF TRUTH for scope, module, and action types.
 * Every backend file must import from here. No ad-hoc string types.
 */

// ── Scope ──────────────────────────────────────────────────────────────
export const SCOPES = ['own', 'team', 'department', 'all'] as const;
export type Scope = typeof SCOPES[number];

/** Scope hierarchy: all > department > team > own */
export const SCOPE_ORDER: Record<Scope, number> = {
  all: 0,
  department: 1,
  team: 2,
  own: 3,
};

// ── Modules ────────────────────────────────────────────────────────────
export const MODULES = [
  'leads', 'tasks', 'projects', 'products',
  'attendance', 'leaves', 'eod',
  'reports', 'employees', 'activity', 'dashboard'
] as const;
export type Module = typeof MODULES[number];

// ── Actions ────────────────────────────────────────────────────────────
export const ACTIONS = [
  'view', 'create', 'edit', 'delete',
  'assign', 'approve', 'generate', 'manage'
] as const;
export type Action = typeof ACTIONS[number];

// ── Request User (attached by authenticateToken) ───────────────────────
export interface RequestUser {
  id: number;
  employeeId: number;
  email: string;
  role: string;
  roleVersion: number;
  departmentId: number;
  permissions: ResolvedPermission[];
}

export interface ResolvedPermission {
  module: string;
  action: string;
  scope: Scope;
}

// ── Normalize legacy scope values ──────────────────────────────────────
export function normalizeScope(scope: string): Scope {
  if (scope === 'assigned') return 'own';
  if (scope === 'read') return 'own';   // edge case from old data
  if (SCOPES.includes(scope as Scope)) return scope as Scope;
  return 'own'; // safe default
}
