import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { GetFeedQuery } from './get-feed.query';

export class GetFeedQueryHandler implements IQueryHandler<GetFeedQuery, INoteResponseDTO[]> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(query: GetFeedQuery): Promise<INoteResponseDTO[]> {
    const rows = await this.noteRepository.findFeedForUser({
      viewerUserId: query.userId,
      limit: query.limit,
    });
    return NoteMapper.mapRawNotesToResponseDTO(rows);
  }
}
