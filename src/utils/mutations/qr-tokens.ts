"use server";

import type { QrToken } from "@/types/database";

/**
 * Créer un nouveau QrToken
 * Utilise fetch POST - Pas de revalidateTag car les tokens sont éphémères
 */
export async function createQrToken(data: {
  token: string;
  siteId: string;
  tenantId: string;
  expiresAt: Date;
}): Promise<QrToken> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/qr/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to create QR token");
  }

  const result = await response.json();
  return result.data;
}
