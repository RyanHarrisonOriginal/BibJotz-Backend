import { QueryBus } from './query-bus';
import { IBibleRepository } from '@/domain/Bible/bible-repository.interface';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { GetBooksQueryHandler } from '@/domain/Bible/queries/get-books/get-books-query.handler';
import { GetBookInfoQueryHandler } from '@/domain/Bible/queries/get-book-info/get-book-info-query.handler';
import { GetChapterInfoQueryHandler } from '@/domain/Bible/queries/get-chapter-info/get-chapter-info-query.handler';
import { GetPassageQueryHandler } from '@/domain/Bible/queries/get-passage/get-passage-query.handler';
import { GetTranslationsQueryHandler } from '@/domain/Bible/queries/get-translations/get-translations-query.handler';
import { GetNoteQueryHandler } from '@/domain/Note/queries/get-note/get-note-query.handler';
import { ListNotesQueryHandler } from '@/domain/Note/queries/list-notes/list-notes-query.handler';
import { GetNoteStreakQueryHandler } from '@/domain/Note/queries/get-note-streak/get-note-streak-query.handler';
import { GetFeedQueryHandler } from '@/domain/Note/queries/get-feed/get-feed-query.handler';
import { ListProfileNotesQueryHandler } from '@/domain/Note/queries/list-profile-notes/list-profile-notes-query.handler';
import { GetUserQueryHandler } from '@/domain/User/queries/get-user/get-user-query.handler';
import { ListReferenceTypesQueryHandler } from '@/domain/Reference/queries/list-reference-types/list-reference-types-query.handler';
import { GetReferenceQueryHandler } from '@/domain/Reference/queries/get-reference/get-reference-query.handler';
import { ListReferencesQueryHandler } from '@/domain/Reference/queries/list-references/list-references-query.handler';
import { ListFollowersQueryHandler } from '@/domain/Follow/queries/list-followers/list-followers-query.handler';
import { ListFollowingQueryHandler } from '@/domain/Follow/queries/list-following/list-following-query.handler';
import { ListCommentsQueryHandler } from '@/domain/Comment/queries/list-comments/list-comments-query.handler';
import { SearchQueryHandler } from '@/domain/Search/queries/search/search-query.handler';

export interface IQueryBusSetup {
  bibleRepository: IBibleRepository;
  noteRepository: INoteRepository;
  userRepository: IUserRepository;
  referenceRepository: IReferenceRepository;
  referenceTypeRepository: IReferenceTypeRepository;
  followRepository: IFollowRepository;
  commentRepository: ICommentRepository;
}

export function setupQueryBus(setup: IQueryBusSetup): QueryBus {
  const queryBus = new QueryBus();

  queryBus.registerHandler('GetBooksQuery', new GetBooksQueryHandler(setup.bibleRepository));
  queryBus.registerHandler('GetBookInfoQuery', new GetBookInfoQueryHandler(setup.bibleRepository));
  queryBus.registerHandler('GetChapterInfoQuery', new GetChapterInfoQueryHandler(setup.bibleRepository));
  queryBus.registerHandler('GetPassageQuery', new GetPassageQueryHandler(setup.bibleRepository));
  queryBus.registerHandler('GetTranslationsQuery', new GetTranslationsQueryHandler(setup.bibleRepository));
  queryBus.registerHandler('GetNoteQuery', new GetNoteQueryHandler(setup.noteRepository));
  queryBus.registerHandler('ListNotesQuery', new ListNotesQueryHandler(setup.noteRepository));
  queryBus.registerHandler('GetNoteStreakQuery', new GetNoteStreakQueryHandler(setup.noteRepository));
  queryBus.registerHandler('GetFeedQuery', new GetFeedQueryHandler(setup.noteRepository));
  queryBus.registerHandler(
    'ListProfileNotesQuery',
    new ListProfileNotesQueryHandler(setup.noteRepository),
  );
  queryBus.registerHandler('GetUserQuery', new GetUserQueryHandler(setup.userRepository));
  queryBus.registerHandler(
    'ListReferenceTypesQuery',
    new ListReferenceTypesQueryHandler(setup.referenceTypeRepository),
  );
  queryBus.registerHandler('GetReferenceQuery', new GetReferenceQueryHandler(setup.referenceRepository));
  queryBus.registerHandler('ListReferencesQuery', new ListReferencesQueryHandler(setup.referenceRepository));
  queryBus.registerHandler(
    'ListFollowersQuery',
    new ListFollowersQueryHandler(setup.followRepository),
  );
  queryBus.registerHandler(
    'ListFollowingQuery',
    new ListFollowingQueryHandler(setup.followRepository),
  );
  queryBus.registerHandler(
    'ListCommentsQuery',
    new ListCommentsQueryHandler(
      setup.commentRepository,
      setup.noteRepository,
      setup.followRepository,
    ),
  );
  queryBus.registerHandler(
    'SearchQuery',
    new SearchQueryHandler(setup.userRepository, setup.noteRepository),
  );

  return queryBus;
}
