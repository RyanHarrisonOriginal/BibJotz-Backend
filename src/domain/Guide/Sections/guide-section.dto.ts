import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";

export interface IGuideSectionDTO {
    title: string;
    description: string;
    guideId?: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}