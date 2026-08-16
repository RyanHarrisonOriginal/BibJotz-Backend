import { PrismaClient } from '@/generated/bible-client';
import { neonDatasourceUrl } from './neon-datasource-url';

declare global {
  // eslint-disable-next-line no-var
  var __biblePrisma: PrismaClient | undefined;
}

export const biblePrisma =
  globalThis.__biblePrisma ||
  new PrismaClient({
    datasourceUrl: neonDatasourceUrl(process.env.BIBLE_DATABASE_URL, 'BIBLE_DATABASE_URL'),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__biblePrisma = biblePrisma;
}

export async function disconnectBiblePrisma(): Promise<void> {
  await biblePrisma.$disconnect();
}

export async function connectBiblePrisma(): Promise<void> {
  await biblePrisma.$connect();
}
