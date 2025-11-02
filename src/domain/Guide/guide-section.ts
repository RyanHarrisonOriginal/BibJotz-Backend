import { BiblicalReference } from "../BiblicalReferences/biblical-reference";
import { BaseEntity } from "../BaseEntity";

export class GuideSection extends BaseEntity {
    constructor(
        id: number | null,
        private readonly title: string,
        private ordinalPosition: number,
        private readonly description: string,
        private readonly biblicalReferences: BiblicalReference[],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        super(id ?? 0, createdAt, updatedAt);
    }

    getTitle(): string {
        return this.title;
    }

    getOrdinalPosition(): number {
        return this.ordinalPosition;
    }

    getDescription(): string {
        return this.description;
    }

    getBiblicalReferences(): BiblicalReference[] {
        return this.biblicalReferences;
    }

    setOrdinalPosition(ordinalPosition: number) {
        this.ordinalPosition = ordinalPosition;
        this.touch();
    }

    addBiblicalReferences(biblicalReferences: BiblicalReference[]) {
        this.biblicalReferences.push(...biblicalReferences);
        this.touch();
    }
}