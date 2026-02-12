import { BiblicalReference } from "./biblical-reference";
import { IBiblicalReferenceDTO } from "./biblical-reference.dto";

export class BiblicalReferenceMapper {

    public static mapBiblicalReferenceToDomain(biblicalReference: any): BiblicalReference {
        return new BiblicalReference(
            biblicalReference.id,
            biblicalReference.book,
            biblicalReference.chapter,
            biblicalReference.startVerse,
            biblicalReference.endVerse
        );
    }

    public static mapBiblicalReferencesToDomain(biblicalReferences: any[]): BiblicalReference[] {
        return biblicalReferences.map((biblicalReference) => this.mapBiblicalReferenceToDomain(biblicalReference));
    }

    public static mapBiblicalReferenceToDTO(ref: BiblicalReference): IBiblicalReferenceDTO {
        return {
            id: ref.getId() ?? 0,
            book: ref.getBook(),
            chapter: ref.getChapter(),
            startVerse: ref.getStartVerse(),
            endVerse: ref.getEndVerse(),
        };
    }

    public static mapBiblicalReferencesToDTO(refs: BiblicalReference[]): IBiblicalReferenceDTO[] {
        return refs.map((ref) => this.mapBiblicalReferenceToDTO(ref));
    }
}   