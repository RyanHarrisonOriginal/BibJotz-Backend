import { BaseEntity } from "../BaseEntity";
import { BiblicalRefrence } from "../shared/value-objects/BiblicalRefrence";
import { GuideSection } from "./guide-section";

export class Guide extends BaseEntity {
    constructor(
        id: number | null,
        private name: string,
        private description: string,
        private isPublic: boolean,
        private guideSections: GuideSection[],
        private biblicalRefrences: BiblicalRefrence[],
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
    
    getBiblicalRefrences(): BiblicalRefrence[] {
        return this.biblicalRefrences;
    }

    updateName(name: string) {
        this.name = name;
        this.touch();
    }

    addGuideSection(guideSection: GuideSection) {
        this.guideSections.push(guideSection);
        this.touch();
    }

    addBiblicalRefrence(biblicalRefrence: BiblicalRefrence) {
        this.biblicalRefrences.push(biblicalRefrence);
        this.touch();
    }
    
}