"use server";

import type { ClockIn, ClockInAction } from "@/types/database";

/**
 * Créer un pointage et marquer le token comme consommé
 * Utilise fetch POST et invalide le cache
 */
export async function createClockIn(data: {
  siteId: string;
  employeeId: string;
  action: ClockInAction;
  tenantId: string;
  qrTokenId: string;
}): Promise<{ success: boolean; data?: ClockIn; error?: string }> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/pointage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Erreur lors de la création du pointage",
      };
    }

    const result = await response.json();

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error creating clock-in:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Erreur lors de la création du pointage",
    };
  }
}
