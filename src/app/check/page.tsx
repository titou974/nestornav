import { Alert } from "@heroui/react";
import { PointageForm } from "./pointage-form";
import { prisma } from "@/lib/prisma";
import { Employee } from "@/types/database";
import { QrCodeAnimation } from "@/components/qr-code-animation";

interface PointagePageProps {
  searchParams: Promise<{ token?: string }>;
}

interface TokenData {
  siteId: string;
  siteName: string;
  tenantId: string;
  token: string;
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

  // Décoder le token pour extraire siteId et tenantId
  let siteId: string;
  let tenantId: string;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");

    if (parts.length !== 3) {
      throw new Error("Format de token invalide");
    }

    [siteId, tenantId] = parts;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token invalide</Alert.Title>
              <Alert.Description>
                Le format du token est invalide. Veuillez scanner un nouveau QR
                code.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    );
  }

  // Vérifier que le site existe
  const site = await prisma.site.findFirst({
    where: { id: siteId, tenantId },
  });

  if (!site) {
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

  // Vérifier si ce token a déjà été utilisé (existe dans un ClockIn)
  const existingClockIn = await prisma.clockIn.findUnique({
    where: { token },
  });

  if (existingClockIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-4">
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Token déjà utilisé</Alert.Title>
              <Alert.Description>
                Ce QR code a déjà été utilisé pour un pointage. Veuillez
                rescanner le QR code pour effectuer une nouvelle action.
              </Alert.Description>
            </Alert.Content>
          </Alert>
          <QrCodeAnimation />
        </div>
      </div>
    );
  }

  // Récupérer les employés du tenant
  const employees = await prisma.employee.findMany({
    where: { tenantId, isActive: true },
    orderBy: { firstName: "asc" },
  });

  const tokenData: TokenData = {
    siteId,
    siteName: site.name,
    tenantId,
    token, // Passer le token encodé
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
