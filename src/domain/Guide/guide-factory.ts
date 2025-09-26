import { Guide } from "./guide";
import { BiblicalReference } from "../shared/value-objects/BiblicalReference";
import { GuideSection } from "./guide-section";

interface IGuideCreationProps {
    id: number | null;
    name: string;
    description: string;
    isPublic: boolean;
    biblicalReferences: BiblicalReference[];
    guideSections: GuideSection[];
}

export class GuideFactory {
    static create(data: IGuideCreationProps): Guide {
        if (!data.name) {
            throw new Error('Name is required');
        }
        if (!data.description) {
            throw new Error('Description is required');
        }
        return new Guide(
            data.id,
            data.name, 
            data.description, 
            data.isPublic, 
            data.guideSections,
            data.biblicalReferences, 
            new Date(),
            new Date()
        );
    }
}