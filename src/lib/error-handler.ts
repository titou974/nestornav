import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation error",
        details: error.issues,
      },
      { status: 400 },
    );
  }

  // Prisma errors - check by error code instead of instanceof
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string };

    // Unique constraint violation
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Cette ressource existe déjà",
        },
        { status: 409 },
      );
    }

    // Record not found
    if (prismaError.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Ressource non trouvée",
        },
        { status: 404 },
      );
    }
  }

  // Unauthorized error
  if (
    error instanceof Error &&
    error.message === "Unauthorized - Authentication required"
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentification requise",
      },
      { status: 401 },
    );
  }

  // Generic error
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      success: false,
      error: "Une erreur interne est survenue",
    },
    { status: 500 },
  );
}
