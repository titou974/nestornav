import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      tenantId: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    tenantId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId: string;
  }
}
