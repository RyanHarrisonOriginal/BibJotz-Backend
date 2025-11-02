
import { Guide } from "@/domain/Guide/guide";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IGuideSectionDTO } from "@/domain/Guide/Sections/guide-section.dto";
import { GuideSectionFactory } from "@/domain/Guide/Sections/guide-section-factory";
import { BiblicalReferenceFactory } from "@/domain/BiblicalReferences/biblical-reference-factory";

interface IGuideCreationProps {
    id: number | null;
    name: string;
    description: string;
    isPublic: boolean;
    biblicalReferences: IBiblicalReferenceDTO[];
    guideSections: IGuideSectionDTO[];
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
}

export class GuideFactory {
    static create(data: IGuideCreationProps): Guide {
        if (!data.name) {
            throw new Error('Name is required');
        }
        if (!data.description) {
            throw new Error('Description is required');
        }
        return new Guide(
            data.id,
            data.name,
            data.description, 
            data.isPublic, 
            GuideSectionFactory.createArray(data.guideSections),
            BiblicalReferenceFactory.createArray(data.biblicalReferences),
            data.authorId,
            data.createdAt,
            data.updatedAt
        );
    }
}