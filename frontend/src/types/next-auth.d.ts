import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      departmentId: number;
      permissions: Array<{
        module: string;
        action: string;
        scope: string;
      }>;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    departmentId: number;
    permissions: Array<{
      module: string;
      action: string;
      scope: string;
    }>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    departmentId: number;
    permissions: Array<{
      module: string;
      action: string;
      scope: string;
    }>;
  }
}
