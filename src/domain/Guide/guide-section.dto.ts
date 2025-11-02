import { IBiblicalReferenceDTO } from "../BiblicalReferences/biblical-reference.dto";

export interface IGuideSectionDTO {
    title: string;
    description: string;
    guideId?: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}