import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token: encodedToken } = body;

    if (!encodedToken) {
      return errorResponse("Token requis", 400);
    }

    // Décoder le token pour extraire siteId et tenantId
    let siteId: string;
    let tenantId: string;

    try {
      const decoded = Buffer.from(encodedToken, "base64url").toString("utf-8");
      const parts = decoded.split(":");

      if (parts.length !== 3) {
        return errorResponse("Format de token invalide", 400);
      }

      [siteId, tenantId] = parts;
    } catch (decodeError) {
      return errorResponse("Token invalide", 400);
    }

    // Vérifier que le site existe
    const site = await prisma.site.findFirst({
      where: { id: siteId, tenantId },
    });

    if (!site) {
      return errorResponse("Site non trouvé ou token invalide", 404);
    }

    return successResponse({
      valid: true,
      siteId,
      siteName: site.name,
      tenantId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
