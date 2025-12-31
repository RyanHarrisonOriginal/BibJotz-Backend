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
                isPublic: guideData.isPublic,
                authorId: guideData.authorId,
            },
        });
        return savedGuide;
    }

    private async createGuideVersion(tx: Prisma.TransactionClient, guideVersionData: any): Promise<any> {
        const savedGuideVersion = await tx.guideVersion.create({
            data: {
                guideId: guideVersionData.guideId,
                name: guideVersionData.name,
                description: guideVersionData.description,
                isCurrent: true,
            },
        });
        return savedGuideVersion;
    }

    private async updateGuideVersion(tx: Prisma.TransactionClient, guideVersionData: any): Promise<any> {
        const savedGuideVersion = await tx.guideVersion.update({
            where: { id: guideVersionData.id },
            data: {
                name: guideVersionData.name,
                description: guideVersionData.description,
                isCurrent: true,
            },
        });
        return savedGuideVersion;
    }

    private async createGuideSection(
        tx: Prisma.TransactionClient, 
        guideSectionData: any, 
        guideVersionId: number | null
    ): Promise<any> {
        const savedGuideSection = await tx.guideSection.create({
            data: {
                guideVersionId: guideVersionId ?? 0,
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
        guideSectionData: any,
        guideVersionId: number | null
    ): Promise<any> {
        const savedGuideSection = await tx.guideSection.update({
            where: { id: guideSectionData.id },
            data: {
                guideVersionId: guideVersionId ?? 0,
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
        const savedGuideSectionBibleReference = await tx.guideSectionBiblicalReference.create({
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
        guideVersionId: number | null
    ): Promise<any> {
        const savedGuidBibleReference = await tx.guideBiblicalReference.create({
            data: {
                guideVersionId: guideVersionId ?? 0,
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
        guidBibleReferenceData: any,
        guideVersionId: number | null
    ): Promise<any> {
        const savedGuidBibleReference = await tx.guideBiblicalReference.update({
            where: { id: guidBibleReferenceData.id },
            data: {
                guideVersionId: guideVersionId ?? 0,
                book: guidBibleReferenceData.book,
                chapter: guidBibleReferenceData.chapter,
                startVerse: guidBibleReferenceData.startVerse,
                endVerse: guidBibleReferenceData.endVerse,
            },
        });
        return savedGuidBibleReference;
    }

    async save(guide: Guide): Promise<any> {
        if (isTransactionClient(this.client)) {
            return await this.executeSave(this.client, guide);
        } else {
            const prismaClient = this.client as PrismaClient;
            return await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
                return await this.executeSave(tx, guide);
            });
        }
    }

    private async _handleGuideRoot(tx: Prisma.TransactionClient, guideData: any): Promise<any> {
        const guideRoot = GuideMapper.mapGuidetoRootPeristenceModel(guideData)
        let savedGuideRoot: any;
        savedGuideRoot = await (
            guideRoot.id === 0 || !guideRoot.id
                ? this.createGuide(tx, guideRoot)
                : this.updateGuide(tx, guideRoot)
        );
        return savedGuideRoot;
    }

    private async _handleGuideVersion(tx: Prisma.TransactionClient, guideData: any, guideId: number | null): Promise<any> {

        const guideVersion = GuideMapper.mapGuideToGuideVersionPersistenceModel(guideData, guideId)
        let savedGuideVersion: any;
        savedGuideVersion = await (
            guideVersion.id === 0 || !guideVersion.id
                ? this.createGuideVersion(tx, guideVersion)
                : this.updateGuideVersion(tx, guideVersion)
        );
        return savedGuideVersion;
    }

    private async _handleGuideBiblicalReferences(tx: Prisma.TransactionClient, guideData: any, guideVersionId: number | null): Promise<any> {
        const guideBiblicalReferences = GuideMapper.mapGuideBiblicalReferencesToPersistenceModel(
            guideData.getBiblicalReferences(), guideVersionId)
        let savedGuideBiblicalReferences: any[] = [];
        if (guideBiblicalReferences.length > 0) {
            savedGuideBiblicalReferences = await Promise.all(
                guideBiblicalReferences.map((reference: any) =>
                    reference.id === 0 || !reference.id
                        ? this.createGuidBibleReference(tx, reference, guideVersionId)
                        : this.updateGuidBibleReference(tx, reference, guideVersionId)
                )
            );
        }
        return savedGuideBiblicalReferences;
    }

    private async _handleGuideSections(tx: Prisma.TransactionClient, guideData: any, guideVersionId: number | null): Promise<any> {
        const guideSections = GuideMapper.mapGuideSectionsToPersistenceModel(
            guideData.guideSections, guideVersionId)
        let savedGuideSections: any[] = [];
        if (guideSections.length > 0) {
            savedGuideSections = await Promise.all(
                guideSections.map((section: any) =>
                    section.id === 0 || !section.id
                        ? this.createGuideSection(tx, section, guideVersionId)
                        : this.updateGuideSection(tx, section, guideVersionId)
                )
            );
        }
        return savedGuideSections;
    }

    private async executeSave(tx: Prisma.TransactionClient, guideData: any): Promise<any> {
        
        const savedGuideRoot = await this._handleGuideRoot(tx, guideData);
        const savedGuideVersion = await this._handleGuideVersion(tx, guideData, savedGuideRoot.id);
        const savedGuideBiblicalReferences = await this._handleGuideBiblicalReferences(tx, guideData, savedGuideVersion.id);
        const savedGuideSections = await this._handleGuideSections(tx, guideData, savedGuideVersion.id);

        return {
            guideRoot: savedGuideRoot.id,
            guideVersion: savedGuideVersion.id,
            guideBiblicalReferences: savedGuideBiblicalReferences.map((reference: any) => reference.id),
            guideSections: savedGuideSections.map((section: any) => section.id),
        };
    
    }

    async findGuideById(id: number): Promise<Guide> {
        const guide = await this.client.guide.findFirst({
            where: { id },
            include: {
                versions: {
                    where: { isCurrent: true },
                    include: {
                        sections: {
                            include: {
                                biblicalReferences: true,
                            },
                        },
                        biblicalReferences: true,
                    },
                },
            },
        });
        return GuideMapper.mapGuideModelToDomain(guide);
    }

    async findGuideByName(name: string): Promise<Guide> {
        const guide = await this.client.guide.findFirst({
            where: { versions: { some: { name } } },
            include: {
                versions: {
                    where: { isCurrent: true },
                    include: {
                        sections: { include: { biblicalReferences: true } },
                        biblicalReferences: true,
                    },
                },
            },
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
            const guideExists = await tx.$queryRawUnsafe<any[]>(
                `SELECT 1 FROM app.guides WHERE id = ${guideId} AND author_id = ${userId}`
            );

            if (!guideExists || guideExists.length === 0) {
                throw new Error('Guide not found or you do not have permission to delete it');
            }

            // Delete guide section biblical references for unreferenced versions
            // (versions that are not referenced by any Journey)
            await tx.$executeRawUnsafe(
                `DELETE FROM app.guide_section_biblical_refs
                 WHERE guide_section_id IN (
                     SELECT gs.id 
                     FROM app.guide_sections gs
                     INNER JOIN app.guide_versions gv ON gs.guide_version_id = gv.id
                     WHERE gv.guide_id = ${guideId}
                     AND NOT EXISTS (
                         SELECT 1 FROM app.journeys j 
                         WHERE j.guide_version_id = gv.id
                     )
                 )`
            );

            // Delete guide sections for unreferenced versions
            await tx.$executeRawUnsafe(
                `DELETE FROM app.guide_sections
                 WHERE guide_version_id IN (
                     SELECT id FROM app.guide_versions
                     WHERE guide_id = ${guideId}
                     AND NOT EXISTS (
                         SELECT 1 FROM app.journeys j 
                         WHERE j.guide_version_id = app.guide_versions.id
                     )
                 )`
            );

            // Delete guide biblical references for unreferenced versions
            await tx.$executeRawUnsafe(
                `DELETE FROM app.guide_biblical_refs
                 WHERE guide_version_id IN (
                     SELECT id FROM app.guide_versions
                     WHERE guide_id = ${guideId}
                     AND NOT EXISTS (
                         SELECT 1 FROM app.journeys j 
                         WHERE j.guide_version_id = app.guide_versions.id
                     )
                 )`
            );

            // Delete unreferenced guide versions
            await tx.$executeRawUnsafe(
                `DELETE FROM app.guide_versions
                 WHERE guide_id = ${guideId}
                 AND NOT EXISTS (
                     SELECT 1 FROM app.journeys j 
                     WHERE j.guide_version_id = app.guide_versions.id
                 )`
            );

            // Check if there are any remaining guide versions
            const remainingVersions = await tx.$queryRawUnsafe<any[]>(
                `SELECT COUNT(*) as count FROM app.guide_versions WHERE guide_id = ${guideId}`
            );

            const remainingCount = remainingVersions[0]?.count || 0;

            // Only delete the guide if all versions have been deleted
            if (remainingCount === 0) {
                await tx.$executeRawUnsafe(
                    `DELETE FROM app.guides WHERE id = ${guideId}`
                );
            }
        };
        if (isTransactionClient(this.client)) {
            await deleteInTransaction(this.client);
        } else {
            const prismaClient = this.client as PrismaClient;
            await prismaClient.$transaction(deleteInTransaction);
        }
    }

}