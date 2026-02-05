import { getServerSession, type AuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          companyId: user.companyId,
          role: user.role as "OWNER" | "EMPLOYEE",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.companyId = user.companyId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email ?? null;
      session.user.name = token.name ?? null;
      session.user.companyId = token.companyId;
      session.user.role = token.role;
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);

export async function requireCompanyId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.companyId) {
    redirect("/login");
  }

  return session.user.companyId;
}
