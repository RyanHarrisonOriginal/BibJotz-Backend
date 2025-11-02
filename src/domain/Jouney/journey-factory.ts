import { Reflection } from "../Reflection/reflection";
import { Journey } from "./jouney";
import { ReflectionFactory } from "../Reflection/reflection-factory";
import { IReflectionDTO } from "../Reflection/reflection.dto";

interface IJourneyCreationProps {
    id: number | null;
    title: string;
    ownerId: number;
    guideId: number;
    reflections: Reflection[];
    createdAt: Date;
    updatedAt: Date;
}
export class JourneyFactory {
    static create(data: IJourneyCreationProps): Journey {
        return new Journey(
            data.id,
            data.title,
            data.ownerId,
            data.guideId,
            data.reflections.map(reflection => ReflectionFactory.create(reflection as unknown as IReflectionDTO)),
            data.createdAt,
            data.updatedAt
        );
    }
}