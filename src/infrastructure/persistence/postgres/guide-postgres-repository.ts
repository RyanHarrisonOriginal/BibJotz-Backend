import { Guide } from "@/domain/Guide/guide";
import { GuideSection } from "@/domain/Guide/guide-section";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { PrismaClient, Prisma } from "@prisma/client";
import { GuideMapper } from "@/domain/Guide/guide.mapper";
import { BiblicalReference } from "@/domain/BiblicalReferences/biblical-reference";



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
            where: { id: guideData.id },
            data: {
                name: guideData.name,
                description: guideData.description,
                isPublic: guideData.isPublic,
                authorId: guideData.authorId,
            },
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
         if (guideSectionData.biblicalReferences.length > 0) {
            await Promise.all(
                guideSectionData.biblicalReferences.map((reference: any) =>
                    this.createGuideSectionBibleReference(tx, reference, savedGuideSection.id)
                )
            );
        }

        return GuideMapper.mapGuideSectionModelToDomain(savedGuideSection);
    }

    private async updateGuideSection(tx: Prisma.TransactionClient, guideSectionData: any): Promise<GuideSection> {
        const savedGuideSection = await tx.guideSection.update({
            where: { id: guideSectionData.id },
            data: {
                ordinalPosition: guideSectionData.ordinalPosition,
                title: guideSectionData.title,
                description: guideSectionData.description,
            },
        });
        return GuideMapper.mapGuideSectionModelToDomain(savedGuideSection);
    }

    private async createGuideSectionBibleReference(tx: Prisma.TransactionClient, guideSectionBibleReferenceData: any, guideSectionId: number | null): Promise<BiblicalReference> {
        const savedGuideSectionBibleReference = await tx.guideSectionBibleReference.create({
            data: {
                guideSectionId: guideSectionId ?? 0,
                book: guideSectionBibleReferenceData.book,
                chapter: guideSectionBibleReferenceData.chapter,
                startVerse: guideSectionBibleReferenceData.startVerse,
                endVerse: guideSectionBibleReferenceData.endVerse,
            },
        });
        return GuideMapper.mapBiblicalReferenceModelToDomain(savedGuideSectionBibleReference);
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
            data: {
                book: guidBibleReferenceData.book,
                chapter: guidBibleReferenceData.chapter,
                startVerse: guidBibleReferenceData.startVerse,
                endVerse: guidBibleReferenceData.endVerse,
            },
        });
        return GuideMapper.mapBiblicalReferenceModelToDomain(savedGuidBibleReference);
    }

    async save(guide: Guide): Promise<any> {

        const guideData = GuideMapper.mapGuideToPersistencePrisma(guide);

         const result: Guide = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {

            let savedGuide: Guide;
            let savedGuideSections: GuideSection[] = [];
            let savedGuidBibleReferences: BiblicalReference[] = [];

            savedGuide = await (
                guideData.guide.id === 0 || !guideData.guide.id
                    ? this.createGuide(tx, guideData.guide)
                    : this.updateGuide(tx, guideData.guide)
            );
            
            guideData.guide = savedGuide;


            if (guideData.guideSections.length > 0) {
                guideData.guideSections = await Promise.all(
                    guideData.guideSections.map((section: any) =>
                        section.id === 0 || !section.id
                            ? this.createGuideSection(tx, section, guideData.guide.id)
                            : this.updateGuideSection(tx, section)
                    )
                );
            }
                
            if (guideData.biblicalReferences.length > 0) {
                guideData.biblicalReferences = await Promise.all(
                    guideData.biblicalReferences.map((reference: any) =>
                        reference.id === 0 || !reference.id
                            ? this.createGuidBibleReference(tx, reference, guideData.guide.id)
                            : this.updateGuidBibleReference(tx, reference)
                    )
                );
            }
            

            return guideData;


        });


        return result;
    }

    async findGuideById(id: number): Promise<Guide> {
        const guide = await this.prisma.guide.findFirst({
            where: { id },
            include: {
                guideSections: {
                    include: {
                        biblicalReferences: true,
                    },
                },
                biblicalReferences: true,
            },
        });
        return GuideMapper.mapGuideModelToDomain(guide);
    }

    async findGuideByName(name: string): Promise<Guide> {
        const guide = await this.prisma.guide.findFirst({
            where: { name },
        });
        return GuideMapper.mapGuideModelToDomain(guide);
    }


    async findAllGuides(): Promise<Guide[]> {
        const guides = await this.prisma.guide.findMany();
        return guides.map(guide => GuideMapper.mapGuideModelToDomain(guide));
    }

}