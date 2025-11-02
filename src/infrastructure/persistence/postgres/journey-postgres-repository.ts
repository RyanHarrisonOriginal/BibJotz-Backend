import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { Prisma, PrismaClient, } from "@prisma/client";
import { Journey } from "@/domain/Jouney/jouney";
import { Reflection } from "@/domain/Reflection/reflection";
import { JourneyMapper } from "@/domain/Jouney/journey.mapper";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";


export class JourneyPostgresRepository implements IJourneyRepository {
    constructor(private readonly prisma: PrismaClient) { }

    private async createJourney(tx: Prisma.TransactionClient, journeyData: any): Promise<Journey> {
        const savedJourney = await tx.journey.create({
            data: {
                title: journeyData.title,
                ownerId: journeyData.ownerId,
                guideId: journeyData.guideId,
                createdAt: journeyData.createdAt,
                updatedAt: journeyData.updatedAt,
            },
        });
        return JourneyMapper.mapJourneyModelToDomain(savedJourney);
    }

    private async updateJourney(tx: Prisma.TransactionClient, journeyData: any): Promise<any> {
        const savedJourney = await tx.journey.update({
            where: { id: journeyData.id },
            data: {
                title: journeyData.title,
                ownerId: journeyData.ownerId,
                guideId: journeyData.guideId,
                updatedAt: journeyData.updatedAt,

            },
        });
        console.log('savedJourney---->frickingsaved', savedJourney);
        return savedJourney;
    }

    private async createReflection(tx: Prisma.TransactionClient, reflectionData: any, journeyId: number): Promise<any> {
        const savedReflection = await tx.reflection.create({
            data: {
                content: reflectionData.content,
                authorId: reflectionData.authorId,
                guideSectionId: reflectionData.guideSectionId,
                journeyId: journeyId,
                createdAt: reflectionData.createdAt,
                updatedAt: reflectionData.updatedAt,
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
                journeyId: reflectionData.journeyId,
                createdAt: reflectionData.createdAt,
                updatedAt: reflectionData.updatedAt,
            },
        });
        return savedReflection;
    }

    async save(journey: Journey): Promise<Journey> {
        try {
            const journeyData = JourneyMapper.mapJourneyToPersistencePrisma(journey);

            console.log('journeyData', journeyData);

            const savedJourney = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                let savedJourney: Journey;

                savedJourney = await (
                    journeyData.id === 0 || !journeyData.id
                        ? this.createJourney(tx, journeyData)
                        : this.updateJourney(tx, journeyData)
                );


                if (journeyData.reflections.length > 0) {
                    journeyData.reflections = await Promise.all(
                        journeyData.reflections.map((reflection: any) =>
                            reflection.id === 0 || !reflection.id
                                ? this.createReflection(tx, reflection, journeyData.id)
                                : this.updateReflection(tx, reflection)
                        )
                    );
                }

                return savedJourney;
            });
            return savedJourney;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to save journey');
        }
    }



    private JourneyQuery(where: any): any {
        return {
            where,
            include: {
                reflections: true,
                guide: { include: { guideSections: { include: { biblicalReferences: true } } } }
            }
        }
    }

    async findJourney(journeyId?: number): Promise<any> {
        const journey = await this.prisma.journey.findUnique(this.JourneyQuery({ id: journeyId }));
        return journey;
    }

    async findJourneys(journeyId?: number, ownerId?: number, guideId?: number): Promise<any[]> {
        const where = {
            id: journeyId ?? undefined,
            ownerId: ownerId ?? undefined,
            guideId: guideId ?? undefined,
        }
        const journey = await this.prisma.journey.findMany(this.JourneyQuery(where));
        return journey;
    }
}