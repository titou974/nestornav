import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/auth";
import { updateSiteSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantId();
    const { id } = await params;

    const site = await prisma.site.findFirst({
      where: { id, tenantId },
    });

    if (!site) {
      return errorResponse("Site non trouvé", 404);
    }

    return successResponse(site);
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

    const validated = updateSiteSchema.parse(body);

    const site = await prisma.site.updateMany({
      where: { id, tenantId },
      data: validated,
    });

    if (site.count === 0) {
      return errorResponse("Site non trouvé", 404);
    }

    const updated = await prisma.site.findUnique({
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

    const site = await prisma.site.deleteMany({
      where: { id, tenantId },
    });

    if (site.count === 0) {
      return errorResponse("Site non trouvé", 404);
    }

    return successResponse({ message: "Site supprimé avec succès" });
  } catch (error) {
    return handleApiError(error);
  }
}
