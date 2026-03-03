import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

// Pas de revalidate car les tokens sont éphémères
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const qrToken = await prisma.qrToken.findUnique({
      where: { token },
      include: { site: true },
    });

    if (!qrToken) {
      return errorResponse("Token not found", 404);
    }

    if (qrToken.consumed) {
      return errorResponse("Token déjà utilisé", 400);
    }

    if (new Date() > qrToken.expiresAt) {
      return errorResponse("Token expiré", 400);
    }

    return successResponse(qrToken);
  } catch (error) {
    return handleApiError(error);
  }
}
