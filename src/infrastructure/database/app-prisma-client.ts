import { PrismaClient } from '@/generated/app-client';
import { neonDatasourceUrl } from './neon-datasource-url';

declare global {
  // eslint-disable-next-line no-var
  var __appPrisma: PrismaClient | undefined;
}

export const appPrisma =
  globalThis.__appPrisma ||
  new PrismaClient({
    datasourceUrl: neonDatasourceUrl(process.env.DATABASE_URL, 'DATABASE_URL'),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__appPrisma = appPrisma;
}

export async function disconnectAppPrisma(): Promise<void> {
  await appPrisma.$disconnect();
}

export async function connectAppPrisma(): Promise<void> {
  await appPrisma.$connect();
}
