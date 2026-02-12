import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";

export interface IReflectionDTO {
    id: number | null;
    entryKey: string;
    content: string;
    authorId: number;
    guideSectionId: number;
    journeyId: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}

export interface IAddBiblicalReferencesToReflectionRequestDTO {
    reflectionId?: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}

/** PATCH body for save (update) reflection */
export interface ISaveReflectionRequestDTO {
    content?: string;
}

/** PUT body for upsert reflection (idempotent create-or-update by entry_key) */
export interface IUpsertReflectionRequestDTO {
    entry_key: string;
    journey_id: string;
    guide_section_id: string;
    content: string;
    author_id: number;
}

/** Response shape for reflection (HTTP response body) */
export interface IReflectionResponseDTO {
    id: number;
    entry_key: string;
    content: string;
    authorId: number;
    journeyId: number;
    guideSectionId: number;
    biblicalReferences: IBiblicalReferenceDTO[];
    createdAt: string;
    updatedAt: string;
}