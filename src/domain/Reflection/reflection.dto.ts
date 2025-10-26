import { IBiblicalReferenceDTO } from "../Guide/guide.dto";

export interface IReflectionDTO {
    id: number;
    content: string;
    userId: number;
    journeyId: number;
    biblicalReferences: IBiblicalReferenceDTO[];
    createdAt: Date;
    updatedAt: Date;
}