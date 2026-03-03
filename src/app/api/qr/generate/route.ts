import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

// Route publique pour créer des QR tokens
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, siteId, tenantId, expiresAt } = body;

    const qrToken = await prisma.qrToken.create({
      data: {
        token,
        siteId,
        tenantId,
        expiresAt: new Date(expiresAt),
      },
    });

    return successResponse(qrToken, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
