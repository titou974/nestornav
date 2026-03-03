import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/auth";
import { createEmployeeSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function GET() {
  try {
    const tenantId = await getTenantId();

    const employees = await prisma.employee.findMany({
      where: { tenantId, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(employees);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = createEmployeeSchema.parse(body);

    // tenantId doit être fourni dans le body
    if (!body.tenantId) {
      return errorResponse("tenantId est requis", 400);
    }

    const employee = await prisma.employee.create({
      data: {
        ...validated,
        tenantId: body.tenantId,
      },
    });

    return successResponse(employee, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
