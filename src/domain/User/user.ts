import { BaseEntity } from '@/domain/shared/base-entity';
import { ValidationError } from '@/domain/shared/errors/validation-error';

export class User extends BaseEntity {
  constructor(
    id: number | null,
    private readonly displayName: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    if (!displayName?.trim()) throw new ValidationError('displayName is required');
  }

  getDisplayName(): string {
    return this.displayName;
  }
}
