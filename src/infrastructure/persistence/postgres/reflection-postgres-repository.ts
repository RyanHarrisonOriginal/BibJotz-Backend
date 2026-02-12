import { IReflectionRepository } from "@/domain/Reflection/reflection-repository.interface";
import { PrismaClient } from "@prisma/client";
import { Reflection } from "@/domain/Reflection/reflection";
import { ReflectionMapper } from "@/domain/Reflection/reflection.mapper";
import { Prisma } from "@prisma/client";


export class ReflectionPostgresRepository implements IReflectionRepository {
    constructor(private readonly prisma: PrismaClient) {}


    private async createReflection(tx: Prisma.TransactionClient, reflectionData: any): Promise<any> {
        const savedReflection = await tx.reflection.create({
            data: {
                content: reflectionData.content,
                authorId: reflectionData.authorId,
                guideSectionId: reflectionData.guideSectionId,
                journeyId: reflectionData.journeyId
            },
        });
        return savedReflection;
    }
    
    private async updateReflection(tx: Prisma.TransactionClient, reflectionData: any): Promise<any> {
        const savedReflection = await tx.reflection.update({
            where: { id: reflectionData.id },
            data: {
                content: reflectionData.content,
                authorId: reflectionData.authorId,
                guideSectionId: reflectionData.guideSectionId,
                journeyId: reflectionData.journeyId
            },
        });
        return savedReflection;
    }

    private async createReflectionBiblicalReference(tx: Prisma.TransactionClient, reflectionBiblicalReferenceData: any, reflectionId: number | null): Promise<any> {
        const savedReflectionBiblicalReference = await tx.reflectionBiblicalReference.create({
            data: {
                reflectionId: reflectionId ?? 0,
                book: reflectionBiblicalReferenceData.book,
                chapter: reflectionBiblicalReferenceData.chapter,
                startVerse: reflectionBiblicalReferenceData.startVerse,
                endVerse: reflectionBiblicalReferenceData.endVerse,
            },
        });
        return savedReflectionBiblicalReference;
    }
    
    private async updateReflectionBiblicalReference(tx: Prisma.TransactionClient, reflectionBiblicalReferenceData: any): Promise<any> {
        const savedReflectionBiblicalReference = await tx.reflectionBiblicalReference.update({
            where: { id: reflectionBiblicalReferenceData.id },
            data: {
                book: reflectionBiblicalReferenceData.book,
                chapter: reflectionBiblicalReferenceData.chapter,
                startVerse: reflectionBiblicalReferenceData.startVerse,
                endVerse: reflectionBiblicalReferenceData.endVerse,
            },
        });
        return savedReflectionBiblicalReference;
    }

    async save(reflection: Reflection): Promise<any> {
        const reflectionData = ReflectionMapper.mapReflectionToPersistencePrisma(reflection);
        return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            let savedReflection: any;

            savedReflection = await (reflectionData.id === 0 || !reflectionData.id
                ? this.createReflection(tx, reflectionData)
                : this.updateReflection(tx, reflectionData)
            );

            if (reflectionData.biblicalReferences.length > 0) {
                await Promise.all(
                    reflectionData.biblicalReferences.map((reference: any) =>
                        reference.id === 0 || !reference.id
                            ? this.createReflectionBiblicalReference(tx, reference, savedReflection.id)
                            : this.updateReflectionBiblicalReference(tx, reference)
                    )
                );
            }
            
            return savedReflection;
        });
    }

    private ReflectionQuery(where: any): any {
        return {
            where,
            include: {
                biblicalReferences: true,
            },
        };
    }

    async findReflection(id: number): Promise<any> {
        return await this.prisma.reflection.findUnique(this.ReflectionQuery({ id }));
    }

    async findReflections(journeyId?: number, guideSectionId?: number, authorId?: number): Promise<any[]> {
        return await this.prisma.reflection.findMany(this.ReflectionQuery({ journeyId, guideSectionId, authorId }));
    }

    async upsertReflection(journeyId: number, guideSectionId: number, authorId: number, content: string): Promise<any> {
        return await this.prisma.reflection.upsert({
            where: {
                journeyId_guideSectionId_authorId: {
                    journeyId,
                    guideSectionId,
                    authorId,
                },
            },
            create: {
                journeyId,
                guideSectionId,
                authorId,
                content,
            },
            update: { content },
            include: { biblicalReferences: true },
        });
    }
}