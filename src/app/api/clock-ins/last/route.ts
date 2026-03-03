import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");
    const siteId = searchParams.get("siteId");

    if (!employeeId || !siteId) {
      return errorResponse("Missing employeeId or siteId", 400);
    }

    const lastClockIn = await prisma.clockIn.findFirst({
      where: {
        employeeId,
        siteId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return successResponse(lastClockIn);
  } catch (error) {
    return handleApiError(error);
  }
}
