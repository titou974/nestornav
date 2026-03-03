"use server";

import { createEmployeeSchema } from "@/lib/validations";
import { z } from "zod";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { getLastClockIn } from "@/utils/queries/clock-ins";
import { createEmployee } from "@/utils/mutations/employees";
import { createClockIn } from "@/utils/mutations/clock-ins";

export async function createEmployeeAction(data: {
  tenantId: string;
  firstName: string;
  lastName: string;
}) {
  try {
    const validated = createEmployeeSchema.parse({
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const result = await createEmployee({
      ...validated,
      tenantId: data.tenantId,
    });

    if (result.success) {
      revalidateTag(`employees-${data.tenantId}`, "max");
    }

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur création employé:", error);
    return { success: false, error: "Erreur lors de la création de l'employé" };
  }
}

export async function getLastClockInAction(employeeId: string, siteId: string) {
  try {
    const lastClockIn = await getLastClockIn(employeeId, siteId);
    return { success: true, data: lastClockIn };
  } catch (error) {
    console.error("Error fetching last clock-in:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du dernier pointage",
    };
  }
}

export async function saveEmployeeCookieAction(employeeId: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("nestor_employee_id", employeeId, {
      maxAge: 60 * 60 * 24 * 365, // 1 an
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving employee cookie:", error);
    return { success: false, error: "Erreur lors de la sauvegarde du cookie" };
  }
}

export async function getEmployeeCookieAction() {
  try {
    const cookieStore = await cookies();
    const employeeId = cookieStore.get("nestor_employee_id");
    return { success: true, data: employeeId?.value || null };
  } catch (error) {
    console.error("Error getting employee cookie:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du cookie",
      data: null,
    };
  }
}

export async function createClockInAction(data: {
  siteId: string;
  employeeId: string;
  action: "START" | "PAUSE" | "END";
  tenantId: string;
  qrTokenId: string;
}) {
  const result = await createClockIn(data);

  return result;
}
