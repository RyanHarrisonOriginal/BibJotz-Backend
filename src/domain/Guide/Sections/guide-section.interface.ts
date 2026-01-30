import { IBiblicalReference } from "@/domain/BiblicalReferences/biblical-references.interface";

export interface IGuideSection {
    id: number;
    ordinalPosition: number;
    title: string;
    description: string;
    guideId?: number;
    biblicalReferences: IBiblicalReference[];
}