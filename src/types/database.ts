import type { Prisma } from "@prisma/client";

// ============================================
// RE-EXPORT PRISMA TYPES
// ============================================

export type {
  Tenant,
  Site,
  Employee,
  ClockIn,
  QrToken,
  Anomaly,
  User,
  Account,
  Session,
  VerificationToken,
  ClockInAction,
  AnomalyType,
  AnomalyStatus,
} from "@prisma/client";

// ============================================
// UTILITY TYPES WITH RELATIONS
// ============================================

export type TenantWithSites = Prisma.TenantGetPayload<{
  include: { sites: true };
}>;

export type TenantWithEmployees = Prisma.TenantGetPayload<{
  include: { employees: true };
}>;

export type TenantWithAll = Prisma.TenantGetPayload<{
  include: {
    sites: true;
    employees: true;
    clockIns: true;
    qrTokens: true;
    anomalies: true;
  };
}>;

export type SiteWithClockIns = Prisma.SiteGetPayload<{
  include: { clockIns: true };
}>;

export type SiteWithQrTokens = Prisma.SiteGetPayload<{
  include: { qrTokens: true };
}>;

export type EmployeeWithClockIns = Prisma.EmployeeGetPayload<{
  include: { clockIns: true };
}>;

export type ClockInWithRelations = Prisma.ClockInGetPayload<{
  include: {
    tenant: true;
    site: true;
    employee: true;
  };
}>;

export type AnomalyWithRelations = Prisma.AnomalyGetPayload<{
  include: {
    tenant: true;
    relatedClockIn: true;
  };
}>;

export type UserWithTenant = Prisma.UserGetPayload<{
  include: { tenant: true };
}>;

// ============================================
// QUERY RESULT TYPES
// ============================================

export type EmployeeClockInSummary = {
  employeeId: string;
  firstName: string;
  lastName: string;
  totalClockIns: number;
  lastClockIn: Date | null;
};

export type SiteClockInStats = {
  siteId: string;
  siteName: string;
  totalClockIns: number;
  activeEmployees: number;
};

export type DailyClockInReport = {
  date: Date;
  siteId: string;
  siteName: string;
  employeeId: string;
  employeeName: string;
  startTime: Date | null;
  endTime: Date | null;
  totalHours: number | null;
};
