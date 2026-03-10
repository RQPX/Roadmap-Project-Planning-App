/**
 * AUTHENTICATION SERVICE
 * 
 * Environment-based authentication system with role-based access.
 * Falls back to hardcoded configuration if .env.local is not available.
 * 
 * Setup Instructions:
 * Add to .env.local (optional - will use fallback if not provided):
 * 
 * # ADMIN ACCOUNT
 * VITE_ADMIN_EMAIL=rahima.kone@cgi.ci
 * VITE_ADMIN_PASSWORD=YourSecurePassword
 * VITE_ADMIN_NAME=Rahima Kone
 * 
 * # DIRECTEUR ACCOUNTS (comma-separated)
 * VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
 * VITE_DIRECTEUR_PASSWORDS=Password1,Password2
 * VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman
 * 
 * Security Notes:
 * - For DEMO/DEVELOPMENT only
 * - For production: Use Supabase Authentication or implement proper auth
 * - Never commit .env.local to Git
 * - Use strong passwords
 */

import type { User } from "../types/user";
import { getAuthConfig } from "../config/auth.config";

// Storage key for persisting auth state
const AUTH_STORAGE_KEY = "auth_user";

/**
 * Get all configured users using auth config
 */
function getAllUsers(): Array<User & { password: string }> {
  const config = getAuthConfig();
  const users: Array<User & { password: string }> = [];

  // Add admin user
  users.push({
    id: "admin-1",
    email: config.admin.email,
    password: config.admin.password,
    name: config.admin.name,
    role: "admin",
  });

  // Add directeur users
  config.directeurs.forEach((directeur, index) => {
    users.push({
      id: `directeur-${index + 1}`,
      email: directeur.email,
      password: directeur.password,
      name: directeur.name,
      role: "directeur",
    });
  });

  console.log(`✅ ${users.length} user(s) configured:`);
  users.forEach(u => console.log(`   - ${u.email} (${u.role})`));

  return users;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getAllUsers();

  // Find user by email and password
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;

  // Save to localStorage
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));

  return userWithoutPassword;
}

/**
 * Logout current user
 */
export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Get current authenticated user from localStorage
 */
export function getCurrentUser(): User | null {
  try {
    const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!userJson) return null;

    const user = JSON.parse(userJson);
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
