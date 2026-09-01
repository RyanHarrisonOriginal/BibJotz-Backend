import { BaseEntity } from '@/domain/shared/base-entity';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { TaggedReference } from '@/domain/Note/tagged-reference';

export class Note extends BaseEntity {
  constructor(
    id: number | null,
    private readonly userId: number,
    private content: string,
    private scriptureReference: ScriptureReference,
    private taggedReferences: TaggedReference[] = [],
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

  getTaggedReferences(): TaggedReference[] {
    return [...this.taggedReferences];
  }

  getTaggedReferenceIds(): number[] {
    return this.taggedReferences.map((tag) => tag.id);
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

  tagReference(reference: TaggedReference): void {
    if (this.taggedReferences.some((tag) => tag.id === reference.id)) return;
    this.taggedReferences = [...this.taggedReferences, reference];
    this.touch();
  }

  untagReference(referenceId: number): void {
    const next = this.taggedReferences.filter((tag) => tag.id !== referenceId);
    if (next.length === this.taggedReferences.length) {
      throw new ValidationError('That reference is not tagged on this note');
    }
    this.taggedReferences = next;
    this.touch();
  }

  replaceTaggedReferences(references: TaggedReference[]): void {
    const seen = new Set<number>();
    const unique: TaggedReference[] = [];
    for (const reference of references) {
      if (seen.has(reference.id)) continue;
      seen.add(reference.id);
      unique.push(reference);
    }
    this.taggedReferences = unique;
    this.touch();
  }

  private static assertContent(content: string): void {
    if (!content || !content.trim()) {
      throw new ValidationError('Note content cannot be empty');
    }
  }
}
