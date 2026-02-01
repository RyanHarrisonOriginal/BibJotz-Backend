import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";

export interface IJourneyDTO {
    id: number;
    name: string;
    userId: number;
    guideId: number;
    reflections: IReflectionDTO[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindJourneyQueryParamsDTO {
    id?: string | string[];
    ownerId?: string | string[];
    guideId?: string | string[];
}