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