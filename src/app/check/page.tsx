import { Alert } from "@heroui/react";
import { PointageForm } from "./pointage-form";
import { prisma } from "@/lib/prisma";
import { Employee } from "@/types/database";

interface PointagePageProps {
  searchParams: Promise<{ token?: string }>;
}

interface TokenData {
  siteId: string;
  siteName: string;
  tenantId: string;
  tokenId: string;
  employees: Employee[];
}

export default async function PointagePage({
  searchParams,
}: PointagePageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full ">
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token manquant</Alert.Title>
              <Alert.Description>
                Veuillez scanner un QR code valide pour accéder au pointage.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    );
  }

  // Validation du token côté serveur
  const qrToken = await prisma.qrToken.findUnique({
    where: { token },
    include: { site: true },
  });

  if (!qrToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token invalide</Alert.Title>
              <Alert.Description>
                Ce QR code n&apos;est pas valide. Veuillez scanner un nouveau
                code.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    );
  }

  if (qrToken.used) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Veuillez rescanner le QrCode</Alert.Title>
              <Alert.Description>
                Vous avez déjà pointé, veuillez re-scanner le QrCode
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    );
  }

  if (new Date() > qrToken.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token expiré</Alert.Title>
              <Alert.Description>
                Ce lien a expiré. Veuillez re-scanner le QrCode.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    );
  }

  // Récupérer les employés du tenant
  const employees = await prisma.employee.findMany({
    where: { tenantId: qrToken.tenantId, isActive: true },
    orderBy: { firstName: "asc" },
  });

  const tokenData: TokenData = {
    siteId: qrToken.siteId,
    siteName: qrToken.site.name,
    tenantId: qrToken.tenantId,
    tokenId: qrToken.id,
    employees,
  };

  return (
    <div className="min-h-screen flex items-start justify-start p-4 bg-background flex-col gap-6">
      {tokenData && (
        <div className="bg-[#111111] rounded-lg border border-border p-4 w-full max-w-md justify-self-start mx-auto">
          <div className="text-sm text-muted">Bienvenue sur le site de</div>
          <div className="text-xl font-semibold">{tokenData.siteName}</div>
        </div>
      )}
      <PointageForm tokenData={tokenData} />
    </div>
  );
}
