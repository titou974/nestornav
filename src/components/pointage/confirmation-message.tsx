"use client";

import { Alert, Button } from "@heroui/react";
import { ClockInAction } from "@prisma/client";

interface ConfirmationMessageProps {
  employeeName: string;
  action: ClockInAction;
  timestamp: Date;
  onNewClockIn: () => void;
}

const actionLabels: Record<ClockInAction, string> = {
  START: "Début de journée",
  PAUSE: "Pause",
  END: "Fin de journée",
};

export function ConfirmationMessage({
  employeeName,
  action,
  timestamp,
  onNewClockIn,
}: ConfirmationMessageProps) {
  const formattedTime = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(timestamp);

  return (
    <div className="flex flex-col gap-6">
      <Alert status="success">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Pointage enregistré avec succès</Alert.Title>
          <Alert.Description>
            Votre pointage a été enregistré dans le système
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-accent mb-2">{formattedTime}</div>
          <div className="text-sm text-muted">{formattedDate}</div>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted">Employé</span>
            <span className="font-medium">{employeeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Action</span>
            <span className="font-medium">{actionLabels[action]}</span>
          </div>
        </div>
      </div>

      <Button variant="primary" fullWidth onPress={onNewClockIn}>
        Nouveau pointage
      </Button>
    </div>
  );
}
