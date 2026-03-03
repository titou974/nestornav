import { Alert } from "@heroui/react";
import { PointageForm } from "./pointage-form";
import { Employee } from "@/types/database";
import { QrCodeAnimation } from "@/components/qr-code-animation";
import { getQrTokenByToken } from "@/utils/queries/qr-tokens";
import { getEmployeesByTenantId } from "@/utils/queries/employees";
import { prisma } from "@/lib/prisma";

interface PointagePageProps {
  searchParams: Promise<{ token?: string }>;
}

interface TokenData {
  qrTokenId: string;
  siteId: string;
  siteName: string;
  tenantId: string;
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
          <Alert status="danger" className="rounded-lg">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token manquant</Alert.Title>
              <Alert.Description>
                Aucun token QR n&apos;a été fourni. Veuillez scanner un QR code
                valide.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    );
  }

  // Vérifier que le token existe en base de données
  const qrToken = await prisma.qrToken.findUnique({
    where: { token },
    include: { site: true },
  });

  if (!qrToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Alert status="danger" className="rounded-lg">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token invalide</Alert.Title>
              <Alert.Description>
                Veuillez scanner un nouveau QR code.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    );
  }

  // Vérifier si le token a déjà été consommé
  if (qrToken.consumed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-4">
          <Alert status="danger" className="rounded-lg">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token déjà utilisé</Alert.Title>
              <Alert.Description>
                Veuillez rescanner le QR code pour effectuer une nouvelle
                action.
              </Alert.Description>
            </Alert.Content>
          </Alert>
          <QrCodeAnimation />
        </div>
      </div>
    );
  }

  // Vérifier si le token a expiré
  if (new Date() > qrToken.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-4">
          <Alert status="danger" className="rounded-lg">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token expiré</Alert.Title>
              <Alert.Description>
                Ce QR code a expiré. Veuillez en générer un nouveau.
              </Alert.Description>
            </Alert.Content>
          </Alert>
          <QrCodeAnimation />
        </div>
      </div>
    );
  }

  // Récupérer les employés du tenant
  const employees = await getEmployeesByTenantId(qrToken.tenantId);

  const tokenData: TokenData = {
    qrTokenId: qrToken.id,
    siteId: qrToken.siteId,
    siteName: qrToken.site.name,
    tenantId: qrToken.tenantId,
    employees,
  };

  return (
    <div className="min-h-screen flex items-start justify-start p-4 bg-background flex-col gap-6">
      {tokenData && (
        <div className="bg-[#111111] rounded-lg border border-border p-4 w-full max-w-md justify-self-start mx-auto">
          <div className="text-xl font-semibold">{tokenData.siteName}</div>
        </div>
      )}
      <PointageForm tokenData={tokenData} />
    </div>
  );
}
