import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { Prisma, PrismaClient, } from "@prisma/client";
import { Journey } from "@/domain/Jouney/jouney";
import { Reflection } from "@/domain/Reflection/reflection";
import { JourneyMapper } from "@/domain/Jouney/journey.mapper";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { PrismaClientType } from "../types";
import { isTransactionClient } from "../utils/prismaHelpers";


export class JourneyPostgresRepository implements IJourneyRepository {
    constructor(private readonly client: PrismaClientType) { }

    private async createJourney(tx: Prisma.TransactionClient, journeyData: any): Promise<any> {
        return await tx.journey.create({
            data: {
                name: journeyData.name,
                ownerId: journeyData.ownerId,
                guideVersionId: journeyData.guideVersionId,
                description: journeyData.description ?? null,
                createdAt: journeyData.createdAt ?? new Date(),
            },
            include: {
                guideVersion: {
                    include: {
                        guide: true,
                        sections: {
                            include: {
                                biblicalReferences: true,
                            },
                        },
                        biblicalReferences: true,
                    },
                },
                personalSections: true,
            },
        });
    }

    private async updateJourney(tx: Prisma.TransactionClient, journeyData: any): Promise<any> {
        return await tx.journey.update({
            where: { id: journeyData.id },
            data: {
                name: journeyData.name,
                ownerId: journeyData.ownerId,
                guideVersionId: journeyData.guideVersionId,
                description: journeyData.description,
            },
            include: {
                guideVersion: {
                    include: {
                        guide: true,
                        sections: {
                            include: {
                                biblicalReferences: true
                            }
                        },
                        biblicalReferences: true
                    }
                },
                personalSections: true
            }
        });
    }


    async save(journey: Journey): Promise<any> {
        if (isTransactionClient(this.client)) {
            return await this.executeSave(this.client, journey);
        } else {
            const prismaClient = this.client as PrismaClient;
            return await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
                return await this.executeSave(tx, journey);
            });
        }
    }

    private async executeSave(tx: Prisma.TransactionClient, journey: Journey): Promise<any> {
        try {
            const journeyData = JourneyMapper.mapJourneyToPersistencePrisma(journey);

            const savedJourney = await (
                journeyData.id === 0 || !journeyData.id
                    ? this.createJourney(tx, journeyData)
                    : this.updateJourney(tx, journeyData)
            );

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
                guideVersion: {
                    include: {
                        guide: true,
                        sections: {
                            include: {
                                biblicalReferences: true
                            }
                        },
                        biblicalReferences: true
                    }
                },
                personalSections: true
            }
        }
    }

    async findJourney(journeyId?: number): Promise<any> {
        if (!journeyId) {
            throw new Error('Journey ID is required');
        }
        const journey = await this.client.journey.findUnique(this.JourneyQuery({ id: journeyId }));
        if (!journey) {
            throw new Error(`Journey with id ${journeyId} not found`);
        }
        return journey;
    }

    async findJourneys(journeyId?: number, ownerId?: number, guideId?: number): Promise<any[]> {
        const where: any = {};
        if (journeyId) {
            where.id = journeyId;
        }
        if (ownerId) {
            where.ownerId = ownerId;
        }
        if (guideId) {
            where.guideVersionId = guideId;
        }
        return await this.client.journey.findMany(this.JourneyQuery(where));
    }
}