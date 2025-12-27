import { Guide } from "@/domain/Guide/guide";
import { GuideSection } from "@/domain/Guide/Sections/guide-section";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { PrismaClient, Prisma } from "@prisma/client";
import { GuideMapper } from "@/domain/Guide/guide.mapper";
import { PrismaClientType } from "../types";
import { isTransactionClient } from "../utils/prismaHelpers";
import { GuideListItem, GuideListPayload } from "@/domain/Guide/guide.interface";
import { readFileSync } from "fs";
import { join } from "path";


const SQL_DIR = join(process.cwd(), "src", "infrastructure", "persistence", "postgres", "sql");
const GUIDE_LIST_SQL = readFileSync(join(SQL_DIR, "get-guide-list.sql"), "utf-8");
const GUIDE_LIST_COUNTS_SQL = readFileSync(join(SQL_DIR, "get-guide-list-counts.sql"), "utf-8");

export class GuidePostgresRepository implements IGuideRepository {
    constructor(private readonly client: PrismaClientType) { }


    private async createGuide(tx: Prisma.TransactionClient, guideData: any): Promise<any> {
        const savedGuide = await tx.guide.create({
            data: {
                name: guideData.name,
                description: guideData.description,
                isPublic: guideData.isPublic,
                authorId: guideData.authorId,
            },
        });
        return savedGuide;
    }

    private async updateGuide(tx: Prisma.TransactionClient, guideData: any): Promise<any> {
        const savedGuide = await tx.guide.update({
            where: { id: guideData.id },
            data: {
                name: guideData.name,
                description: guideData.description,
                isPublic: guideData.isPublic,
                authorId: guideData.authorId,
            },
        });
        return savedGuide;
    }

    private async createGuideSection(
        tx: Prisma.TransactionClient, 
        guideSectionData: any, 
        guideId: number | null
    ): Promise<any> {
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

        return savedGuideSection;
    }

    private async updateGuideSection(
        tx: Prisma.TransactionClient, 
        guideSectionData: any
    ): Promise<any> {
        const savedGuideSection = await tx.guideSection.update({
            where: { id: guideSectionData.id },
            data: {
                ordinalPosition: guideSectionData.ordinalPosition,
                title: guideSectionData.title,
                description: guideSectionData.description,
            },
        });
        return savedGuideSection;
    }

    private async createGuideSectionBibleReference(
        tx: Prisma.TransactionClient, 
        guideSectionBibleReferenceData: any, 
        guideSectionId: number | null
    ): Promise<any> {
        const savedGuideSectionBibleReference = await tx.guideSectionBibleReference.create({
            data: {
                guideSectionId: guideSectionId ?? 0,
                book: guideSectionBibleReferenceData.book,
                chapter: guideSectionBibleReferenceData.chapter,
                startVerse: guideSectionBibleReferenceData.startVerse,
                endVerse: guideSectionBibleReferenceData.endVerse,
            },
        });
        return savedGuideSectionBibleReference;
    }

    private async createGuidBibleReference(
        tx: Prisma.TransactionClient, 
        guidBibleReferenceData: any, 
        guideId: number | null
    ): Promise<any> {
        const savedGuidBibleReference = await tx.guidBibleReference.create({
            data: {
                guideId: guideId ?? 0,
                book: guidBibleReferenceData.book,
                chapter: guidBibleReferenceData.chapter,
                startVerse: guidBibleReferenceData.startVerse,
                endVerse: guidBibleReferenceData.endVerse,
            },
        });
        return savedGuidBibleReference;
    }

    private async updateGuidBibleReference(
        tx: Prisma.TransactionClient, 
        guidBibleReferenceData: any
    ): Promise<any> {
        const savedGuidBibleReference = await tx.guidBibleReference.update({
            where: { id: guidBibleReferenceData.id },
            data: {
                book: guidBibleReferenceData.book,
                chapter: guidBibleReferenceData.chapter,
                startVerse: guidBibleReferenceData.startVerse,
                endVerse: guidBibleReferenceData.endVerse,
            },
        });
        return savedGuidBibleReference;
    }

    async save(guide: Guide): Promise<any> {
        const guideData = GuideMapper.mapGuideToPersistenceModel(guide);
        if (isTransactionClient(this.client)) {
            return await this.executeSave(this.client, guideData);
        } else {
            const prismaClient = this.client as PrismaClient;
            return await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
                return await this.executeSave(tx, guideData);
            });
        }
    }

    private async executeSave(tx: Prisma.TransactionClient, guideData: any): Promise<any> {
        let savedGuide: any;

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
    }

    async findGuideById(id: number): Promise<Guide> {
        const guide = await this.client.guide.findFirst({
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
        const guide = await this.client.guide.findFirst({
            where: { name },
        });
        return GuideMapper.mapGuideModelToDomain(guide);
    }

    async getGuideList(userId: number): Promise<GuideListPayload> {
        const guides = await this.client.$queryRawUnsafe<any[]>(GUIDE_LIST_SQL, userId);
        const counts = await this.client.$queryRawUnsafe<any[]>(GUIDE_LIST_COUNTS_SQL, userId);
        return GuideMapper.mapGuideListPayloadToDomain(guides, counts);
    }

    async deleteGuide(guideId: number, userId: number): Promise<void> {
        const deleteInTransaction = async (tx: Prisma.TransactionClient) => {
            const guideExists = await tx.$executeRawUnsafe(
                `select 1 FROM app.guides WHERE id = ${guideId} and created_by = ${userId}`
            );

            if (!guideExists) {
                throw new Error('Guide not found or you do not have permission to delete it');
            }

            await tx.$executeRawUnsafe(
                `DELETE FROM app.guide_section_biblical_references 
                 WHERE guide_section_id IN (
                     SELECT id FROM app.guide_sections WHERE guide_id = ${guideId}
                 )`
            );
            await tx.$executeRawUnsafe(
                `DELETE FROM app.guide_sections WHERE guide_id = ${guideId}`
            );
            await tx.$executeRawUnsafe(
                `DELETE FROM app.guide_biblical_references WHERE guide_id = ${guideId}`
            );
            await tx.$executeRawUnsafe(
                `DELETE FROM app.guides WHERE id = ${guideId}`
            );
        };
        if (isTransactionClient(this.client)) {
            await deleteInTransaction(this.client);
        } else {
            const prismaClient = this.client as PrismaClient;
            await prismaClient.$transaction(deleteInTransaction);
        }
    }

}