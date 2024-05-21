import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}
// export const db = new PrismaClient(); // Causes issues in developement everytime we save a file a new prisma client instance is created which overloads thr project and crashes in development.
// globalThis is not affected by hot reloading so assigning db to globalThis will avoid crashing the project in development

export const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;