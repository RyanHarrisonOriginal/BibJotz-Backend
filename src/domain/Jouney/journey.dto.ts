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

/** Single reflection entry in a section (library response). */
export type LibraryReflectionEntry = {
    id: string;
    entry_key: string;
    content: string;
    createdAt: string;
};

/** Section with its reflection entries (library response). */
export type LibrarySectionReflections = {
    sectionId: string;
    sectionTitle: string;
    entries: LibraryReflectionEntry[];
};

/** Section in journey library response */
export type LibraryJourneySection = {
    id: string;
    title: string;
};

/** Journey in journey library response (reflections grouped by section). */
export type LibraryJourney = {
    id: string;
    title: string;
    guideTitle: string;
    sections: LibraryJourneySection[];
    sectionReflections: LibrarySectionReflections[];
};

/** Response payload for get journey library */
export interface IGetJourneyLibraryPayloadDTO {
    journeys: LibraryJourney[];
}

export interface IGetJourneyLibraryRequestDTO {
    ownerId?: string | string[];
}