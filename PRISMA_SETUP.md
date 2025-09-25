# Prisma Setup Guide for Bible Jot Backend

This guide will help you set up Prisma with PostgreSQL for the Bible Jot backend application.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 1. Database Setup

### Install PostgreSQL

**Windows:**
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Or use Chocolatey: `choco install postgresql`

**macOS:**
- Use Homebrew: `brew install postgresql`
- Start service: `brew services start postgresql`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

1. Connect to PostgreSQL:
```bash
psql -U postgres
```

2. Create database and user:
```sql
CREATE DATABASE bible_jot;
CREATE USER bible_jot_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bible_jot TO bible_jot_user;
\q
```

## 2. Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://bible_jot_user:your_password@localhost:5432/bible_jot?schema=public"
```

## 3. Prisma Setup

### Generate Prisma Client
```bash
npm run db:generate
```

### Push Schema to Database
```bash
npm run db:push
```

### Run Migrations (Alternative to push)
```bash
npm run db:migrate
```

### Seed the Database
```bash
npm run db:seed
```

## 4. Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:migrate:deploy` - Deploy migrations to production
- `npm run db:migrate:reset` - Reset database and run all migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 5. Database Schema

The schema includes the following models:

### User
- Basic user information (email, username, names)
- Privacy settings
- Church association
- Timestamps

### Church
- Church information (name, address, contact details)
- Related users

### Journey
- Bible reading journeys
- Content and metadata
- Active status

### Guide
- Study guides
- Content and difficulty level
- Active status

### Subscriptions
- User subscriptions to journeys and guides
- Subscription timestamps

### BibleNote
- User's personal Bible notes
- Verse references and tags
- Privacy settings

## 6. Usage in Application

### Import Prisma Client
```typescript
import { prisma } from '@/infrastructure/database/prisma-client';
```

### Initialize Database Connection
```typescript
import { DatabaseSetup } from '@/infrastructure/database/database-setup';

// In your main application file
await DatabaseSetup.initialize();
```

### Use in Repository
```typescript
import { UserPostgresRepository } from '@/infrastructure/persistence/user-postgres-repository';
import { prisma } from '@/infrastructure/database/prisma-client';

const userRepository = new UserPostgresRepository(prisma);
```

## 7. Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Generate client**: `npm run db:generate`
3. **Push changes**: `npm run db:push` (development) or `npm run db:migrate` (production)
4. **Update your code** to use new schema features
5. **Test your changes**

## 8. Production Deployment

1. Set up production database
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npm run db:migrate:deploy`
4. Generate client: `npm run db:generate`

## 9. Troubleshooting

### Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists
- Check firewall settings

### Schema Issues
- Run `npm run db:generate` after schema changes
- Use `npm run db:push` for development
- Use `npm run db:migrate` for production

### Migration Issues
- Check migration files in `prisma/migrations/`
- Use `npm run db:migrate:reset` to start fresh (development only)

## 10. Prisma Studio

Access the database GUI:
```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View and edit data
- Run queries
- Manage relationships
- Export data

## Next Steps

1. Set up your database
2. Configure environment variables
3. Run the setup commands
4. Start developing with Prisma!

For more information, visit the [Prisma documentation](https://www.prisma.io/docs/).

