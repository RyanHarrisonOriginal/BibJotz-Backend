import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";

export interface IReflectionDTO {
    id: number | null;
    content: string;
    authorId: number;
    guideSectionId: number,
    journeyId: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}