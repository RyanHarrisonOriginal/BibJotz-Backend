import { BiblicalReference } from "../shared/value-objects/BiblicalReference";
import { BaseEntity } from "../BaseEntity";

export class GuideSection extends BaseEntity {
    constructor(
        id: number | null,
        private readonly title: string,
        private readonly ordinalPosition: number,
        private readonly description: string,
        private readonly biblicalRefrences: BiblicalReference[],
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

    getBiblicalRefrences(): BiblicalReference[] {
        return this.biblicalRefrences;
    }

    setOrdinalPosition(ordinalPosition: number) {
        this.setOrdinalPosition(ordinalPosition);
        this.touch();
    }
}