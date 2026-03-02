import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/auth";
import { generateQRCode, generateToken } from "@/lib/qr-generator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    const tenantId = await getTenantId();
    const body = await request.json();
    const { siteId, expiresInHours = 24 } = body;

    if (!siteId) {
      return errorResponse("siteId requis", 400);
    }

    // Vérifier que le site appartient au tenant
    const site = await prisma.site.findFirst({
      where: { id: siteId, tenantId },
    });

    if (!site) {
      return errorResponse("Site non trouvé", 404);
    }

    // Générer un token unique
    const token = generateToken();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    // Créer le QrToken en base de données
    const qrToken = await prisma.qrToken.create({
      data: {
        token,
        siteId,
        tenantId: site.tenantId,
        expiresAt,
      },
    });

    // Créer l'URL de pointage avec le token
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const pointageUrl = `${baseUrl}/check?token=${token}`;

    // Générer le QR code
    const qrCodeDataURL = await QRCode.toDataURL(pointageUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return successResponse(
      {
        token: qrToken.token,
        qrCodeDataURL,
        pointageUrl,
        expiresAt,
        siteId,
        siteName: site.name,
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
