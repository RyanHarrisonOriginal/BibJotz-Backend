export class Email {
    private constructor(private readonly value: string) {}

    static create(value: string): Email {
        if (!value) {
            throw new Error('Email is required');
        }
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(value)) {
            throw new Error('Invalid email address');
        }
        return new Email(value.toLowerCase());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

}