import Link from "next/link";
import { Button } from "@heroui/react";
import {
  ClockIcon,
  QrCodeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Nestor Pointage
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted sm:text-2xl">
              Simplifiez la gestion des pointages de vos équipes terrain
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted/80">
              Une solution moderne et sécurisée pour suivre les heures de
              travail de vos agents de sécurité, livreurs et intérimaires en
              temps réel, sans paperasse ni complications.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/patron/register">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/patron/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-30" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Pourquoi choisir Nestor ?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Une solution adaptée aux PME : sécurité, livraison, intérim et
              services
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-border bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <QrCodeIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">QR Code Sécurisé</h3>
              <p className="mt-2 text-muted">
                Chaque site dispose d&apos;un QR code unique et sécurisé. Vos
                équipes pointent en un scan, sans contact ni badge à perdre.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-border bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ClockIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Suivi en Temps Réel
              </h3>
              <p className="mt-2 text-muted">
                Visualisez instantanément qui est présent sur chaque site.
                Début, pause, fin de service : tout est enregistré
                automatiquement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-border bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DevicePhoneMobileIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                100% Mobile & Simple
              </h3>
              <p className="mt-2 text-muted">
                Aucune application à installer. Vos équipes utilisent simplement
                leur smartphone pour scanner le QR code du site.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-border bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Détection d&apos;Anomalies
              </h3>
              <p className="mt-2 text-muted">
                Le système détecte automatiquement les comportements suspects :
                pointages multiples, heures impossibles, oublis de fin de
                journée.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border border-border bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ChartBarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Rapports & Statistiques
              </h3>
              <p className="mt-2 text-muted">
                Exportez facilement les heures travaillées pour la paie.
                Analysez la productivité de vos sites en quelques clics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border border-border bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BoltIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Déploiement Rapide</h3>
              <p className="mt-2 text-muted">
                Créez votre compte, ajoutez vos sites et équipes. Générez les QR
                codes et commencez à pointer en moins de 5 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-surface/50 px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Trois étapes simples pour digitaliser le suivi de vos équipes
              terrain
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold">Créez vos sites</h3>
              <p className="mt-2 text-muted">
                Ajoutez vos sites d&apos;intervention et générez un QR code
                unique pour chacun. Imprimez-le et affichez-le sur place.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold">
                Vos équipes pointent
              </h3>
              <p className="mt-2 text-muted">
                En arrivant sur site, ils scannent le QR code avec leur
                smartphone et sélectionnent leur nom. C&apos;est tout !
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold">Suivez et exportez</h3>
              <p className="mt-2 text-muted">
                Consultez les présences en temps réel depuis votre tableau de
                bord. Exportez les données pour la paie en un clic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Prêt à simplifier vos pointages ?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Rejoignez les PME françaises qui font confiance à Nestor pour
              gérer leurs équipes terrain.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/patron/register">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Créer mon compte gratuitement
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted/60">
              Aucune carte bancaire requise • Configuration en 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-sm text-muted">
            <p>© 2026 Nestor Pointage • France</p>
            <p className="mt-2">
              Solution de gestion des temps pour les PME avec équipes terrain
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
