import { IReflectionRepository } from "@/domain/Reflection/reflection-repository.interface";
import { PrismaClient } from "@prisma/client";
import { Reflection } from "@/domain/Reflection/reflection";
import { ReflectionMapper } from "@/domain/Reflection/reflection.mapper";
import { Prisma } from "@prisma/client";


export class ReflectionPostgresRepository implements IReflectionRepository {
    constructor(private readonly prisma: PrismaClient) {}


    private async createReflection(tx: Prisma.TransactionClient, reflectionData: any): Promise<any> {
        const savedReflection = await tx.reflection.create({
            data: reflectionData,
        });
        return savedReflection;
    }
    
    private async updateReflection(tx: Prisma.TransactionClient, reflectionData: any): Promise<any> {
        const savedReflection = await tx.reflection.update({
            where: { id: reflectionData.id },
            data: reflectionData,
        });
        return savedReflection;
    }

    private async createReflectionBiblicalReference(tx: Prisma.TransactionClient, reflectionBiblicalReferenceData: any): Promise<any> {
        const savedReflectionBiblicalReference = await tx.reflectionBiblicalReference.create({
            data: reflectionBiblicalReferenceData,
        });
        return savedReflectionBiblicalReference;
    }
    
    private async updateReflectionBiblicalReference(tx: Prisma.TransactionClient, reflectionBiblicalReferenceData: any): Promise<any> {
        const savedReflectionBiblicalReference = await tx.reflectionBiblicalReference.update({
            where: { id: reflectionBiblicalReferenceData.id },
            data: reflectionBiblicalReferenceData,
        });
        return savedReflectionBiblicalReference;
    }

    async save(reflection: Reflection): Promise<Reflection> {
        const reflectionData = ReflectionMapper.mapReflectionToPersistencePrisma(reflection);
        const savedReflection = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            let savedReflection: Reflection;
            savedReflection = await (reflectionData.id === 0 || !reflectionData.id
                ? this.createReflection(tx, reflectionData)
                : this.updateReflection(tx, reflectionData)
            );

            if (reflectionData.biblicalReferences.length > 0) {
                await Promise.all(
                    reflectionData.biblicalReferences.map((reference: any) =>
                        reference.id === 0 || !reference.id
                            ? this.createReflectionBiblicalReference(tx, reference)
                            : this.updateReflectionBiblicalReference(tx, reference)
                    )
                );
            }
        });
        return ReflectionMapper.mapReflectionToDomain(savedReflection);
    }

    private ReflectionQuery(where: any): any {
        return {
            where,
            include: {
                biblicalReferences: true,
            },
        };
    }

    async findReflection(id: number): Promise<Reflection> {
        const reflection = await this.prisma.reflection.findUnique(this.ReflectionQuery({ id }));
        return ReflectionMapper.mapReflectionToDomain(reflection);
    }

    async findReflections(journeyId?: number, guideSectionId?: number, authorId?: number): Promise<Reflection[]> {
        const reflections = await this.prisma.reflection.findMany(this.ReflectionQuery({ journeyId, guideSectionId, authorId }));
        return reflections.map(ReflectionMapper.mapReflectionToDomain);
    }
}