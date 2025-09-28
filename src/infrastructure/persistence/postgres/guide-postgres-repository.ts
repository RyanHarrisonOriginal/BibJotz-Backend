import { Guide } from "@/domain/Guide/guide";
import { GuideSection } from "@/domain/Guide/guide-section";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { PrismaClient, Prisma } from "@prisma/client";
import { GuideMapper } from "@/domain/Guide/guide.mapper";
import { BiblicalReference } from "@/domain/shared/value-objects/BiblicalReference";



export class GuidePostgresRepository implements IGuideRepository {
    constructor(private readonly prisma: PrismaClient) { }

    private async createGuide(tx: Prisma.TransactionClient, guideData: any): Promise<Guide> {
        const savedGuide = await tx.guide.create({
            data: {
                name: guideData.name,
                description: guideData.description,
                isPublic: guideData.isPublic,
                authorId: guideData.authorId,
            },
        });
        return GuideMapper.mapGuideModelToDomain(savedGuide);
    }

    private async updateGuide(tx: Prisma.TransactionClient, guideData: any): Promise<Guide> {
        const savedGuide = await tx.guide.update({
            where: { id: guideData.guide.id },
            data: guideData.guide,
        });
        return GuideMapper.mapGuideModelToDomain(savedGuide);
    }

    private async createGuideSection(tx: Prisma.TransactionClient, guideSectionData: any, guideId: number | null): Promise<GuideSection> {
        const savedGuideSection = await tx.guideSection.create({
            data: {
                guideId: guideId ?? 0,
                ordinalPosition: guideSectionData.ordinalPosition,
                title: guideSectionData.title,
                description: guideSectionData.description,
            },
        });
        return GuideMapper.mapGuideSectionModelToDomain(savedGuideSection);
    }

    private async updateGuideSection(tx: Prisma.TransactionClient, guideSectionData: any): Promise<GuideSection> {
        const savedGuideSection = await tx.guideSection.update({
            where: { id: guideSectionData.id },
            data: guideSectionData,
        });
        return GuideMapper.mapGuideSectionModelToDomain(savedGuideSection);
    }

    private async createGuidBibleReference(tx: Prisma.TransactionClient, guidBibleReferenceData: any, guideId: number | null): Promise<BiblicalReference> {
        const savedGuidBibleReference = await tx.guidBibleReference.create({
            data: {
                guideId: guideId ?? 0,
                book: guidBibleReferenceData.book,
                chapter: guidBibleReferenceData.chapter,
                startVerse: guidBibleReferenceData.startVerse,
                endVerse: guidBibleReferenceData.endVerse,
            },
        });
        return GuideMapper.mapBiblicalReferenceModelToDomain(savedGuidBibleReference);
    }

    private async updateGuidBibleReference(tx: Prisma.TransactionClient, guidBibleReferenceData: any): Promise<BiblicalReference> {
        const savedGuidBibleReference = await tx.guidBibleReference.update({
            where: { id: guidBibleReferenceData.id },
            data: guidBibleReferenceData,
        });
        return GuideMapper.mapBiblicalReferenceModelToDomain(savedGuidBibleReference);
    }

    async save(guide: Guide): Promise<any> {
        const guideData = GuideMapper.mapToPersistencePrisma(guide);


        const result: Guide = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {

            let savedGuide: Guide;
            let savedGuideSections: GuideSection[] = [];
            let savedGuidBibleReferences: BiblicalReference[] = [];

            if (guideData.guide.id === 0 || !guideData.guide.id) {
                 savedGuide = await this.createGuide(tx, guideData.guide);
            } else {
                 savedGuide = await this.updateGuide(tx, guideData.guide);
            }

            guideData.guide = savedGuide;


            if (guideData.guideSections.length > 0) {
                for (const section of guideData.guideSections) {
                    if (section.id === 0 || !section.id) {
                        savedGuideSections.push(await this.createGuideSection(tx, section, guideData.guide.id));
                    } else {
                        savedGuideSections.push(await this.updateGuideSection(tx, section));
                    }
                }
                guideData.guideSections = savedGuideSections;
            }

            if (guideData.biblicalReferences.length > 0) {
                for (const reference of guideData.biblicalReferences) {
                    if (reference.id === 0 || !reference.id) {
                        savedGuidBibleReferences.push(await this.createGuidBibleReference(tx, reference, guideData.guide.id));
                    } else {
                        savedGuidBibleReferences.push(await this.updateGuidBibleReference(tx, reference));
                    }
                }
                guideData.biblicalReferences = savedGuidBibleReferences;
            }

            return guideData;


        });


        return result;
    }

    async findById(id: number): Promise<Guide> {
        const guide = await this.prisma.guide.findUnique({
            where: { id },
        });
        return GuideMapper.mapGuideModelToDomain(guide);
    }

    async findByName(name: string): Promise<Guide> {
        const guide = await this.prisma.guide.findFirst({
            where: { name },
        });
        return GuideMapper.mapGuideModelToDomain(guide);
    }


    async findAll(): Promise<Guide[]> {
        const guides = await this.prisma.guide.findMany();
        return guides.map(guide => GuideMapper.mapGuideModelToDomain(guide));
    }

}