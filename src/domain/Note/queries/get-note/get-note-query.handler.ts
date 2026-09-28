import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { canViewNote, resolveFollowGrant, viewableNoteFrom } from '@/domain/Note/can-view-note';
import { GetNoteQuery } from './get-note.query';

export class GetNoteQueryHandler implements IQueryHandler<GetNoteQuery, Note> {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly followRepository: IFollowRepository,
  ) {}

  async execute(query: GetNoteQuery): Promise<Note> {
    const row = await this.noteRepository.findById(query.id);
    if (!row) throw new NotFoundError('Note not found');

    const note = NoteMapper.mapNoteToDomain(row);
    const view = viewableNoteFrom(note);
    const followGrant = await resolveFollowGrant(this.followRepository, query.viewerUserId, view);
    if (!canViewNote({ id: query.viewerUserId }, view, followGrant)) {
      throw new NotFoundError('Note not found');
    }

    return note;
  }
}
