import { z } from "zod";

// ============================================
// ENUMS
// ============================================

export const clockInActionEnum = z.enum(["START", "PAUSE", "END"]);
export const anomalyStatusEnum = z.enum(["PENDING", "REVIEWED", "RESOLVED"]);
export const anomalyTypeEnum = z.enum([
  "DUPLICATE_CLOCK_IN",
  "IMPOSSIBLE_HOURS",
  "MISSING_END",
  "EXCESSIVE_HOURS",
  "SUSPICIOUS_PATTERN",
]);

// ============================================
// TENANT SCHEMAS
// ============================================

export const createTenantSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().min(1, "Le nom est requis"),
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
});

export const updateTenantSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .optional(),
  name: z.string().min(1, "Le nom est requis").optional(),
  company: z.string().min(1, "Le nom de l'entreprise est requis").optional(),
});

// ============================================
// SITE SCHEMAS
// ============================================

export const createSiteSchema = z.object({
  name: z.string().min(1, "Le nom du site est requis"),
  address: z.string().optional().nullable(),
  qrCodeUrl: z.string().url("URL invalide").optional().nullable(),
});

export const updateSiteSchema = z.object({
  name: z.string().min(1, "Le nom du site est requis").optional(),
  address: z.string().optional().nullable(),
  qrCodeUrl: z.string().url("URL invalide").optional().nullable(),
});

// ============================================
// EMPLOYEE SCHEMAS
// ============================================

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateEmployeeSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").optional(),
  lastName: z.string().min(1, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional().nullable(),
  isActive: z.boolean().optional(),
});

// ============================================
// CLOCKIN SCHEMAS
// ============================================

export const createClockInSchema = z.object({
  siteId: z.string().cuid("ID de site invalide"),
  employeeId: z.string().cuid("ID d'employé invalide"),
  action: clockInActionEnum,
  timestamp: z.date().optional(),
});

// ============================================
// QRTOKEN SCHEMAS
// ============================================

export const createQrTokenSchema = z.object({
  siteId: z.string().cuid("ID de site invalide"),
  token: z.string().min(1, "Le token est requis"),
  expiresAt: z.date(),
});

export const useQrTokenSchema = z.object({
  token: z.string().min(1, "Le token est requis"),
});

// ============================================
// ANOMALY SCHEMAS
// ============================================

export const createAnomalySchema = z.object({
  type: anomalyTypeEnum,
  description: z.string().min(1, "La description est requise"),
  relatedClockInId: z
    .string()
    .cuid("ID de pointage invalide")
    .optional()
    .nullable(),
});

export const updateAnomalySchema = z.object({
  status: anomalyStatusEnum.optional(),
  description: z.string().min(1, "La description est requise").optional(),
  resolvedAt: z.date().optional().nullable(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;

export type CreateSiteInput = z.infer<typeof createSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export type CreateClockInInput = z.infer<typeof createClockInSchema>;

export type CreateQrTokenInput = z.infer<typeof createQrTokenSchema>;
export type UseQrTokenInput = z.infer<typeof useQrTokenSchema>;

export type CreateAnomalyInput = z.infer<typeof createAnomalySchema>;
export type UpdateAnomalyInput = z.infer<typeof updateAnomalySchema>;
