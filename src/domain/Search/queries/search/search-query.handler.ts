import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { UserMapper } from '@/domain/User/user.mapper';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { IUserResponseDTO } from '@/domain/User/user.dto';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { SearchQuery } from './search.query';

export interface ISearchResult {
  people: IUserResponseDTO[];
  notes: INoteResponseDTO[];
}

export class SearchQueryHandler implements IQueryHandler<SearchQuery, ISearchResult> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(query: SearchQuery): Promise<ISearchResult> {
    const peoplePromise =
      query.type === 'notes'
        ? Promise.resolve([] as IUserResponseDTO[])
        : this.userRepository
            .search({ query: query.q, limit: query.limit })
            .then((rows) => rows.map((row) => UserMapper.mapUserToResponseDTO(UserMapper.mapUserToDomain(row))));

    const notesPromise =
      query.type === 'people'
        ? Promise.resolve([] as INoteResponseDTO[])
        : this.noteRepository
            .searchPublic({ query: query.q, limit: query.limit })
            .then((rows) => NoteMapper.mapRawNotesToResponseDTO(rows));

    const [people, notes] = await Promise.all([peoplePromise, notesPromise]);
    return { people, notes };
  }
}
