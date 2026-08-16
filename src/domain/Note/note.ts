import { BaseEntity } from '@/domain/shared/base-entity';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';
import { ValidationError } from '@/domain/shared/errors/validation-error';

export class Note extends BaseEntity {
  constructor(
    id: number | null,
    private readonly userId: number,
    private content: string,
    private scriptureReference: ScriptureReference,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    if (!userId) throw new ValidationError('userId is required');
    Note.assertContent(content);
  }

  getUserId(): number {
    return this.userId;
  }

  getContent(): string {
    return this.content;
  }

  getScriptureReference(): ScriptureReference {
    return this.scriptureReference;
  }

  updateContent(content: string): void {
    Note.assertContent(content);
    this.content = content;
    this.touch();
  }

  retarget(reference: ScriptureReference): void {
    this.scriptureReference = reference;
    this.touch();
  }

  private static assertContent(content: string): void {
    if (!content || !content.trim()) {
      throw new ValidationError('Note content cannot be empty');
    }
  }
}
