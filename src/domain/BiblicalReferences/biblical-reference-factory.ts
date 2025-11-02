import { BiblicalReference } from "./biblical-reference";
import { IBiblicalReferenceDTO } from "./biblical-reference.dto";


export class BiblicalReferenceFactory {

    public static create(biblicalReference: IBiblicalReferenceDTO): BiblicalReference {
        if (!biblicalReference.book) {
            throw new Error('Book is required');
        }
        if (!biblicalReference.chapter) {
            throw new Error('Chapter is required');
        }
        if (!biblicalReference.startVerse) {
            throw new Error('Start verse is required');
        }
        if (!biblicalReference.endVerse) {
            throw new Error('End verse is required');
        }

        return new BiblicalReference(
            biblicalReference.id,
            biblicalReference.book,
            biblicalReference.chapter,
            biblicalReference.startVerse,
            biblicalReference.endVerse
        );
    }
}