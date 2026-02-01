import { BaseEntity } from "@/domain/BaseEntity";
import { Reflection } from "@/domain/Reflection/reflection";
import { IGuide } from "@/domain/Guide/guide.interface";
import { JourneySection } from "./Sections/journey-section";



export class Journey extends BaseEntity {
    constructor(
        id: number | null,
        private readonly name: string,
        private readonly ownerId: number,
        private readonly guideVersionId: number,
        private readonly sourceGuide: IGuide,
        private readonly sections: JourneySection[] = [],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ){
        super(id ?? 0, createdAt, updatedAt);
    }

    getName(): string {
        return this.name;
    }

    getOwnerId(): number {
        return this.ownerId;
    }

    getGuideVersionId(): number {
        return this.guideVersionId;
    }

    getSourceGuide(): IGuide {
        return this.sourceGuide;
    }

    getSections(): JourneySection[] {
        return this.sections;
    }



}