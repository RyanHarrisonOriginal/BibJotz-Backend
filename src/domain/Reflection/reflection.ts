import { BaseEntity } from "../BaseEntity";
import { BiblicalReference } from "../shared/value-objects/BiblicalReference";

export class Reflection extends BaseEntity {
    constructor(
        id: number | null,
        private readonly content: string,
        private readonly userId: number,
        private readonly journeyId: number,
        private readonly biblicalReferences: BiblicalReference[],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ){
        super(id ?? 0, createdAt, updatedAt);
    }

    getContent(): string {
        return this.content;
    }

    getUserId(): number {
        return this.userId;
    }

    getJourneyId(): number {
        return this.journeyId;
    }

    getBiblicalReferences(): BiblicalReference[] {
        return this.biblicalReferences;
    }

    addBiblicalReference(biblicalReference: BiblicalReference) {
        this.biblicalReferences.push(biblicalReference);
        this.touch();
    }
}