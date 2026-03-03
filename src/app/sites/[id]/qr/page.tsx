import { notFound, redirect } from "next/navigation";
import { generateToken } from "@/lib/qr-generator";
import { getSiteById } from "@/utils/queries/sites";
import { createQrToken } from "@/utils/mutations/qr-tokens";

interface QRPageProps {
  params: Promise<{ id: string }>;
}

export default async function QRPage({ params }: QRPageProps) {
  const { id } = await params;

  // Vérifier que le site existe (API publique)
  const site = await getSiteById(id);

  if (!site) {
    notFound();
  }

  // Créer un QrToken en base de données
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token valide 24h

  await createQrToken({
    token,
    siteId: site.id,
    tenantId: site.tenantId,
    expiresAt,
  });

  // Rediriger vers le formulaire avec le token
  redirect(`/check?token=${token}`);
}
