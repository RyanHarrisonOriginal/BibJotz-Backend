import { GuideSection } from "@/domain/Guide/Sections/guide-section";

export class GuideSectionMapper {
    public static mapGuideSectionToDomain(guideSection: any): GuideSection {
        return new GuideSection(
            guideSection.id,
            guideSection.title,
            guideSection.ordinalPosition,
            guideSection.description,
            guideSection.biblicalReferences
        );
    }

    public static mapGuideSectionsToDomain(guideSections: any[]): GuideSection[] {
        return guideSections.map((guideSection) => this.mapGuideSectionToDomain(guideSection));
    }
}