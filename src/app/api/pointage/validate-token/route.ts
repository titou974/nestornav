import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return errorResponse("Token requis", 400);
    }

    const qrToken = await prisma.qrToken.findUnique({
      where: { token },
      include: { site: true },
    });

    if (!qrToken) {
      return errorResponse("Token invalide", 404);
    }

    if (qrToken.used) {
      return errorResponse("Token déjà utilisé", 400);
    }

    if (new Date() > qrToken.expiresAt) {
      return errorResponse("Token expiré", 400);
    }

    // Marquer le token comme utilisé
    await prisma.qrToken.update({
      where: { id: qrToken.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    return successResponse({
      valid: true,
      siteId: qrToken.siteId,
      siteName: qrToken.site.name,
      tenantId: qrToken.tenantId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
