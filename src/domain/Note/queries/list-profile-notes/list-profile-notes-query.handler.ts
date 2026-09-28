import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { ListProfileNotesQuery } from './list-profile-notes.query';

export class ListProfileNotesQueryHandler
  implements IQueryHandler<ListProfileNotesQuery, INoteResponseDTO[]>
{
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(query: ListProfileNotesQuery): Promise<INoteResponseDTO[]> {
    const rows = await this.noteRepository.findVisibleProfileNotes({
      authorUserId: query.authorUserId,
      viewerUserId: query.viewerUserId,
    });
    return NoteMapper.mapRawNotesToResponseDTO(rows);
  }
}
