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

    async save(draft: Draft): Promise<Draft> {
        const draftData = DraftMapper.mapDraftToPersistenceModel(draft);
        if (isTransactionClient(this.prisma)) {
            const savedDraft = await this.executeSave(this.prisma, draftData);
            return DraftMapper.mapDraftModelToDomain(savedDraft);
        } else {
            const prismaClient = this.prisma as PrismaClient;
            const savedDraft = await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
                return await this.executeSave(tx, draftData);
            });
            return DraftMapper.mapDraftModelToDomain(savedDraft);
        }
    }

    private async executeSave(tx: Prisma.TransactionClient, draftData: any): Promise<any> {
        return await this.upsertDraft(tx, draftData);
    }

    async findDraftByDraftKey(draftKey: string): Promise<Draft> {
        const draft = await this.prisma.guideDraft.findUnique({
            where: { draftKey: draftKey },
        });

        if (!draft) {
            throw new Error(`Draft with draftKey ${draftKey} not found`);
        }

        return DraftMapper.mapDraftModelToDomain(draft);
    }

    async findAllDraftsByDraftKey(draftKey: string): Promise<Draft[]> {
        const drafts = await this.prisma.guideDraft.findMany({
            where: { draftKey: draftKey },
            orderBy: { name: 'asc' },
        });

        return drafts.map(draft => DraftMapper.mapDraftModelToDomain(draft));
    }

    async delete(draftKey: string): Promise<void> {
        await this.prisma.guideDraft.delete({
            where: { draftKey: draftKey },
        });
    }
    
    async findAllDraftsByUserId(userId: number): Promise<Partial<Draft>[]> {
        const drafts = await this.prisma.guideDraft.findMany({
            select: {
                draftKey: true,
                name: true,
                updatedAt: true,
                userId: true,
                id: true,
            },
            where: { userId: userId, publishedAt: null },
            orderBy: { updatedAt: 'desc' },
        });
        return DraftMapper.mapDraftsModelToDomain(drafts);
    }
}

