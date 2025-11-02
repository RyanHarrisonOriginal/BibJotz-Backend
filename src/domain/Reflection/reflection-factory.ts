
import { Reflection } from "./reflection";
import { BiblicalReferenceMapper } from "../BiblicalReferences/biblical-reference.mapper";
import { IBiblicalReferenceDTO } from "../BiblicalReferences/biblical-reference.dto";


interface IReflectionCreationProps {
    id: number | null;
    content: string;
    authorId: number;
    journeyId: number;
    guideSectionId: number;
    biblicalReferences: IBiblicalReferenceDTO[];
}

export class ReflectionFactory {
    static create(data: IReflectionCreationProps): Reflection {
        return new Reflection(
            data.id,
            data.content,
            data.authorId,
            data.journeyId,
            data.guideSectionId,
            BiblicalReferenceMapper.mapBiblicalReferencesToDomain(data.biblicalReferences),
        );
    }
}