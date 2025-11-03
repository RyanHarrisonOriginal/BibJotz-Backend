import { Reflection } from "@/domain/Reflection/reflection";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";
import { BiblicalReferenceFactory } from "@/domain/BiblicalReferences/biblical-reference-factory";


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
            BiblicalReferenceFactory.createArray(data.biblicalReferences),
        );
    }

    public static createArray(data: IReflectionDTO[]): Reflection[] {
        return data.map((item) => this.create({
            id: item.id,
            content: item.content,
            authorId: item.authorId,
            journeyId: item.journeyId,
            guideSectionId: item.guideSectionId,
            biblicalReferences: item.biblicalReferences,
        }));
    }
}