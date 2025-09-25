export class URL {
    private constructor(private readonly value: string) {}

    static create(value: string): URL {
        if (!value) {
            throw new Error('URL is required');
        }
        // Basic URL validation using the URL constructor
        try {
            // Throws if invalid
            new URL(value);
        } catch {
            throw new Error('Invalid URL');
        }
        return new URL(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: URL): boolean {
        return this.value === other.value;
    }
}
