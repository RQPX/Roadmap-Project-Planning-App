import type { Project } from "../types/project";

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || "Projects";
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

const FIELD_MAPPING = {
  "Projets": "name",
  "Direction": "department",
  "Statut": "status",
  "Priorité": "priority",
  "Etat d'avancement": "progress",
  "Avancement Mois Precedent": "previousMonthProgress",
  "Chef de projet": "projectManager",
  "Partenaires au Projet": "partners",
  "Debut du projet": "startDate",
  "Fin Prevue du Projet": "endDate",
  "Commentaire": "comments",
  "Indicateur de Retard": "isDelayed",
} as const;

const REVERSE_FIELD_MAPPING = Object.fromEntries(
  Object.entries(FIELD_MAPPING).map(([french, english]) => [english, french])
) as Record<string, string>;

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export function isAirtableConfigured(): boolean {
  return !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);
}

function getHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

function mapAirtableToProject(airtableFields: Record<string, any>): Omit<Project, "id"> {
  const project: any = {};
  for (const [frenchField, englishField] of Object.entries(FIELD_MAPPING)) {
    project[englishField] = airtableFields[frenchField] ?? null;
  }
  return project as Omit<Project, "id">;
}

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

function recordToProject(record: AirtableRecord): Project {
  return {
    id: record.id,
    ...mapAirtableToProject(record.fields),
  };
}

export async function fetchProjects(): Promise<Project[]> {
  if (!isAirtableConfigured()) {
    throw new Error("Airtable n'est pas configuré.");
  }

  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  try {
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

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  if (!isAirtableConfigured()) throw new Error("Airtable n'est pas configuré.");
  try {
    const response = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ fields: mapProjectToAirtable(project) }),
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

export async function updateProject(id: string, updates: Partial<Omit<Project, "id">>): Promise<Project> {
  if (!isAirtableConfigured()) throw new Error("Airtable n'est pas configuré.");
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ fields: mapProjectToAirtable(updates) }),
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

export async function deleteProject(id: string): Promise<void> {
  if (!isAirtableConfigured()) throw new Error("Airtable n'est pas configuré.");
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
