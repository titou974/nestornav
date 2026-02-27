"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    company: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("name", formData.name);
    data.append("company", formData.company);

    const result = await signUpAction(data);

    if (!result.success) {
      setError(result.error || "Une erreur est survenue");
      setIsLoading(false);
      return;
    }

    router.push("/patron/login?registered=true");
  }

  return (
    <div className="bg-[var(--surface)] p-8 rounded-[var(--radius)] border border-[var(--border)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Créer un compte Patron</h1>
        <p className="text-[var(--muted)]">
          Créez votre compte pour gérer vos chantiers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[var(--danger)]/10 text-[var(--danger)] p-3 rounded-[var(--radius)] text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2">
            Nom de l'entreprise
          </label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-[var(--field-background)] border border-[var(--field-border)] rounded-[var(--field-radius)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="Construction Réunion"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Votre nom
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 bg-[var(--field-background)] border border-[var(--field-border)] rounded-[var(--field-radius)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="Jean Dupont"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-[var(--field-background)] border border-[var(--field-border)] rounded-[var(--field-radius)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="patron@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-[var(--field-background)] border border-[var(--field-border)] rounded-[var(--field-radius)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-[var(--field-background)] border border-[var(--field-border)] rounded-[var(--field-radius)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          fullWidth
          isPending={isLoading}
          isDisabled={isLoading}
        >
          Créer mon compte
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--muted)]">Déjà un compte ? </span>
        <Link
          href="/patron/login"
          className="text-[var(--accent)] hover:underline font-medium"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
