import { IGuideSection } from "./Sections/guide-section.interface";
import { IBiblicalReference } from "@/domain/BiblicalReferences/biblical-references.interface";

export interface IGuide  {
    id: string | null;
    name: string;
    description: string;
    isPublic: boolean;
    biblicalReferences: IBiblicalReference[];
    guideSections: IGuideSection[];
    authorId: number;
} 

export interface IGuideListItem {
    id: number;
    name: string;
    description: string;
    isPublic: boolean;
    authorName: string;
    numberOfSections: number;
    numberOfJourneys: number;
    numberOfReflections: number;

}


export interface IGuideListPayload {
    guides: IGuideListItem[];
    counts: {
        myGuides: number;
        communityGuides: number;
    };
}