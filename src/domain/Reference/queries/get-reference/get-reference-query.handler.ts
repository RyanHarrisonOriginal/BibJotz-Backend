import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { Reference } from '@/domain/Reference/reference';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { canViewNote, FollowGrant, resolveFollowGrant, viewableNoteFrom } from '@/domain/Note/can-view-note';
import { GetReferenceQuery } from './get-reference.query';

export class GetReferenceQueryHandler implements IQueryHandler<GetReferenceQuery, Reference> {
  constructor(
    private readonly referenceRepository: IReferenceRepository,
    private readonly noteRepository: INoteRepository,
    private readonly followRepository: IFollowRepository,
  ) {}

  async execute(query: GetReferenceQuery): Promise<Reference> {
    const row = await this.referenceRepository.findById(query.id);
    if (!row) throw new NotFoundError('Reference not found');

    const reference = ReferenceMapper.mapReferenceToDomain(row);
    if (reference.getUserId() === query.viewerUserId) return reference;

    const noteRows = await this.noteRepository.findManyByReferenceId(query.id);
    const followCache = new Map<number, FollowGrant>();
    for (const noteRow of noteRows) {
      const view = viewableNoteFrom(NoteMapper.mapNoteToDomain(noteRow));
      const followGrant = await resolveFollowGrant(
        this.followRepository,
        query.viewerUserId,
        view,
        followCache,
      );
      if (canViewNote({ id: query.viewerUserId }, view, followGrant)) return reference;
    }

    throw new NotFoundError('Reference not found');
  }
}
