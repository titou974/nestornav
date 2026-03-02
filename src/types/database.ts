// ============================================
// ENUMS (as string literal types for compatibility)
// ============================================

export type ClockInAction = "START" | "PAUSE" | "END";

export type AnomalyType =
  | "DUPLICATE_CLOCK_IN"
  | "IMPOSSIBLE_HOURS"
  | "MISSING_END"
  | "EXCESSIVE_HOURS"
  | "SUSPICIOUS_PATTERN";

export type AnomalyStatus = "PENDING" | "REVIEWED" | "RESOLVED";

// ============================================
// BASE MODELS
// ============================================

export interface Tenant {
  id: string;
  email: string;
  password: string;
  name: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Site {
  id: string;
  tenantId: string;
  name: string;
  address: string | null;
  qrCodeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClockIn {
  id: string;
  tenantId: string;
  siteId: string;
  employeeId: string;
  action: ClockInAction;
  timestamp: Date;
  createdAt: Date;
  // QR Token fields (fusionné depuis QrToken)
  token: string;
  tokenUsedAt: Date;
  tokenExpiresAt: Date;
}

// QrToken a été fusionné dans ClockIn - conservé pour compatibilité temporaire
// @deprecated Utiliser ClockIn à la place
export interface QrToken {
  id: string;
  tenantId: string;
  siteId: string;
  token: string;
  used: boolean;
  usedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface Anomaly {
  id: string;
  tenantId: string;
  type: AnomalyType;
  description: string;
  status: AnomalyStatus;
  relatedClockInId: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  tenantId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  sessionToken: string;
  userId: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// ============================================
// UTILITY TYPES WITH RELATIONS
// ============================================

export interface TenantWithSites extends Tenant {
  sites: Site[];
}

export interface TenantWithEmployees extends Tenant {
  employees: Employee[];
}

export interface TenantWithAll extends Tenant {
  sites: Site[];
  employees: Employee[];
  clockIns: ClockIn[];
  anomalies: Anomaly[];
}

export interface SiteWithClockIns extends Site {
  clockIns: ClockIn[];
}

// @deprecated QrToken a été fusionné dans ClockIn
export interface SiteWithQrTokens extends Site {
  qrTokens: QrToken[];
}

export interface EmployeeWithClockIns extends Employee {
  clockIns: ClockIn[];
}

export interface ClockInWithRelations extends ClockIn {
  tenant: Tenant;
  site: Site;
  employee: Employee;
}

export interface AnomalyWithRelations extends Anomaly {
  tenant: Tenant;
  relatedClockIn: ClockIn | null;
}

export interface UserWithTenant extends User {
  tenant: Tenant | null;
}

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
