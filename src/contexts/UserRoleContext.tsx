import { createContext, useContext, useState, ReactNode } from "react";

/**
 * USER ROLE CONTEXT
 * 
 * WeWeb Export Note:
 * This context manages user permissions (admin vs viewer).
 * 
 * In WeWeb:
 * - Replace this with WeWeb's built-in user authentication system
 * - Map user roles to WeWeb user groups/permissions
 * - Use WeWeb's user.role property in conditional formulas
 * 
 * Permissions:
 * - admin: Can create, read, update, delete projects
 * - viewer: Can only read projects (read-only mode)
 */

export type UserRole = "admin" | "viewer";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");

  return (
    <UserRoleContext.Provider value={{ role, setRole, isAdmin: role === "admin" }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within UserRoleProvider");
  }
  return context;
}