import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

// Route publique - pas besoin d'authentification
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  try {
    const { tenantId } = await params;

    const employees = await prisma.employee.findMany({
      where: { tenantId, isActive: true },
      orderBy: { firstName: "asc" },
    });

    return successResponse(employees);
  } catch (error) {
    return handleApiError(error);
  }
}
