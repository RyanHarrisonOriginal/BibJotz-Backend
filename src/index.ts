import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import SwaggerParser from '@apidevtools/swagger-parser';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { routes } from '@/infrastructure/http/routes';
import { setupCommandBus } from '@/infrastructure/CQRS/command-bus/command-bus-setup';
import { setupQueryBus } from '@/infrastructure/CQRS/query-bus/query-bus-setup';
import { biblePrisma } from '@/infrastructure/database/bible-prisma-client';
import { appPrisma } from '@/infrastructure/database/app-prisma-client';
import { DatabaseSetup } from '@/infrastructure/database/database-setup';
import { BiblePostgresRepository } from '@/infrastructure/persistence/postgres/bible-postgres-repository';
import { NotePostgresRepository } from '@/infrastructure/persistence/postgres/note-postgres-repository';
import { UserPostgresRepository } from '@/infrastructure/persistence/postgres/user-postgres-repository';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer(): Promise<void> {
  try {
    const swaggerDocument = await SwaggerParser.bundle('./src/swagger.yaml');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const bibleRepository = new BiblePostgresRepository(biblePrisma);
    const noteRepository = new NotePostgresRepository(appPrisma);
    const userRepository = new UserPostgresRepository(appPrisma);

    const commandBus = setupCommandBus({ noteRepository, userRepository });
    const queryBus = setupQueryBus({ bibleRepository, noteRepository, userRepository });

    app.use('/api', routes(commandBus, queryBus));

    app.get('/health', async (_req, res) => {
      const dbHealth = await DatabaseSetup.getHealthStatus();
      const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json({
        status: dbHealth.status === 'healthy' ? 'OK' : 'ERROR',
        timestamp: new Date().toISOString(),
        database: dbHealth,
        uptime: process.uptime(),
      });
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    await DatabaseSetup.initialize();
    const isConnected = await DatabaseSetup.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API docs: http://localhost:${PORT}/api-docs`);
      console.log(`Health:   http://localhost:${PORT}/health`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await DatabaseSetup.shutdown();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
