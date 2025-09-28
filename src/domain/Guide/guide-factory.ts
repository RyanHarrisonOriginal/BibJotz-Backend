import { BiblicalReference } from "../shared/value-objects/BiblicalReference";
import { Guide } from "./guide";
import { GuideSection } from "./guide-section";
import { IBiblicalReferenceDTO } from "./guide.dto";
import { IGuideSectionDTO } from "./guide.dto";
import { GuideMapper } from "./guide.mapper";

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
            data.guideSections.map(section => GuideMapper.mapGuideSectionModelToDomain(section)),
            data.biblicalReferences.map(reference => GuideMapper.mapBiblicalReferenceModelToDomain(reference)),
            data.authorId,
            data.createdAt,
            data.updatedAt
        );
    }
}