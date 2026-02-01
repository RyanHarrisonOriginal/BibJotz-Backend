import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IGuideSectionDTO } from "@/domain/Guide/Sections/guide-section.dto";

export interface IGuideDTO {
    id: string | null;
    name: string;
    description: string;
    isPublic: boolean;
    biblicalReferences: IBiblicalReferenceDTO[];
    guideSections: IGuideSectionDTO[];
    authorId: number;
}

/** Request DTO: route params when only guideId is in the path */
export interface IGuideIdParamsDTO {
    guideId?: string;
}

/** Request DTO: route params when guideId and sectionId are in the path */
export interface IGuideSectionParamsDTO {
    guideId?: string;
    sectionId?: string;
}

/** Request DTO: add guide section = params + body. Pass { guideId, guideSection } from controller. */
export interface IAddGuideSectionRequestDTO {
    guideId?: string;
    guideSection: IGuideSectionDTO;
}

/** Request DTO: add biblical refs to guide = params + body. */
export interface IAddBiblicalReferenceToGuideRequestDTO {
    guideId?: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}

/** Request DTO: add biblical refs to guide section = params + body. */
export interface IAddBiblicalReferenceToGuideSectionRequestDTO {
    guideId?: string;
    sectionId?: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}

/** Request DTO: delete guide = params + userId from auth. */
export interface IDeleteGuideRequestDTO {
    guideId?: string;
    userId: number;
}