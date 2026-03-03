import type { QrToken } from "@/types/database";

export async function getQrTokenByToken(
  token: string,
): Promise<
  (QrToken & { site: { id: string; name: string; tenantId: string } }) | null
> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/qr-tokens/${token}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data || null;
}

export async function validateQrToken(token: string): Promise<{
  valid: boolean;
  qrToken?: QrToken & { site: { id: string; name: string; tenantId: string } };
  error?: string;
}> {
  const qrToken = await getQrTokenByToken(token);

  if (!qrToken) {
    return { valid: false, error: "Token invalide" };
  }

  if (qrToken.consumed) {
    return { valid: false, error: "Token déjà utilisé" };
  }

  if (new Date() > qrToken.expiresAt) {
    return { valid: false, error: "Token expiré" };
  }

  return { valid: true, qrToken };
}
