import type { Employee } from "@/types/database";

/**
 * Récupérer tous les employés actifs d'un tenant
 * Utilise fetch avec next.revalidate pour le cache
 */
export async function getEmployeesByTenantId(
  tenantId: string,
): Promise<Employee[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/employees/tenant/${tenantId}`, {
    next: { revalidate: 60, tags: [`employees-${tenantId}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Récupérer un employé par son ID
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/employees/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data || null;
}
