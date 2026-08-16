import dotenv from 'dotenv';

dotenv.config();

/**
 * Neon’s pooled host uses PgBouncer in transaction mode. Prisma needs
 * pgbouncer=true so it does not cache prepared statements across recycled
 * connections. A small connection_limit keeps two Prisma clients from
 * opening a large idle pool that Neon then closes.
 */
export function neonDatasourceUrl(rawUrl: string | undefined, envName: string): string {
  if (!rawUrl) {
    throw new Error(`${envName} is required`);
  }

  const url = new URL(rawUrl);
  url.searchParams.set('pgbouncer', 'true');
  if (!url.searchParams.has('connect_timeout')) {
    url.searchParams.set('connect_timeout', '15');
  }
  if (!url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', '5');
  }
  return url.toString();
}
