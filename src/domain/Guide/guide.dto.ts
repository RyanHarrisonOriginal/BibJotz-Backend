import { BiblicalReference } from "../shared/value-objects/BiblicalReference";

interface IGuideSectionDTO {
    id: string | null;
    title: string;
    description: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}

interface IBiblicalReferenceDTO {
    id: string | null;
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
}