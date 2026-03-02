/*
  Warnings:

  - You are about to drop the `qr_tokens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `clock_ins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `clock_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenExpiresAt` to the `clock_ins` table without a default value. This is not possible if the table is not empty.

*/

-- Étape 1: Ajouter les colonnes avec des valeurs par défaut temporaires
ALTER TABLE "clock_ins" ADD COLUMN "token" TEXT;
ALTER TABLE "clock_ins" ADD COLUMN "tokenExpiresAt" TIMESTAMP(3);
ALTER TABLE "clock_ins" ADD COLUMN "tokenUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Étape 2: Générer des tokens uniques pour les pointages existants
UPDATE "clock_ins" 
SET 
  "token" = 'legacy-' || "id",
  "tokenExpiresAt" = "createdAt" + INTERVAL '1 year'
WHERE "token" IS NULL;

-- Étape 3: Rendre les colonnes NOT NULL maintenant qu'elles ont des valeurs
ALTER TABLE "clock_ins" ALTER COLUMN "token" SET NOT NULL;
ALTER TABLE "clock_ins" ALTER COLUMN "tokenExpiresAt" SET NOT NULL;

-- Étape 4: Supprimer les contraintes de clés étrangères de qr_tokens
ALTER TABLE "qr_tokens" DROP CONSTRAINT "qr_tokens_siteId_fkey";
ALTER TABLE "qr_tokens" DROP CONSTRAINT "qr_tokens_tenantId_fkey";

-- Étape 5: Supprimer la table qr_tokens
DROP TABLE "qr_tokens";

-- Étape 6: Créer les index
CREATE UNIQUE INDEX "clock_ins_token_key" ON "clock_ins"("token");
CREATE INDEX "clock_ins_token_tokenExpiresAt_idx" ON "clock_ins"("token", "tokenExpiresAt");
