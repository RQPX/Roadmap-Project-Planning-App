/**
 * AIRTABLE SERVICE
 * 
 * This service handles all interactions with Airtable API for project data.
 * 
 * Setup Instructions:
 * 1. Create a .env.local file in the root directory
 * 2. Add your Airtable credentials:
 *    VITE_AIRTABLE_API_KEY=your_api_key_here
 *    VITE_AIRTABLE_BASE_ID=your_base_id_here
 *    VITE_AIRTABLE_TABLE_NAME=Projects
 * 
 * Airtable Table Structure (French Column Names):
 * Your "Projects" table should have these fields:
 * - Projets (Single line text) - Nom du projet
 * - Direction (Single select: DSI, DAF, RH, DGP, DDEV)
 * - Statut (Single select: 9 options - see Status type)
 * - Priorité (Single select: Haute, Moyenne, Basse)
 * - Etat d'avancement (Number: 0-100)
 * - Chef de Projet (Single line text)
 * - Partenaires au Projet (Long text)
 * - Debut de Projet (Date)
 * - Fin Prevue du Projet (Date)
 * - Commentaire (Long text)
 * - Indicateur de Retard (Checkbox)
 */

import type { Project } from "../types/project";

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || "Projects";

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

/**
 * Mapping of French Airtable columns to English app field names
 */
const FIELD_MAPPING = {
  // French column name → English field name
  "Projets": "name",
  "Direction": "department",
  "Statut": "status",
  "Priorité": "priority",
  "Etat d'avancement": "progress",
  "Chef de Projet": "projectManager",
  "Partenaires au Projet": "partners",
  "Debut de Projet": "startDate",
  "Fin Prevue du Projet": "endDate",
  "Commentaire": "comments",
  "Indicateur de Retard": "isDelayed",
} as const;

/**
 * Reverse mapping: English field name → French column name
 */
const REVERSE_FIELD_MAPPING = Object.fromEntries(
  Object.entries(FIELD_MAPPING).map(([french, english]) => [english, french])
) as Record<string, string>;

/**
 * Airtable record structure
 */
interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

/**
 * Check if Airtable is configured
 */
export function isAirtableConfigured(): boolean {
  return !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);
}

/**
 * Get authorization headers for Airtable API
 */
function getHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * Convert French Airtable fields to English app fields
 */
function mapAirtableToProject(airtableFields: Record<string, any>): Omit<Project, "id"> {
  const project: any = {};
  
  for (const [frenchField, englishField] of Object.entries(FIELD_MAPPING)) {
    project[englishField] = airtableFields[frenchField];
  }
  
  return project as Omit<Project, "id">;
}

/**
 * Convert English app fields to French Airtable fields
 */
function mapProjectToAirtable(project: Partial<Omit<Project, "id">>): Record<string, any> {
  const airtableFields: Record<string, any> = {};
  
  for (const [englishField, value] of Object.entries(project)) {
    const frenchField = REVERSE_FIELD_MAPPING[englishField];
    if (frenchField) {
      airtableFields[frenchField] = value;
    }
  }
  
  return airtableFields;
}

/**
 * Convert Airtable record to Project
 */
function recordToProject(record: AirtableRecord): Project {
  return {
    id: record.id,
    ...mapAirtableToProject(record.fields),
  };
}

/**
 * Fetch all projects from Airtable
 * Handles pagination automatically to get all 78 projects
 */
export async function fetchProjects(): Promise<Project[]> {
  if (!isAirtableConfigured()) {
    throw new Error("Airtable n'est pas configuré. Vérifiez vos variables d'environnement.");
  }

  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  try {
    // Fetch all pages of records
    do {
      const url = offset 
        ? `${AIRTABLE_API_URL}?offset=${offset}`
        : AIRTABLE_API_URL;

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur Airtable: ${error.error?.message || response.statusText}`);
      }

      const data: AirtableResponse = await response.json();
      allRecords.push(...data.records);
      offset = data.offset;
    } while (offset);

    return allRecords.map(recordToProject);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    throw error;
  }
}

/**
 * Create a new project in Airtable
 */
export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  if (!isAirtableConfigured()) {
    throw new Error("Airtable n'est pas configuré.");
  }

  try {
    const response = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        fields: mapProjectToAirtable(project),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erreur Airtable: ${error.error?.message || response.statusText}`);
    }

    const data: AirtableRecord = await response.json();
    return recordToProject(data);
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    throw error;
  }
}

/**
 * Update an existing project in Airtable
 */
export async function updateProject(id: string, updates: Partial<Omit<Project, "id">>): Promise<Project> {
  if (!isAirtableConfigured()) {
    throw new Error("Airtable n'est pas configuré.");
  }

  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        fields: mapProjectToAirtable(updates),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erreur Airtable: ${error.error?.message || response.statusText}`);
    }

    const data: AirtableRecord = await response.json();
    return recordToProject(data);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    throw error;
  }
}

/**
 * Delete a project from Airtable
 */
export async function deleteProject(id: string): Promise<void> {
  if (!isAirtableConfigured()) {
    throw new Error("Airtable n'est pas configuré.");
  }

  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erreur Airtable: ${error.error?.message || response.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    throw error;
  }
}