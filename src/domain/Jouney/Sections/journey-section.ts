import { BaseEntity } from "@/domain/BaseEntity";
import { BiblicalReference } from "@/domain/BiblicalReferences/biblical-reference";
import { JourneySectionType } from "./journey-section.types";
import { Reflection } from "@/domain/Reflection/reflection";




export class JourneySection extends BaseEntity {
    constructor(
        id: number | null,
        private readonly title: string,
        private readonly description: string,
        private readonly type: JourneySectionType,
        private readonly biblicalReferences: BiblicalReference[],
        private readonly reflections: Reflection[] = [],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        super(id ?? 0, createdAt, updatedAt);
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getType(): JourneySectionType {
        return this.type;
    }

    getBiblicalReferences(): BiblicalReference[] {
        return this.biblicalReferences;
    }

    getReflections(): Reflection[] {
        return this.reflections;
    }
    
    addReflection(reflection: Reflection) {
        this.reflections.push(reflection);
        this.touch();
    }

    addBiblicalReferences(biblicalReferences: BiblicalReference[]) {
        this.biblicalReferences.push(...biblicalReferences);
        this.touch();
    }
}