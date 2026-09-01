import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { TaggedReference } from '@/domain/Note/tagged-reference';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { TagNoteCommand } from './tag-note.command';

export class TagNoteCommandHandler implements ICommandHandler<TagNoteCommand, Note> {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(command: TagNoteCommand): Promise<Note> {
    const existing = await this.noteRepository.findById(command.noteId);
    if (!existing) throw new NotFoundError('Note not found');

    const referenceRow = await this.referenceRepository.findById(command.referenceId);
    if (!referenceRow) throw new NotFoundError('Reference not found');

    const note = NoteMapper.mapNoteToDomain(existing);
    const reference = ReferenceMapper.mapReferenceToDomain(referenceRow);
    if (reference.getUserId() !== note.getUserId()) {
      throw new ValidationError('Reference does not belong to this user');
    }

    note.tagReference(TaggedReference.fromReference(reference));
    const saved = await this.noteRepository.save(note);
    return NoteMapper.mapNoteToDomain(saved);
  }
}
