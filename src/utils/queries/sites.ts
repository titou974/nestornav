import type { Site } from "@/types/database";

/**
 * Récupérer tous les sites d'un tenant
 * Utilise fetch avec next.revalidate pour le cache
 */
export async function getSitesByTenantId(tenantId: string): Promise<Site[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/sites?tenantId=${tenantId}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sites");
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Récupérer un site par son ID
 */
export async function getSiteById(
  id: string,
  tenantId?: string,
): Promise<Site | null> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/sites/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data || null;
}
