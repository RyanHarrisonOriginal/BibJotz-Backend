import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { PrismaClient } from "@prisma/client";
import { Journey } from "@/domain/Jouney/jouney";
import { JourneyMapper } from "@/domain/Jouney/journey.mapper";



export class JourneyPostgresRepository implements IJourneyRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(journey: Journey): Promise<Journey> {
        const journeyData = JourneyMapper.mapJourneyToPersistencePrisma(journey);
        const savedJourney = await this.prisma.journey.create({
            data: journeyData,
        });
        return JourneyMapper.mapJourneyModelToDomain(savedJourney);
    }

    async findJourneyById(id: number): Promise<Journey> {
        const journey = await this.prisma.journey.findUnique({
            where: { id },
            include: {
                reflections: true,
                guide: true,
            },
        });
        return JourneyMapper.mapJourneyModelToDomain(journey);
    }

    async findJourneysByOwnerId(ownerId: number): Promise<Journey[]> {
        const journies = await this.prisma.journey.findMany({
            where: { ownerId },
            include: {
                reflections: true,
                guide: true,
            },
        });
        return journies.map(JourneyMapper.mapJourneyModelToDomain);
    }

    async findJourneysByGuideId(guideId: number): Promise<Journey[]> {
        const journeys = await this.prisma.journey.findMany({
            where: { guideId },
            include: {
                reflections: true,
                guide: true,
            },
        });
        return journeys.map(JourneyMapper.mapJourneyModelToDomain);
    }
}