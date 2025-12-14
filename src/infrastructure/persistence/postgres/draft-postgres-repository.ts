import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { Draft } from "@/domain/Drafts/draft";
import { PrismaClient, Prisma } from "@prisma/client";
import { DraftMapper } from "@/domain/Drafts/draft.mapper";

export class DraftPostgresRepository implements IDraftRepository {
    constructor(private readonly prisma: PrismaClient) { }

    private async createDraft(tx: Prisma.TransactionClient, draftData: any): Promise<any> {
        const savedDraft = await tx.guideDraft.create({
            data: {
                name: draftData.name,
                userId: draftData.userId,
                draftContent: draftData.draftContent,
                draftKey: draftData.draftKey,
            },
        });
        return savedDraft;
    }

    private async updateDraft(tx: Prisma.TransactionClient, draftData: any): Promise<any> {
        const savedDraft = await tx.guideDraft.update({
            where: { draftKey: draftData.draftKey },
            data: {
                userId: draftData.userId,
                draftContent: draftData.draftContent,
            },
        });
        return savedDraft;
    }

    private async upsertDraft(tx: Prisma.TransactionClient, draftData: any): Promise<any> {
        return await tx.guideDraft.upsert({
            where: {
                draftKey: draftData.draftKey,
            },
            update: {
                draftContent: draftData.draftContent,
                name: draftData.name || "",
            },
            create: {
                draftKey: draftData.draftKey,
                name: draftData.name || "",
                userId: draftData.userId,
                draftContent: draftData.draftContent,
            },
        });
    }

    async save(draft: Draft): Promise<Draft> {
        const draftData = DraftMapper.mapDraftToPersistenceModel(draft);

        const savedDraft = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            return this.upsertDraft(tx, draftData);
        });

        return DraftMapper.mapDraftModelToDomain(savedDraft);
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
            where: { userId: userId },
            orderBy: { updatedAt: 'desc' },
        });
        return DraftMapper.mapDraftsModelToDomain(drafts);
    }
}

