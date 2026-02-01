export class PhoneNumber {
    private constructor(private readonly value: string) {}

    static create(value: string): PhoneNumber {
        if (!value) {
            throw new Error('Phone number is required');
        }
        const digits = value.replace(/\D/g, '');
        if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) {
            throw new Error('Invalid phone number format');
        }
        return new PhoneNumber(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: PhoneNumber): boolean {
        const normalize = (val: string) => val.replace(/\D/g, '');
        return normalize(this.value) === normalize(other.value);
    }
}
