import { IBiblicalReferenceDTO } from "../BiblicalReferences/biblical-reference.dto";
import { IGuideSectionDTO } from "./guide-section.dto";


export interface IGuideDTO {
    id: string | null;
    name: string;
    description: string;
    isPublic: boolean;
    biblicalReferences: IBiblicalReferenceDTO[];
    guideSections: IGuideSectionDTO[];
    authorId: number;
}