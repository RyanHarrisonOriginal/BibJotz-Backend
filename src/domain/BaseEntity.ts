export class BaseEntity {
    constructor(
        private readonly id: number|null,
        private readonly createdAt: Date,
        private updatedAt: Date
    ) {

        if (!createdAt) {
            throw new Error('Created at is required');
        }
        if (!updatedAt) {
            throw new Error('Updated at is required');
        }
    }

    getId(): number|null {
        return this.id;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }
    
    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    protected touch() {
        this.updatedAt = new Date();
    }
}