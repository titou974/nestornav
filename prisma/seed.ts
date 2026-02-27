import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.clockIn.deleteMany();
  await prisma.qrToken.deleteMany();
  await prisma.anomaly.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.site.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Create test tenant
  console.log("👤 Creating test tenant...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const tenant = await prisma.tenant.create({
    data: {
      email: "patron@nestor.re",
      password: hashedPassword,
      name: "Jean Dupont",
      company: "Construction Réunion",
    },
  });

  console.log(`✅ Created tenant: ${tenant.email}`);

  // Create sites
  console.log("🏗️  Creating sites...");
  const site1 = await prisma.site.create({
    data: {
      tenantId: tenant.id,
      name: "Chantier Saint-Denis",
      address: "123 Rue de la République, 97400 Saint-Denis",
    },
  });

  const site2 = await prisma.site.create({
    data: {
      tenantId: tenant.id,
      name: "Chantier Saint-Pierre",
      address: "456 Avenue du Port, 97410 Saint-Pierre",
    },
  });

  console.log(`✅ Created ${2} sites`);

  // Create employees
  console.log("👷 Creating employees...");
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        tenantId: tenant.id,
        firstName: "Pierre",
        lastName: "Martin",
        email: "pierre.martin@example.com",
        phone: "0692123456",
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        tenantId: tenant.id,
        firstName: "Marie",
        lastName: "Leroy",
        email: "marie.leroy@example.com",
        phone: "0692234567",
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        tenantId: tenant.id,
        firstName: "Ahmed",
        lastName: "Ben Ali",
        phone: "0692345678",
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        tenantId: tenant.id,
        firstName: "Sophie",
        lastName: "Dubois",
        email: "sophie.dubois@example.com",
        phone: "0692456789",
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        tenantId: tenant.id,
        firstName: "Lucas",
        lastName: "Fontaine",
        phone: "0692567890",
        isActive: false,
      },
    }),
  ]);

  console.log(`✅ Created ${employees.length} employees`);

  // Create clock-ins for today
  console.log("⏰ Creating clock-ins...");
  const today = new Date();
  today.setHours(8, 0, 0, 0);

  const clockIns = await Promise.all([
    // Pierre - Full day at site 1
    prisma.clockIn.create({
      data: {
        tenantId: tenant.id,
        siteId: site1.id,
        employeeId: employees[0].id,
        action: "START",
        timestamp: new Date(today.getTime()),
      },
    }),
    prisma.clockIn.create({
      data: {
        tenantId: tenant.id,
        siteId: site1.id,
        employeeId: employees[0].id,
        action: "PAUSE",
        timestamp: new Date(today.getTime() + 4 * 60 * 60 * 1000), // 12:00
      },
    }),
    prisma.clockIn.create({
      data: {
        tenantId: tenant.id,
        siteId: site1.id,
        employeeId: employees[0].id,
        action: "START",
        timestamp: new Date(today.getTime() + 5 * 60 * 60 * 1000), // 13:00
      },
    }),
    prisma.clockIn.create({
      data: {
        tenantId: tenant.id,
        siteId: site1.id,
        employeeId: employees[0].id,
        action: "END",
        timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 17:00
      },
    }),

    // Marie - Morning at site 2
    prisma.clockIn.create({
      data: {
        tenantId: tenant.id,
        siteId: site2.id,
        employeeId: employees[1].id,
        action: "START",
        timestamp: new Date(today.getTime() + 0.5 * 60 * 60 * 1000), // 08:30
      },
    }),

    // Ahmed - Full day at site 1
    prisma.clockIn.create({
      data: {
        tenantId: tenant.id,
        siteId: site1.id,
        employeeId: employees[2].id,
        action: "START",
        timestamp: new Date(today.getTime() + 0.25 * 60 * 60 * 1000), // 08:15
      },
    }),
  ]);

  console.log(`✅ Created ${clockIns.length} clock-ins`);

  // Create QR tokens
  console.log("🔐 Creating QR tokens...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const qrTokens = await Promise.all([
    prisma.qrToken.create({
      data: {
        tenantId: tenant.id,
        siteId: site1.id,
        token: "QR-SITE1-ACTIVE-001",
        used: false,
        expiresAt: tomorrow,
      },
    }),
    prisma.qrToken.create({
      data: {
        tenantId: tenant.id,
        siteId: site2.id,
        token: "QR-SITE2-ACTIVE-001",
        used: false,
        expiresAt: tomorrow,
      },
    }),
    prisma.qrToken.create({
      data: {
        tenantId: tenant.id,
        siteId: site1.id,
        token: "QR-SITE1-USED-001",
        used: true,
        usedAt: new Date(),
        expiresAt: tomorrow,
      },
    }),
  ]);

  console.log(`✅ Created ${qrTokens.length} QR tokens`);

  // Create anomaly
  console.log("⚠️  Creating anomaly...");
  const anomaly = await prisma.anomaly.create({
    data: {
      tenantId: tenant.id,
      type: "MISSING_END",
      description: "Marie n'a pas pointé la fin de sa journée",
      status: "PENDING",
      relatedClockInId: clockIns[4].id,
    },
  });

  console.log(`✅ Created anomaly: ${anomaly.type}`);

  // Create NextAuth user
  console.log("🔑 Creating NextAuth user...");
  const user = await prisma.user.create({
    data: {
      email: tenant.email,
      name: tenant.name,
      tenantId: tenant.id,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  console.log("\n✨ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - 1 tenant: ${tenant.email}`);
  console.log(`   - 2 sites`);
  console.log(
    `   - ${employees.length} employees (${employees.filter((e: { isActive: boolean }) => e.isActive).length} active)`,
  );
  console.log(`   - ${clockIns.length} clock-ins`);
  console.log(`   - ${qrTokens.length} QR tokens`);
  console.log(`   - 1 anomaly`);
  console.log(`   - 1 user`);
  console.log("\n🔐 Login credentials:");
  console.log(`   Email: ${tenant.email}`);
  console.log(`   Password: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
