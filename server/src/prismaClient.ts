import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * We instantiate a single PrismaClient instance to manage database connection pools efficiently.
 */
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Logs SQL queries and operations in terminal
});

export default prisma;
