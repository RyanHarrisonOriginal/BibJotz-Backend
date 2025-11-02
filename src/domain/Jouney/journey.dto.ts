import { IGuideDTO } from "../Guide/guide.dto";
import { IReflectionDTO } from "../Reflection/reflection.dto";

export interface IJourneyDTO {
    id: number;
    title: string;
    ownerId: number;
    guideId: number;
    reflections: IReflectionDTO[];
    createdAt: Date;
    updatedAt: Date;
}