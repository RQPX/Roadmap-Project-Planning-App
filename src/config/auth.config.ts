/**
 * AUTHENTICATION CONFIGURATION
 * 
 * IMPORTANT: This file contains hardcoded credentials for demo purposes only.
 * In production, use environment variables or proper authentication service.
 * 
 * These credentials are used as fallback if .env.local is not available.
 */

export interface AuthConfig {
  admin: {
    email: string;
    password: string;
    name: string;
  };
  directeurs: Array<{
    email: string;
    password: string;
    name: string;
  }>;
}

// Fallback configuration (used if .env.local not available)
export const AUTH_CONFIG: AuthConfig = {
  admin: {
    email: "Rahima.kone@cgi.ci",
    password: "Rqpx03!21DPGS",
    name: "Rahima Kone",
  },
  directeurs: [
    {
      email: "ibrahima.kone@quipux.com",
      password: "Directeur2024!",
      name: "Ibrahima Kone",
    },
    {
      email: "marie.ayoman@quipux.com",
      password: "Directeur2024!",
      name: "Marie Ayoman",
    },
    {
      email: "andreas.yao@cgi.ci",
      password: "OperateurIn2!",
      name: "Andreas Yao",
    },
  ],
};

/**
 * Get configuration from environment or fallback
 */
export function getAuthConfig(): AuthConfig {
  // Try to get from environment variables first
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const adminName = import.meta.env.VITE_ADMIN_NAME;

  const directeurEmails = import.meta.env.VITE_DIRECTEUR_EMAILS;
  const directeurPasswords = import.meta.env.VITE_DIRECTEUR_PASSWORDS;
  const directeurNames = import.meta.env.VITE_DIRECTEUR_NAMES;

  // If environment variables are configured, use them
  if (adminEmail && adminPassword && directeurEmails && directeurPasswords) {
    const emailList = directeurEmails.split(",").map((e: string) => e.trim());
    const passwordList = directeurPasswords.split(",").map((p: string) => p.trim());
    const nameList = directeurNames 
      ? directeurNames.split(",").map((n: string) => n.trim()) 
      : emailList.map((_, i) => `Directeur ${i + 1}`);

    return {
      admin: {
        email: adminEmail,
        password: adminPassword,
        name: adminName || "Administrateur",
      },
      directeurs: emailList.map((email, index) => ({
        email,
        password: passwordList[index] || "",
        name: nameList[index] || `Directeur ${index + 1}`,
      })),
    };
  }

  // Otherwise, use fallback configuration
  console.log("ℹ️ Using fallback auth configuration (hardcoded credentials)");
  return AUTH_CONFIG;
}
