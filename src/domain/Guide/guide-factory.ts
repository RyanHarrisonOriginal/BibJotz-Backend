import { BiblicalReference } from "../BiblicalReferences/biblical-reference";
import { Guide } from "./guide";
import { IBiblicalReferenceDTO } from "../BiblicalReferences/biblical-reference.dto";
import { IGuideSectionDTO } from "./guide-section.dto";
import { BiblicalReferenceMapper } from "../BiblicalReferences/biblical-reference.mapper";
import { GuideSectionMapper } from "@/domain/Guide/guide-section.mapper";

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
            GuideSectionMapper.mapGuideSectionsToDomain(data.guideSections),
            BiblicalReferenceMapper.mapBiblicalReferencesToDomain(data.biblicalReferences),
            data.authorId,
            data.createdAt,
            data.updatedAt
        );
    }
}