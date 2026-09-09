import { PrismaClient } from '@/generated/app-client';
import { NoteComment } from '@/domain/Comment/note-comment';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';

const commentInclude = {
  user: {
    select: {
      id: true,
      displayName: true,
      username: true,
    },
  },
} as const;

export class CommentPostgresRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(comment: NoteComment): Promise<unknown> {
    const created = await this.prisma.noteComment.create({
      data: {
        noteId: comment.getNoteId(),
        userId: comment.getUserId(),
        content: comment.getContent().trim(),
      },
    });
    return this.prisma.noteComment.findUniqueOrThrow({
      where: { id: created.id },
      include: commentInclude,
    });
  }

  async findById(id: number): Promise<unknown | null> {
    return this.prisma.noteComment.findUnique({
      where: { id },
      include: commentInclude,
    });
  }

  async findByNoteId(noteId: number): Promise<unknown[]> {
    return this.prisma.noteComment.findMany({
      where: {
        noteId,
        deletedAt: null,
      },
      include: commentInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  async softDelete(comment: NoteComment): Promise<unknown> {
    const id = comment.getId();
    if (!id) throw new Error('Comment id is required for soft delete');
    return this.prisma.noteComment.update({
      where: { id },
      data: {
        deletedAt: comment.getDeletedAt() ?? new Date(),
        updatedAt: comment.getUpdatedAt(),
      },
      include: commentInclude,
    });
  }
}
