import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { Draft } from "@/domain/Drafts/draft";
import { PrismaClient, Prisma } from "@prisma/client";
import { DraftMapper } from "@/domain/Drafts/draft.mapper";
import { PrismaClientType } from "../types";
import { isTransactionClient } from "../utils/prismaHelpers";

export class DraftPostgresRepository implements IDraftRepository {
    constructor(private readonly prisma: PrismaClientType) { }

    private async upsertDraft(tx: Prisma.TransactionClient, draftData: any): Promise<any> {
        return await tx.guideDraft.upsert({
            where: {
                draftKey: draftData.draftKey,
            },
            update: {
                draftContent: draftData.draftContent,
                publishedAt: draftData.publishedAt || null,
                name: draftData.name || "",
            },
            create: {
                draftKey: draftData.draftKey,
                name: draftData.name || "",
                userId: draftData.userId,
                draftContent: draftData.draftContent,
                publishedAt: draftData.publishedAt || null,
            },
        });
    }

    async save(draft: Draft): Promise<any> {
        const draftData = DraftMapper.mapDraftToPersistenceModel(draft);
        if (isTransactionClient(this.prisma)) {
            return await this.executeSave(this.prisma, draftData);
        } else {
            const prismaClient = this.prisma as PrismaClient;
            return await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
                return await this.executeSave(tx, draftData);
            });
        }
    }

    private async executeSave(tx: Prisma.TransactionClient, draftData: any): Promise<any> {
        return await this.upsertDraft(tx, draftData);
    }

    async findDraftByDraftKey(draftKey: string): Promise<any> {
        const draft = await this.prisma.guideDraft.findUnique({
            where: { draftKey: draftKey },
        });

        if (!draft) {
            throw new Error(`Draft with draftKey ${draftKey} not found`);
        }

        return draft;
    }

    async findAllDraftsByDraftKey(draftKey: string): Promise<any[]> {
        return await this.prisma.guideDraft.findMany({
            where: { draftKey: draftKey },
            orderBy: { name: 'asc' },
        });
    }

    async delete(draftKey: string): Promise<void> {
        await this.prisma.guideDraft.delete({
            where: { draftKey: draftKey },
        });
    }
    
    async findAllDraftsByUserId(userId: number): Promise<any[]> {
        return await this.prisma.guideDraft.findMany({
            where: { userId: userId, publishedAt: null },
            orderBy: { updatedAt: 'desc' },
        });
    }
}

