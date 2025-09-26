export class BiblicalReference {
    constructor(
        private readonly book: string,
        private readonly chapter: number,
        private readonly startVerse: number,
        private readonly endVerse: number
    ) {}

    static create(book: string, chapter: number, startVerse: number, endVerse: number): BiblicalReference {
        if (!book) {
            throw new Error('Book is required');
        }
        if (!chapter) {
            throw new Error('Chapter is required');
        }
        if (!startVerse) {
            throw new Error('Start verse is required');
        }
        if (!endVerse) {
            throw new Error('End verse is required');
        }
        return new BiblicalReference(book, chapter, startVerse, endVerse);
    }

    getBook(): string {
        return this.book;
    }

    getChapter(): number {
        return this.chapter;
    }
    
    getStartVerse(): number {
        return this.startVerse;
    }

    getEndVerse(): number {
        return this.endVerse;
    }
    
    equals(other: BiblicalReference): boolean {
        return this.book === other.book && this.chapter === other.chapter && this.startVerse === other.startVerse && this.endVerse === other.endVerse;
    }
}