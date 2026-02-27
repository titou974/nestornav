"use client";

import { Employee } from "@/types/database";
import { Button, Label, Select, ListBox } from "@heroui/react";

interface EmployeeSelectorProps {
  employees: Employee[];
  onSelectEmployee: (employeeId: string) => void;
  onNewEmployee: () => void;
}

export function EmployeeSelector({
  employees,
  onSelectEmployee,
  onNewEmployee,
}: EmployeeSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Sélectionnez votre nom</h2>
        <p className="text-sm text-muted">
          Choisissez votre nom dans la liste ou créez un nouveau profil
        </p>
      </div>

      <Select
        name="employee"
        placeholder="Sélectionnez un employé"
        onChange={(value) => {
          if (value) {
            onSelectEmployee(value as string);
          }
        }}
      >
        <Label>Employé</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox aria-label="Employés">
            {employees.length === 0 ? (
              <ListBox.Item
                id="no-employees"
                isDisabled
                textValue="Aucun employé"
              >
                Aucun employé disponible
              </ListBox.Item>
            ) : (
              employees.map((employee) => (
                <ListBox.Item
                  key={employee.id}
                  id={employee.id}
                  textValue={`${employee.firstName} ${employee.lastName}`}
                >
                  <div className="flex flex-col">
                    <Label>
                      {employee.firstName} {employee.lastName}
                    </Label>
                    {employee.phone && (
                      <span className="text-sm text-muted">
                        {employee.phone}
                      </span>
                    )}
                  </div>
                </ListBox.Item>
              ))
            )}
          </ListBox>
        </Select.Popover>
      </Select>

      <div className="border-t border-border pt-4">
        <Button variant="secondary" fullWidth onPress={onNewEmployee}>
          + Nouvel employé
        </Button>
      </div>
    </div>
  );
}
