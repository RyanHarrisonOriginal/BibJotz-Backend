import { BaseEntity } from '@/domain/shared/base-entity';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { displayLabel, normalizeLabel } from '@/domain/Reference/normalize-label';

export const REFERENCE_TITLE_MAX = 200;
export const REFERENCE_AUTHOR_MAX = 200;

export class Reference extends BaseEntity {
  constructor(
    id: number | null,
    private readonly userId: number,
    private typeId: number,
    private typeName: string,
    private title: string,
    private normalizedTitle: string,
    private author: string | null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    if (!userId) throw new ValidationError('userId is required');
    if (!typeId) throw new ValidationError('typeId is required');
    Reference.assertTitle(title, normalizedTitle);
    Reference.assertAuthor(author);
  }

  getUserId(): number {
    return this.userId;
  }

  getTypeId(): number {
    return this.typeId;
  }

  getTypeName(): string {
    return this.typeName;
  }

  getTitle(): string {
    return this.title;
  }

  getNormalizedTitle(): string {
    return this.normalizedTitle;
  }

  getAuthor(): string | null {
    return this.author;
  }

  retitle(title: string): void {
    const parsed = Reference.parseTitle(title);
    this.title = parsed.title;
    this.normalizedTitle = parsed.normalizedTitle;
    this.touch();
  }

  retype(typeId: number, typeName: string): void {
    if (!typeId) throw new ValidationError('typeId is required');
    if (!typeName?.trim()) throw new ValidationError('typeName is required');
    this.typeId = typeId;
    this.typeName = typeName.trim();
    this.touch();
  }

  setAuthor(author: string | null): void {
    const parsed = Reference.parseAuthor(author);
    Reference.assertAuthor(parsed);
    this.author = parsed;
    this.touch();
  }

  static parseTitle(title: string): { title: string; normalizedTitle: string } {
    const display = displayLabel(title);
    const normalized = normalizeLabel(title);
    Reference.assertTitle(display, normalized);
    return { title: display, normalizedTitle: normalized };
  }

  static parseAuthor(author: string | null | undefined): string | null {
    if (author == null) return null;
    const display = displayLabel(author);
    return display.length > 0 ? display : null;
  }

  private static assertTitle(title: string, normalizedTitle: string): void {
    if (!normalizedTitle) throw new ValidationError('Title is required');
    if (title.length > REFERENCE_TITLE_MAX) {
      throw new ValidationError(`Title cannot exceed ${REFERENCE_TITLE_MAX} characters`);
    }
  }

  private static assertAuthor(author: string | null): void {
    if (author && author.length > REFERENCE_AUTHOR_MAX) {
      throw new ValidationError(`Author cannot exceed ${REFERENCE_AUTHOR_MAX} characters`);
    }
  }
}
