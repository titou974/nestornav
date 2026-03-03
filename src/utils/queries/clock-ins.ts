import type { ClockIn } from "@/types/database";

/**
 * Récupérer le dernier pointage d'un employé pour un site
 * Utilise fetch avec next.revalidate pour le cache
 */
export async function getLastClockIn(
  employeeId: string,
  siteId: string,
): Promise<ClockIn | null> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/clock-ins/last?employeeId=${employeeId}&siteId=${siteId}`,
    {
      next: { revalidate: 10 }, // Cache court car les pointages changent fréquemment
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data || null;
}

/**
 * Récupérer tous les pointages d'un tenant
 */
export async function getClockInsByTenantId(
  tenantId: string,
  limit = 100,
): Promise<ClockIn[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/clock-ins?tenantId=${tenantId}&limit=${limit}`,
    {
      next: { revalidate: 30 },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch clock-ins");
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Récupérer les pointages d'un employé
 */
export async function getClockInsByEmployeeId(
  employeeId: string,
  limit = 50,
): Promise<ClockIn[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/clock-ins?employeeId=${employeeId}&limit=${limit}`,
    {
      next: { revalidate: 30 },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch clock-ins");
  }

  const data = await response.json();
  return data.data || [];
}
