import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { routes } from '@/infrastructure/http/routes';
import { setupCommandBus } from '@/infrastructure/CQRS/command-bus/command-bus-setup';
import { setupQueryBus } from '@/infrastructure/CQRS/query-bus/query-bus-setup';
import { UserPostgresRepository } from '@/infrastructure/persistence/postgres/user-postgres-repository';
import { prisma } from '@/infrastructure/database/prisma-client';
import { DatabaseSetup } from '@/infrastructure/database/database-setup';
import SwaggerParser from '@apidevtools/swagger-parser';
import { ChurchPostgresRepository } from './infrastructure/persistence/postgres/church-postgres-repository';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;




// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation

// CQRS setup



// Initialize database and start server
async function startServer() {
  try {
    const swaggerDocument = await SwaggerParser.bundle('./src/swagger.yaml');
    console.log("✅ Swagger loaded:", swaggerDocument.info.title);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const userRepository = new UserPostgresRepository(prisma);
    const churchRepository = new ChurchPostgresRepository(prisma);

    const commandBus = setupCommandBus({ userRepository, churchRepository });
    const queryBus = setupQueryBus({ userRepository, churchRepository });

    // Routes
    app.use('/api', routes(commandBus, queryBus));

    // Health check endpoint
    app.get('/health', async (req, res) => {
      try {
        const dbHealth = await DatabaseSetup.getHealthStatus();
        const healthStatus = {
          status: dbHealth.status === 'healthy' ? 'OK' : 'ERROR',
          timestamp: new Date().toISOString(),
          database: dbHealth,
          uptime: process.uptime(),
        };

        const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(healthStatus);
      } catch (error) {
        res.status(503).json({
          status: 'ERROR',
          timestamp: new Date().toISOString(),
          database: {
            status: 'unhealthy',
            message: `Database health check failed: ${error}`,
            timestamp: new Date(),
          },
          uptime: process.uptime(),
        });
      }
    });


    



    // Error handling middleware
    app.use(notFoundHandler);
    app.use(errorHandler);
    // Initialize database connection
    await DatabaseSetup.initialize();

    // Test database connection
    const isConnected = await DatabaseSetup.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
      console.log(`🗄️  Database connected successfully`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await DatabaseSetup.shutdown();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      server.close(async () => {
        await DatabaseSetup.shutdown();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
