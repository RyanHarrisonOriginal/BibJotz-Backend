import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";

export interface IReflectionDTO {
    id: number | null;
    content: string;
    authorId: number;
    guideSectionId: number,
    journeyId: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}

/** Request DTO: add biblical refs to reflection = params + body. Pass { reflectionId, biblicalReferences } from controller. */
export interface IAddBiblicalReferencesToReflectionRequestDTO {
    reflectionId?: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}