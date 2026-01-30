import { BaseEntity } from "@/domain/BaseEntity";
import { BiblicalReference } from "@/domain/BiblicalReferences/biblical-reference";

export class Reflection extends BaseEntity {
    constructor(
        id: number | null,
        private readonly content: string,
        private readonly authorId: number,
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

    getAuthorId(): number {
        return this.authorId;
    }

    getJourneyId(): number {
        return this.journeyId;
    }

    getBiblicalReferences(): BiblicalReference[] {
        return this.biblicalReferences;
    }

    addBiblicalReferences(biblicalReferences: BiblicalReference[]) {
        this.biblicalReferences.push(...biblicalReferences);
        this.touch();
    }
}