import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      companyId: string;
      role: "OWNER" | "EMPLOYEE";
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    companyId: string;
    role: "OWNER" | "EMPLOYEE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    companyId: string;
    role: "OWNER" | "EMPLOYEE";
  }
}
