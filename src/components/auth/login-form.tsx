"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@heroui/react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur est survenue");
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[var(--surface)] p-8 rounded-[var(--radius)] border border-[var(--border)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Connexion Patron</h1>
        <p className="text-[var(--muted)]">
          Connectez-vous pour accéder à votre dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[var(--danger)]/10 text-[var(--danger)] p-3 rounded-[var(--radius)] text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          Se connecter
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--muted)]">Pas encore de compte ? </span>
        <Link
          href="/patron/register"
          className="text-[var(--accent)] hover:underline font-medium"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
