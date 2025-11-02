import { BaseEntity } from "../BaseEntity";
import { BiblicalReference } from "../BiblicalReferences/biblical-reference";
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
    
    getGuideSectionById(id: number): GuideSection | undefined {
        return this.getGuideSections().find((section) => section.getId() === id);
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

    addBiblicalReferences(biblicalReferences: BiblicalReference[]) {
        this.biblicalReferences.push(...biblicalReferences);
        this.touch();
    }

    
    
}