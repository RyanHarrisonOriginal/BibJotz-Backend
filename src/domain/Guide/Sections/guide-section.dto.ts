import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";

export interface IGuideSectionDTO {
    id: number;
    ordinalPosition: number;
    title: string;
    description: string;
    guideId?: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}