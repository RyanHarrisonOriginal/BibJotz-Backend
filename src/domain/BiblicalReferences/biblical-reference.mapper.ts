import { BiblicalReference } from "./biblical-reference";



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
}   