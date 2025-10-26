import { Reflection } from "../Reflection/reflection";
import { Journey } from "./jouney";
import { IGuideDTO } from "../Guide/guide.dto";

interface IJourneyCreationProps {
    id: number | null;
    title: string;
    ownerId: number;
    guide: IGuideDTO;
    reflections: Reflection[];
    createdAt: Date;
    updatedAt: Date;
}
export class JourneyFactory {
    static create(data: IJourneyCreationProps): Journey {
        return new Journey(
            data.id,
            data.title || data.guide.name || '[JOURNEY]',
            data.ownerId,
            data.guide,
            data.reflections,
            data.createdAt,
            data.updatedAt
        );
    }
}