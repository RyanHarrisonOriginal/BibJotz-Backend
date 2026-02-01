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

/** Request DTO: query string shape for GET /journeys (find journey). Values are strings from the request. */
export interface IFindJourneyQueryParamsDTO {
    id?: string | string[];
    ownerId?: string | string[];
    guideId?: string | string[];
}