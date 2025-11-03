import { GuideSection } from "@/domain/Guide/Sections/guide-section";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { BiblicalReferenceFactory } from "@/domain/BiblicalReferences/biblical-reference-factory";
import { IGuideSectionDTO } from "@/domain/Guide/Sections/guide-section.dto";

interface IGuideSectionCreationProps {
    id: number | null;
    title: string;
    description: string;
    biblicalReferences: IBiblicalReferenceDTO[];
}

export class GuideSectionFactory {
    public static create(data: IGuideSectionCreationProps): GuideSection {
        return new GuideSection(
            data.id,
            data.title,
            0,
            data.description,
            BiblicalReferenceFactory.createArray(data.biblicalReferences),
        );
    }

    public static createArray(data: IGuideSectionDTO[]): GuideSection[] {
        return data.map((item) => this.create({
            id: null,
            title: item.title,
            description: item.description,
            biblicalReferences: item.biblicalReferences,
        }));
    }
}