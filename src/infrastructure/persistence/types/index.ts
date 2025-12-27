import { PrismaClient, Prisma } from "@prisma/client";

export type PrismaClientType = PrismaClient | Prisma.TransactionClient;
