/**
 * USER AUTHENTICATION TYPES
 * 
 * Airtable Integration Note:
 * These types define the user structure for authentication.
 * 
 * Roles:
 * - admin: Full CRUD access to all projects
 * - directeur: Read-only access (view all, no modifications)
 */

export type UserRole = "admin" | "directeur";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDirecteur: boolean;
}
