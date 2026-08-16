import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { GetNoteQuery } from './get-note.query';

export class GetNoteQueryHandler implements IQueryHandler<GetNoteQuery, Note> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(query: GetNoteQuery): Promise<Note> {
    const row = await this.noteRepository.findById(query.id);
    if (!row) throw new NotFoundError('Note not found');
    return NoteMapper.mapNoteToDomain(row);
  }
}
