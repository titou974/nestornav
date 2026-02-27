import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/auth";
import { updateEmployeeSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantId();
    const { id } = await params;

    const employee = await prisma.employee.findFirst({
      where: { id, tenantId, isActive: true },
    });

    if (!employee) {
      return errorResponse("Employé non trouvé", 404);
    }

    return successResponse(employee);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantId();
    const { id } = await params;
    const body = await request.json();

    const validated = updateEmployeeSchema.parse(body);

    const employee = await prisma.employee.updateMany({
      where: { id, tenantId },
      data: validated,
    });

    if (employee.count === 0) {
      return errorResponse("Employé non trouvé", 404);
    }

    const updated = await prisma.employee.findUnique({
      where: { id },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantId();
    const { id } = await params;

    // Soft delete
    const employee = await prisma.employee.updateMany({
      where: { id, tenantId },
      data: { isActive: false },
    });

    if (employee.count === 0) {
      return errorResponse("Employé non trouvé", 404);
    }

    return successResponse({ message: "Employé supprimé avec succès" });
  } catch (error) {
    return handleApiError(error);
  }
}
