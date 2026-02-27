import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClockInSchema } from "@/lib/validations";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createClockInSchema.parse(body);

    // Récupérer le site pour obtenir le tenantId
    const site = await prisma.site.findUnique({
      where: { id: validated.siteId },
      select: { tenantId: true },
    });

    if (!site) {
      return successResponse({ success: false, error: "Site non trouvé" }, 404);
    }

    const clockIn = await prisma.clockIn.create({
      data: {
        tenantId: site.tenantId,
        siteId: validated.siteId,
        employeeId: validated.employeeId,
        action: validated.action,
        timestamp: validated.timestamp || new Date(),
      },
      include: {
        employee: true,
        site: true,
      },
    });

    return successResponse(clockIn, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
