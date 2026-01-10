import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { connect } from "http2";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
