import { GuideSection } from "./guide-section";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { BiblicalReferenceMapper } from "@/domain/BiblicalReferences/biblical-reference.mapper";
import { IGuideSectionDTO } from "./guide-section.dto";

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
            BiblicalReferenceMapper.mapBiblicalReferencesToDomain(data.biblicalReferences),
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