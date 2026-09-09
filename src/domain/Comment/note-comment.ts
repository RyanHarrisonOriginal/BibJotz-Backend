import { ValidationError } from '@/domain/shared/errors/validation-error';

export class NoteComment {
  constructor(
    private readonly id: number | null,
    private readonly noteId: number,
    private readonly userId: number,
    private content: string,
    private deletedAt: Date | null = null,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {
    if (!noteId) throw new ValidationError('noteId is required');
    if (!userId) throw new ValidationError('userId is required');
    NoteComment.assertContent(content);
  }

  getId(): number | null {
    return this.id;
  }

  getNoteId(): number {
    return this.noteId;
  }

  getUserId(): number {
    return this.userId;
  }

  getContent(): string {
    return this.content;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  softDelete(): void {
    if (this.deletedAt) return;
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  private static assertContent(content: string): void {
    if (!content?.trim()) throw new ValidationError('Comment content cannot be empty');
    if (content.trim().length > 1000) {
      throw new ValidationError('Comment content must be 1000 characters or fewer');
    }
  }
}
