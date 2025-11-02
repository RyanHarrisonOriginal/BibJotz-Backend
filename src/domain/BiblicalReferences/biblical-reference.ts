export class BiblicalReference {
    constructor(
        private readonly id: number | null,
        private readonly book: string,
        private readonly chapter: number,
        private readonly startVerse: number,
        private readonly endVerse: number
    ) {}


    getId(): number | null {
        return this.id ?? 0;
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