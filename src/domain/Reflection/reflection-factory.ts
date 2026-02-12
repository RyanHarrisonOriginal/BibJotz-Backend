import { Reflection } from "@/domain/Reflection/reflection";
import { BiblicalReference } from "@/domain/BiblicalReferences/biblical-reference";
import { BiblicalReferenceFactory } from "@/domain/BiblicalReferences/biblical-reference-factory";
import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";

/** Domain creation props: no DTOs; biblicalReferences are already domain objects. */
interface IReflectionCreationProps {
    id: number | null;
    content: string;
    authorId: number;
    journeyId: number;
    guideSectionId: number;
    biblicalReferences: BiblicalReference[];
}

export class ReflectionFactory {
    static create(data: IReflectionCreationProps): Reflection {
        return new Reflection(
            data.id,
            data.content,
            data.authorId,
            data.journeyId,
            data.guideSectionId,
            data.biblicalReferences,
        );
    }

    /** Creates domain Reflections from request DTOs; converts nested biblicalReferences DTO → domain here. */
    public static createArray(data: IReflectionDTO[]): Reflection[] {
        return data.map((item) =>
            this.create({
                id: item.id,
                content: item.content,
                authorId: item.authorId,
                journeyId: item.journeyId,
                guideSectionId: item.guideSectionId,
                biblicalReferences: BiblicalReferenceFactory.createArray(item.biblicalReferences),
            })
        );
    }
}