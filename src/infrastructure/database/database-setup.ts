import { prisma, connectPrisma, disconnectPrisma } from './prisma-client';

export class DatabaseSetup {
  static async initialize(): Promise<void> {
    try {
      await connectPrisma();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  static async shutdown(): Promise<void> {
    try {
      await disconnectPrisma();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from database:', error);
      throw error;
    }
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
  }

  static async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    timestamp: Date;
  }> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        message: 'Database connection is working',
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

