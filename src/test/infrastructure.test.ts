import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Infrastructure Setup Tests", () => {
  describe("AC1: Next.js 16 Project Initialized", () => {
    it("should have Next.js 16 installed", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.dependencies.next).toBeDefined();
      expect(packageJson.dependencies.next).toContain("16");
    });

    it("should have TypeScript configured", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.devDependencies.typescript).toBeDefined();
    });

    it("should have Tailwind CSS installed", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.devDependencies.tailwindcss).toBeDefined();
    });
  });

  describe("AC2: All Dependencies Installed", () => {
    it("should have HeroUI React installed", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.dependencies["@heroui/react"]).toBeDefined();
    });

    it("should have TanStack Query installed", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.dependencies["@tanstack/react-query"]).toBeDefined();
    });

    it("should have Prisma installed", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.dependencies.prisma).toBeDefined();
      expect(packageJson.dependencies["@prisma/client"]).toBeDefined();
    });

    it("should have NextAuth installed", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.dependencies["next-auth"]).toBeDefined();
    });

    it("should have utility libraries installed", () => {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.dependencies.zod).toBeDefined();
      expect(packageJson.dependencies["date-fns"]).toBeDefined();
      expect(packageJson.dependencies.qrcode).toBeDefined();
      expect(packageJson.dependencies.exceljs).toBeDefined();
    });
  });

  describe("AC3: Configuration Files Created", () => {
    it("should have next.config.ts file", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it("should have tailwind.config.ts file", () => {
      const configPath = path.join(process.cwd(), "tailwind.config.ts");
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it("should have tsconfig.json configured", () => {
      const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf-8"));
      expect(tsConfig.compilerOptions).toBeDefined();
      expect(tsConfig.compilerOptions.strict).toBe(true);
      expect(tsConfig.compilerOptions.paths).toBeDefined();
      expect(tsConfig.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
    });
  });

  describe("AC4: Prisma Initialized", () => {
    it("should have prisma directory", () => {
      const prismaPath = path.join(process.cwd(), "prisma");
      expect(fs.existsSync(prismaPath)).toBe(true);
    });

    it("should have schema.prisma file", () => {
      const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
      expect(fs.existsSync(schemaPath)).toBe(true);
    });
  });

  describe("AC5: Root Layout and Providers Setup", () => {
    it("should have layout.tsx file", () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
      expect(fs.existsSync(layoutPath)).toBe(true);
    });

    it("should have providers.tsx file", () => {
      const providersPath = path.join(
        process.cwd(),
        "src",
        "app",
        "providers.tsx",
      );
      expect(fs.existsSync(providersPath)).toBe(true);
    });
  });

  describe("AC6: Theme and i18n Configuration", () => {
    it("should have theme configuration file", () => {
      const themePath = path.join(process.cwd(), "src", "config", "theme.ts");
      expect(fs.existsSync(themePath)).toBe(true);
    });

    it("should have i18n configuration file", () => {
      const i18nPath = path.join(process.cwd(), "src", "config", "i18n.ts");
      expect(fs.existsSync(i18nPath)).toBe(true);
    });
  });
});
