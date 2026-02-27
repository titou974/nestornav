"use client";

import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";

interface NewEmployeeFormProps {
  onSubmit: (data: { firstName: string; lastName: string; phone?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NewEmployeeForm({ onSubmit, onCancel, isLoading }: NewEmployeeFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      phone: phone || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Nouvel employé</h2>
        <p className="text-sm text-muted">
          Remplissez vos informations pour créer votre profil
        </p>
      </div>

      <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
          isRequired
          name="firstName"
          value={firstName}
          onChange={setFirstName}
        >
          <Label>Prénom</Label>
          <Input placeholder="Votre prénom" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          name="lastName"
          value={lastName}
          onChange={setLastName}
        >
          <Label>Nom</Label>
          <Input placeholder="Votre nom" />
          <FieldError />
        </TextField>

        <TextField
          name="phone"
          type="tel"
          value={phone}
          onChange={setPhone}
        >
          <Label>Téléphone (optionnel)</Label>
          <Input placeholder="0692 XX XX XX" />
          <FieldError />
        </TextField>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isPending={isLoading}
            isDisabled={!firstName || !lastName}
          >
            Créer mon profil
          </Button>
          <Button
            type="button"
            variant="outline"
            onPress={onCancel}
            isDisabled={isLoading}
          >
            Annuler
          </Button>
        </div>
      </Form>
    </div>
  );
}
