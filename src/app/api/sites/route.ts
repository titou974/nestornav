import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/auth";
import { createSiteSchema } from "@/lib/validations";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function GET() {
  try {
    const tenantId = await getTenantId();

    const sites = await prisma.site.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(sites);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = await getTenantId();
    const body = await request.json();

    const validated = createSiteSchema.parse(body);

    const site = await prisma.site.create({
      data: {
        ...validated,
        tenantId,
      },
    });

    return successResponse(site, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
