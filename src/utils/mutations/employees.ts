"use server";

import { revalidateTag } from "next/cache";
import type { Employee } from "@/types/database";

export async function createEmployee(data: {
  firstName: string;
  lastName: string;
  phone?: string;
  tenantId: string;
}): Promise<{ success: boolean; data?: Employee; error?: string }> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/employees`, {
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
        error: errorData.error || "Erreur lors de la création de l'employé",
      };
    }

    const result = await response.json();

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error creating employee:", error);
    return {
      success: false,
      error: "Erreur lors de la création de l'employé",
    };
  }
}

export async function updateEmployee(
  id: string,
  tenantId: string,
  data: Partial<Pick<Employee, "firstName" | "lastName" | "phone">>,
): Promise<{ success: boolean; data?: Employee; error?: string }> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/employees/${id}`, {
      method: "PUT",
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
        error: errorData.error || "Employé non trouvé",
      };
    }

    const result = await response.json();

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error updating employee:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour de l'employé",
    };
  }
}

/**
 * Supprimer un employé (soft delete)
 * Utilise fetch DELETE et invalide le cache avec revalidateTag
 */
export async function deleteEmployee(
  id: string,
  tenantId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/employees/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, error: "Employé non trouvé" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression de l'employé",
    };
  }
}
