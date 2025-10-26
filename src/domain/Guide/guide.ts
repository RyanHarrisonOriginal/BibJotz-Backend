import { BaseEntity } from "../BaseEntity";
import { BiblicalReference } from "../shared/value-objects/BiblicalReference";
import { GuideSection } from "./guide-section";

export class Guide extends BaseEntity {
    constructor(
        id: number | null,
        private name: string,
        private description: string,
        private isPublic: boolean,
        private guideSections: GuideSection[] = [],
        private biblicalReferences: BiblicalReference[] = [],
        private authorId: number,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        super(id ?? 0, createdAt, updatedAt);
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }
    
    getIsPublic(): boolean {
        return this.isPublic;
    }

    getGuideSections(): GuideSection[] {
        return this.guideSections;
    }
    
    getAuthorId(): number {
        return this.authorId;
    }
    
    getBiblicalReferences(): BiblicalReference[] {
        return this.biblicalReferences;
    }

    updateName(name: string) {
        this.name = name;
        this.touch();
    }

    addGuideSection(guideSection: GuideSection) {
        guideSection.setOrdinalPosition(this.guideSections.length ?? 0 + 1);
        this.guideSections.push(guideSection);
        this.touch();
    }

    addBiblicalReference(biblicalReference: BiblicalReference) {
        this.biblicalReferences.push(biblicalReference);
        this.touch();
    }

    
    
}