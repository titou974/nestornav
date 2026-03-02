import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/qr-generator";

interface QRPageProps {
  params: Promise<{ id: string }>;
}

export default async function QRPage({ params }: QRPageProps) {
  const { id } = await params;

  // Vérifier que le site existe
  const site = await prisma.site.findUnique({
    where: { id },
  });

  if (!site) {
    notFound();
  }

  // Créer un QrToken en base de données
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token valide 24h

  await prisma.qrToken.create({
    data: {
      token,
      siteId: site.id,
      tenantId: site.tenantId,
      expiresAt,
    },
  });

  // Rediriger vers le formulaire avec le token
  redirect(`/check?token=${token}`);
}
