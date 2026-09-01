import { BaseEntity } from '@/domain/shared/base-entity';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { displayLabel, normalizeLabel } from '@/domain/Reference/normalize-label';

export const REFERENCE_TYPE_NAME_MAX = 80;

export class ReferenceType extends BaseEntity {
  constructor(
    id: number | null,
    private readonly userId: number,
    private name: string,
    private normalizedName: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    if (!userId) throw new ValidationError('userId is required');
    ReferenceType.assertName(name, normalizedName);
  }

  getUserId(): number {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getNormalizedName(): string {
    return this.normalizedName;
  }

  rename(name: string): void {
    const display = displayLabel(name);
    const normalized = normalizeLabel(name);
    ReferenceType.assertName(display, normalized);
    this.name = display;
    this.normalizedName = normalized;
    this.touch();
  }

  static parseName(name: string): { name: string; normalizedName: string } {
    const display = displayLabel(name);
    const normalized = normalizeLabel(name);
    ReferenceType.assertName(display, normalized);
    return { name: display, normalizedName: normalized };
  }

  private static assertName(name: string, normalizedName: string): void {
    if (!normalizedName) throw new ValidationError('Type name is required');
    if (name.length > REFERENCE_TYPE_NAME_MAX) {
      throw new ValidationError(`Type name cannot exceed ${REFERENCE_TYPE_NAME_MAX} characters`);
    }
  }
}
