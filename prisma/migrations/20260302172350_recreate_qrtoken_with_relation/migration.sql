/*
  Warnings:

  - You are about to drop the column `token` on the `clock_ins` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiresAt` on the `clock_ins` table. All the data in the column will be lost.
  - You are about to drop the column `tokenUsedAt` on the `clock_ins` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qrTokenId]` on the table `clock_ins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrTokenId` to the `clock_ins` table without a default value. This is not possible if the table is not empty.

*/
-- Étape 1: Créer la table qr_tokens
CREATE TABLE "qr_tokens" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "consumedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_tokens_pkey" PRIMARY KEY ("id")
);

-- Étape 2: Créer les index sur qr_tokens
CREATE UNIQUE INDEX "qr_tokens_token_key" ON "qr_tokens"("token");
CREATE INDEX "qr_tokens_token_consumed_expiresAt_idx" ON "qr_tokens"("token", "consumed", "expiresAt");

-- Étape 3: Ajouter les foreign keys sur qr_tokens
ALTER TABLE "qr_tokens" ADD CONSTRAINT "qr_tokens_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "qr_tokens" ADD CONSTRAINT "qr_tokens_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Étape 4: Migrer les données existantes de clock_ins vers qr_tokens
INSERT INTO "qr_tokens" ("id", "tenantId", "siteId", "token", "consumed", "consumedAt", "expiresAt", "createdAt")
SELECT 
  gen_random_uuid()::text,
  "tenantId",
  "siteId",
  "token",
  true, -- Tous les tokens existants sont déjà consommés
  "tokenUsedAt",
  "tokenExpiresAt",
  "createdAt"
FROM "clock_ins";

-- Étape 5: Ajouter la colonne qrTokenId (nullable temporairement)
ALTER TABLE "clock_ins" ADD COLUMN "qrTokenId" TEXT;

-- Étape 6: Remplir qrTokenId en matchant avec les tokens créés
UPDATE "clock_ins" 
SET "qrTokenId" = "qr_tokens"."id"
FROM "qr_tokens"
WHERE "clock_ins"."token" = "qr_tokens"."token";

-- Étape 7: Rendre qrTokenId NOT NULL maintenant qu'il est rempli
ALTER TABLE "clock_ins" ALTER COLUMN "qrTokenId" SET NOT NULL;

-- Étape 8: Supprimer les anciennes colonnes token
-- DropIndex
DROP INDEX "clock_ins_token_key";
DROP INDEX "clock_ins_token_tokenExpiresAt_idx";

-- AlterTable
ALTER TABLE "clock_ins" DROP COLUMN "token";
ALTER TABLE "clock_ins" DROP COLUMN "tokenExpiresAt";
ALTER TABLE "clock_ins" DROP COLUMN "tokenUsedAt";

-- Étape 9: Créer les index et contraintes finales
CREATE UNIQUE INDEX "clock_ins_qrTokenId_key" ON "clock_ins"("qrTokenId");
CREATE INDEX "clock_ins_qrTokenId_idx" ON "clock_ins"("qrTokenId");

-- Étape 10: Ajouter la foreign key de clock_ins vers qr_tokens
ALTER TABLE "clock_ins" ADD CONSTRAINT "clock_ins_qrTokenId_fkey" FOREIGN KEY ("qrTokenId") REFERENCES "qr_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
