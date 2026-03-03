import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, action, timestamp, qrTokenId } = body;

    // Vérifier que le QrToken existe et n'est pas encore consommé
    const qrToken = await prisma.qrToken.findUnique({
      where: { id: qrTokenId },
      include: { site: true },
    });

    if (!qrToken) {
      return successResponse(
        { success: false, error: "Token non trouvé" },
        404,
      );
    }

    if (qrToken.consumed) {
      return successResponse(
        { success: false, error: "Token déjà utilisé" },
        400,
      );
    }

    if (new Date() > qrToken.expiresAt) {
      return successResponse({ success: false, error: "Token expiré" }, 400);
    }

    // Marquer le token comme consommé
    await prisma.qrToken.update({
      where: { id: qrToken.id },
      data: {
        consumed: true,
        consumedAt: new Date(),
      },
    });

    // Créer le ClockIn avec le qrTokenId existant
    const clockIn = await prisma.clockIn.create({
      data: {
        tenantId: qrToken.tenantId,
        siteId: qrToken.siteId,
        employeeId,
        action,
        timestamp: timestamp || new Date(),
        qrTokenId: qrToken.id,
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
