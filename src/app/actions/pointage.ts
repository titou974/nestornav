"use server";

import { prisma } from "@/lib/prisma";
import { createEmployeeSchema, createClockInSchema } from "@/lib/validations";
import { z } from "zod";
import { cookies } from "next/headers";

/**
 * Valider un token QR et récupérer les informations du site et des employés
 */
export async function validateTokenAction(token: string) {
  try {
    const qrToken = await prisma.qrToken.findUnique({
      where: { token },
      include: { site: true },
    });

    if (!qrToken) {
      return { success: false, error: "Token invalide" };
    }

    if (qrToken.used) {
      return { success: false, error: "Token déjà utilisé" };
    }

    if (new Date() > qrToken.expiresAt) {
      return { success: false, error: "Token expiré" };
    }

    // Marquer comme utilisé
    await prisma.qrToken.update({
      where: { id: qrToken.id },
      data: { used: true, usedAt: new Date() },
    });

    // Récupérer les employés du tenant
    const employees = await prisma.employee.findMany({
      where: { tenantId: qrToken.tenantId, isActive: true },
      orderBy: { firstName: "asc" },
    });

    return {
      success: true,
      data: {
        siteId: qrToken.siteId,
        siteName: qrToken.site.name,
        tenantId: qrToken.tenantId,
        employees,
      },
    };
  } catch (error) {
    console.error("Erreur validation token:", error);
    return { success: false, error: "Erreur lors de la validation du token" };
  }
}

/**
 * Créer un nouvel employé (auto-registration)
 */
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

    const employee = await prisma.employee.create({
      data: {
        ...validated,
        tenantId: data.tenantId,
      },
    });

    return { success: true, data: employee };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur création employé:", error);
    return { success: false, error: "Erreur lors de la création de l'employé" };
  }
}

/**
 * Récupérer le dernier pointage d'un employé pour un site donné
 */
export async function getLastClockInAction(employeeId: string, siteId: string) {
  try {
    const lastClockIn = await prisma.clockIn.findFirst({
      where: {
        employeeId,
        siteId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return { success: true, data: lastClockIn };
  } catch (error) {
    console.error("Error fetching last clock-in:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du dernier pointage",
    };
  }
}

/**
 * Sauvegarder l'ID de l'employé dans un cookie
 */
export async function saveEmployeeCookieAction(employeeId: string) {
  "use server";
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

/**
 * Récupérer l'ID de l'employé depuis le cookie
 */
export async function getEmployeeCookieAction() {
  "use server";
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

/**
 * Créer un pointage
 */
export async function createClockInAction(data: {
  siteId: string;
  employeeId: string;
  action: "START" | "PAUSE" | "END";
  tenantId: string;
  tokenId: string;
}) {
  try {
    const validated = createClockInSchema.parse({
      siteId: data.siteId,
      employeeId: data.employeeId,
      action: data.action,
    });

    const clockIn = await prisma.clockIn.create({
      data: {
        ...validated,
        tenantId: data.tenantId,
      },
      include: {
        employee: true,
        site: true,
      },
    });

    // Marquer le token comme utilisé après le pointage réussi
    await prisma.qrToken.update({
      where: { id: data.tokenId },
      data: { used: true, usedAt: new Date() },
    });

    return { success: true, data: clockIn };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Erreur création pointage:", error);
    return { success: false, error: "Erreur lors de la création du pointage" };
  }
}
