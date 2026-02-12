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

/** Reflection in journey library response */
export type LibraryReflection = {
    id: string;
    content: string;
    sectionTitle: string;
    createdAt: string;
};

/** Section in journey library response */
export type LibraryJourneySection = {
    id: string;
    title: string;
};

/** Journey in journey library response */
export type LibraryJourney = {
    id: string;
    title: string;
    guideTitle: string;
    sections: LibraryJourneySection[];
    reflections: LibraryReflection[];
};

/** Response payload for get journey library */
export interface IGetJourneyLibraryPayloadDTO {
    journeys: LibraryJourney[];
}

export interface IGetJourneyLibraryRequestDTO {
    ownerId?: string | string[];
}