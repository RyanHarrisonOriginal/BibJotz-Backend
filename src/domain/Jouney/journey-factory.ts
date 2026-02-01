import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";
import { Journey } from "@/domain/Jouney/jouney";
import { IGuide } from "../Guide/guide.interface";
import { JourneySection } from "./Sections/journey-section";

interface IJourneyCreationProps {
    id: number | null;
    name: string;
    ownerId: number;
    guideVersionId: number;
    sourceGuide: IGuide;
    sections: JourneySection[];
    createdAt: Date;
    updatedAt: Date;
}
export class JourneyFactory {
    static create(data: IJourneyCreationProps): Journey {
        return new Journey(
            data.id,
            data.name,
            data.ownerId,
            data.guideVersionId,
            data.sourceGuide,
            data.sections ?? [],
            data.createdAt,
            data.updatedAt
        );
    }
}   