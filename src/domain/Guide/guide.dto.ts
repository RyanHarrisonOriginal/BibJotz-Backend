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

export interface IGuideIdParamsDTO {
    guideId?: string;
}

export interface IGuideSectionParamsDTO {
    guideId?: string;
    sectionId?: string;
}

export interface IAddGuideSectionRequestDTO {
    guideId?: string;
    guideSection: IGuideSectionDTO;
}

export interface IAddBiblicalReferenceToGuideRequestDTO {
    guideId?: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}

export interface IAddBiblicalReferenceToGuideSectionRequestDTO {
    guideId?: string;
    sectionId?: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}

export interface IDeleteGuideRequestDTO {
    guideId?: string;
    userId: number;
}