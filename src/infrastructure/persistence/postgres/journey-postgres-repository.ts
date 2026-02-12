import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { Prisma, PrismaClient, } from "@prisma/client";
import { Journey } from "@/domain/Jouney/jouney";
import { JourneyMapper } from "@/domain/Jouney/journey.mapper";
import { PrismaClientType } from "../types";
import { isTransactionClient } from "../utils/prismaHelpers";
import { readFileSync } from "fs";
import { join } from "path";

const SQL_DIR = join(process.cwd(), "src", "infrastructure", "persistence", "postgres", "sql");
const GET_JOURNEY_LIBRARY_SQL = readFileSync(join(SQL_DIR, "get-journey-library.sql"), "utf-8");


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

    async getJourneyLibrary(ownerId: number | null): Promise<any[]> {
        const runRead = async (tx: Prisma.TransactionClient) => {
            const rows = await tx.$queryRawUnsafe<any[]>(GET_JOURNEY_LIBRARY_SQL, ownerId);
            return rows ?? [];
        };
        if (isTransactionClient(this.client)) {
            return runRead(this.client);
        }
        const prismaClient = this.client as PrismaClient;
        return prismaClient.$transaction(runRead);
    }
}