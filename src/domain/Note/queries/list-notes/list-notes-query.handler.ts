import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { ListNotesQuery } from './list-notes.query';

export class ListNotesQueryHandler implements IQueryHandler<ListNotesQuery, Note[]> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(query: ListNotesQuery): Promise<Note[]> {
    const rows = await this.noteRepository.findMany({
      userId: query.userId,
      bookName: query.bookName,
      chapter: query.chapter,
      scope: query.scope,
    });
    return NoteMapper.mapNotesToDomain(rows);
  }
}
