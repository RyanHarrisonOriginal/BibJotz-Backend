import { PrismaClientType } from "../types";
import { Prisma } from "@prisma/client";

export const isTransactionClient = (client: PrismaClientType): client is Prisma.TransactionClient => {
    return !('$transaction' in client);
}