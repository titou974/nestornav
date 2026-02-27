"use client";

import { Button } from "@heroui/react";
import { ClockInAction } from "@/types/database";

interface ActionSelectorProps {
  onSelectAction: (action: ClockInAction) => void;
  disabled?: boolean;
}

const actions = [
  {
    value: "START" as ClockInAction,
    label: "Début",
    description: "Commencer la journée",
    icon: "▶",
    variant: "primary" as const,
  },
  {
    value: "PAUSE" as ClockInAction,
    label: "Pause",
    description: "Prendre une pause",
    icon: "⏸",
    variant: "secondary" as const,
  },
  {
    value: "END" as ClockInAction,
    label: "Fin",
    description: "Terminer la journée",
    icon: "⏹",
    variant: "danger" as const,
  },
];

export function ActionSelector({
  onSelectAction,
  disabled,
}: ActionSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Sélectionnez une action</h2>
        <p className="text-sm text-muted">
          Choisissez l&apos;action que vous souhaitez effectuer
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <Button
            key={action.value}
            variant={action.variant}
            className="h-auto py-6 flex-col gap-2"
            isDisabled={disabled}
            onPress={() => onSelectAction(action.value)}
          >
            <span className="text-3xl">{action.icon}</span>
            <span className="text-lg font-semibold">{action.label}</span>
            <span className="text-sm opacity-80">{action.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
