import { BiblicalReference } from "../shared/value-objects/BiblicalReference";

export interface IGuideSectionDTO {
    title: string;
    description: string;
    guideId?: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}

export interface IBiblicalReferenceDTO {
    book: string;
    chapter: number;
    startVerse: number;
    endVerse: number;
}

export interface IGuideDTO {
    id: string | null;
    name: string;
    description: string;
    isPublic: boolean;
    biblicalReferences: IBiblicalReferenceDTO[];
    guideSections: IGuideSectionDTO[];
    authorId: number;
}