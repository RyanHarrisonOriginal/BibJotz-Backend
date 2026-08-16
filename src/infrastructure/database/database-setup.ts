import { biblePrisma, connectBiblePrisma, disconnectBiblePrisma } from './bible-prisma-client';
import { appPrisma, connectAppPrisma, disconnectAppPrisma } from './app-prisma-client';

export class DatabaseSetup {
  static async initialize(): Promise<void> {
    await connectBiblePrisma();
    await connectAppPrisma();
    console.log('Database clients connected');
  }

  static async shutdown(): Promise<void> {
    await disconnectBiblePrisma();
    await disconnectAppPrisma();
    console.log('Database clients disconnected');
  }

  static async testConnection(): Promise<boolean> {
    try {
      await biblePrisma.$queryRaw`SELECT 1`;
      await appPrisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  static async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    timestamp: Date;
  }> {
    try {
      await biblePrisma.$queryRaw`SELECT 1`;
      await appPrisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        message: 'Bible and app databases are reachable',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error}`,
        timestamp: new Date(),
      };
    }
  }
}
