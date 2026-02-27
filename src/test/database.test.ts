import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import {
  createTenantSchema,
  createEmployeeSchema,
  createClockInSchema,
} from "../lib/validations";
import { prisma } from "../lib/prisma";

describe("Database Layer", () => {
  let testTenantId: string;
  let testSiteId: string;
  let testEmployeeId: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.clockIn.deleteMany();
    await prisma.qrToken.deleteMany();
    await prisma.anomaly.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.site.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  });

  describe("Prisma Connection", () => {
    it("should connect to database successfully", async () => {
      const result = await prisma.$queryRaw`SELECT 1 as result`;
      expect(result).toBeDefined();
    });
  });

  describe("Tenant Model", () => {
    it("should create a tenant", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const tenant = await prisma.tenant.create({
        data: {
          email: "test@example.com",
          password: hashedPassword,
          name: "Test User",
          company: "Test Company",
        },
      });

      expect(tenant.id).toBeDefined();
      expect(tenant.email).toBe("test@example.com");
      expect(tenant.company).toBe("Test Company");
      testTenantId = tenant.id;
    });

    it("should enforce unique email constraint", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await prisma.tenant.create({
        data: {
          email: "duplicate@example.com",
          password: hashedPassword,
          name: "User 1",
          company: "Company 1",
        },
      });

      await expect(
        prisma.tenant.create({
          data: {
            email: "duplicate@example.com",
            password: hashedPassword,
            name: "User 2",
            company: "Company 2",
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe("Site Model", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const tenant = await prisma.tenant.create({
        data: {
          email: "tenant@example.com",
          password: hashedPassword,
          name: "Tenant",
          company: "Company",
        },
      });
      testTenantId = tenant.id;
    });

    it("should create a site with tenant relation", async () => {
      const site = await prisma.site.create({
        data: {
          tenantId: testTenantId,
          name: "Test Site",
          address: "123 Test Street",
        },
      });

      expect(site.id).toBeDefined();
      expect(site.tenantId).toBe(testTenantId);
      expect(site.name).toBe("Test Site");
      testSiteId = site.id;
    });

    it("should cascade delete sites when tenant is deleted", async () => {
      const site = await prisma.site.create({
        data: {
          tenantId: testTenantId,
          name: "Test Site",
        },
      });

      await prisma.tenant.delete({ where: { id: testTenantId } });

      const deletedSite = await prisma.site.findUnique({
        where: { id: site.id },
      });
      expect(deletedSite).toBeNull();
    });
  });

  describe("Employee Model", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const tenant = await prisma.tenant.create({
        data: {
          email: "tenant@example.com",
          password: hashedPassword,
          name: "Tenant",
          company: "Company",
        },
      });
      testTenantId = tenant.id;
    });

    it("should create an employee", async () => {
      const employee = await prisma.employee.create({
        data: {
          tenantId: testTenantId,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "0692123456",
        },
      });

      expect(employee.id).toBeDefined();
      expect(employee.firstName).toBe("John");
      expect(employee.isActive).toBe(true);
      testEmployeeId = employee.id;
    });

    it("should allow employee without email", async () => {
      const employee = await prisma.employee.create({
        data: {
          tenantId: testTenantId,
          firstName: "Jane",
          lastName: "Smith",
          phone: "0692234567",
        },
      });

      expect(employee.email).toBeNull();
    });
  });

  describe("ClockIn Model", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const tenant = await prisma.tenant.create({
        data: {
          email: "tenant@example.com",
          password: hashedPassword,
          name: "Tenant",
          company: "Company",
        },
      });
      testTenantId = tenant.id;

      const site = await prisma.site.create({
        data: {
          tenantId: testTenantId,
          name: "Test Site",
        },
      });
      testSiteId = site.id;

      const employee = await prisma.employee.create({
        data: {
          tenantId: testTenantId,
          firstName: "John",
          lastName: "Doe",
        },
      });
      testEmployeeId = employee.id;
    });

    it("should create a clock-in with all relations", async () => {
      const clockIn = await prisma.clockIn.create({
        data: {
          tenantId: testTenantId,
          siteId: testSiteId,
          employeeId: testEmployeeId,
          action: "START",
        },
        include: {
          tenant: true,
          site: true,
          employee: true,
        },
      });

      expect(clockIn.id).toBeDefined();
      expect(clockIn.action).toBe("START");
      expect(clockIn.tenant.id).toBe(testTenantId);
      expect(clockIn.site.id).toBe(testSiteId);
      expect(clockIn.employee.id).toBe(testEmployeeId);
    });

    it("should support all clock-in actions", async () => {
      const actions = ["START", "PAUSE", "END"] as const;

      for (const action of actions) {
        const clockIn = await prisma.clockIn.create({
          data: {
            tenantId: testTenantId,
            siteId: testSiteId,
            employeeId: testEmployeeId,
            action,
          },
        });

        expect(clockIn.action).toBe(action);
      }
    });
  });

  describe("QrToken Model", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const tenant = await prisma.tenant.create({
        data: {
          email: "tenant@example.com",
          password: hashedPassword,
          name: "Tenant",
          company: "Company",
        },
      });
      testTenantId = tenant.id;

      const site = await prisma.site.create({
        data: {
          tenantId: testTenantId,
          name: "Test Site",
        },
      });
      testSiteId = site.id;
    });

    it("should create a QR token", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const qrToken = await prisma.qrToken.create({
        data: {
          tenantId: testTenantId,
          siteId: testSiteId,
          token: "TEST-TOKEN-001",
          expiresAt: tomorrow,
        },
      });

      expect(qrToken.id).toBeDefined();
      expect(qrToken.token).toBe("TEST-TOKEN-001");
      expect(qrToken.used).toBe(false);
    });

    it("should enforce unique token constraint", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await prisma.qrToken.create({
        data: {
          tenantId: testTenantId,
          siteId: testSiteId,
          token: "DUPLICATE-TOKEN",
          expiresAt: tomorrow,
        },
      });

      await expect(
        prisma.qrToken.create({
          data: {
            tenantId: testTenantId,
            siteId: testSiteId,
            token: "DUPLICATE-TOKEN",
            expiresAt: tomorrow,
          },
        }),
      ).rejects.toThrow();
    });

    it("should mark token as used", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const qrToken = await prisma.qrToken.create({
        data: {
          tenantId: testTenantId,
          siteId: testSiteId,
          token: "USE-TOKEN",
          expiresAt: tomorrow,
        },
      });

      const updatedToken = await prisma.qrToken.update({
        where: { id: qrToken.id },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });

      expect(updatedToken.used).toBe(true);
      expect(updatedToken.usedAt).toBeDefined();
    });
  });

  describe("Anomaly Model", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const tenant = await prisma.tenant.create({
        data: {
          email: "tenant@example.com",
          password: hashedPassword,
          name: "Tenant",
          company: "Company",
        },
      });
      testTenantId = tenant.id;
    });

    it("should create an anomaly", async () => {
      const anomaly = await prisma.anomaly.create({
        data: {
          tenantId: testTenantId,
          type: "MISSING_END",
          description: "Employee did not clock out",
          status: "PENDING",
        },
      });

      expect(anomaly.id).toBeDefined();
      expect(anomaly.type).toBe("MISSING_END");
      expect(anomaly.status).toBe("PENDING");
    });

    it("should support all anomaly types", async () => {
      const types = [
        "DUPLICATE_CLOCK_IN",
        "IMPOSSIBLE_HOURS",
        "MISSING_END",
        "EXCESSIVE_HOURS",
        "SUSPICIOUS_PATTERN",
      ] as const;

      for (const type of types) {
        const anomaly = await prisma.anomaly.create({
          data: {
            tenantId: testTenantId,
            type,
            description: `Test ${type}`,
          },
        });

        expect(anomaly.type).toBe(type);
      }
    });
  });

  describe("Multi-tenant Isolation", () => {
    let tenant1Id: string;
    let tenant2Id: string;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      const tenant1 = await prisma.tenant.create({
        data: {
          email: "tenant1@example.com",
          password: hashedPassword,
          name: "Tenant 1",
          company: "Company 1",
        },
      });
      tenant1Id = tenant1.id;

      const tenant2 = await prisma.tenant.create({
        data: {
          email: "tenant2@example.com",
          password: hashedPassword,
          name: "Tenant 2",
          company: "Company 2",
        },
      });
      tenant2Id = tenant2.id;
    });

    it("should isolate sites by tenant", async () => {
      await prisma.site.create({
        data: {
          tenantId: tenant1Id,
          name: "Tenant 1 Site",
        },
      });

      await prisma.site.create({
        data: {
          tenantId: tenant2Id,
          name: "Tenant 2 Site",
        },
      });

      const tenant1Sites = await prisma.site.findMany({
        where: { tenantId: tenant1Id },
      });

      const tenant2Sites = await prisma.site.findMany({
        where: { tenantId: tenant2Id },
      });

      expect(tenant1Sites).toHaveLength(1);
      expect(tenant2Sites).toHaveLength(1);
      expect(tenant1Sites[0].name).toBe("Tenant 1 Site");
      expect(tenant2Sites[0].name).toBe("Tenant 2 Site");
    });

    it("should isolate employees by tenant", async () => {
      await prisma.employee.create({
        data: {
          tenantId: tenant1Id,
          firstName: "Employee",
          lastName: "One",
        },
      });

      await prisma.employee.create({
        data: {
          tenantId: tenant2Id,
          firstName: "Employee",
          lastName: "Two",
        },
      });

      const tenant1Employees = await prisma.employee.findMany({
        where: { tenantId: tenant1Id },
      });

      const tenant2Employees = await prisma.employee.findMany({
        where: { tenantId: tenant2Id },
      });

      expect(tenant1Employees).toHaveLength(1);
      expect(tenant2Employees).toHaveLength(1);
    });
  });

  describe("Zod Validation Schemas", () => {
    it("should validate tenant creation", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        company: "Test Company",
      };

      const result = createTenantSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid tenant email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
        name: "Test User",
        company: "Test Company",
      };

      const result = createTenantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should validate employee creation", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "0692123456",
      };

      const result = createEmployeeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate clock-in creation", () => {
      const validData = {
        siteId: "clxxx1234567890",
        employeeId: "clxxx0987654321",
        action: "START",
      };

      const result = createClockInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid clock-in action", () => {
      const invalidData = {
        siteId: "clxxx1234567890",
        employeeId: "clxxx0987654321",
        action: "INVALID",
      };

      const result = createClockInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
