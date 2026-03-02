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

  // Créer un token encodé avec les infos du site
  const token = generateToken();
  const tokenData = `${site.id}:${site.tenantId}:${token}`;
  const encodedToken = Buffer.from(tokenData).toString("base64url");

  // Rediriger vers le formulaire avec le token encodé
  redirect(`/check?token=${encodedToken}`);
}
