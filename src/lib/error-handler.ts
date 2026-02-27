import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

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

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Cette ressource existe déjà",
        },
        { status: 409 },
      );
    }

    // Record not found
    if (error.code === "P2025") {
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
