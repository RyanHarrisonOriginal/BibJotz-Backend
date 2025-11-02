import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";
import { Journey } from "@/domain/Jouney/jouney";
import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";

interface IJourneyCreationProps {
    id: number | null;
    title: string;
    ownerId: number;
    guideId: number;
    reflections: IReflectionDTO[];
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
            ReflectionFactory.createArray(data.reflections),
            data.createdAt,
            data.updatedAt
        );
    }
}