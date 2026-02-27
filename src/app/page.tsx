export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold">Nestor Pointage</h1>
        <p className="text-lg text-gray-600">
          Système de gestion des pointages pour les chantiers
        </p>
        <div className="rounded-lg bg-primary/10 p-6 text-center">
          <p className="text-sm">Infrastructure configurée avec succès ✓</p>
        </div>
      </main>
    </div>
  );
}
