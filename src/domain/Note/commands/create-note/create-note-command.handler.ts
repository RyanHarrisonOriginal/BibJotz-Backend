import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';
import { Note } from '@/domain/Note/note';
import { NoteFactory } from '@/domain/Note/note-factory';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { TaggedReference } from '@/domain/Note/tagged-reference';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { CreateNoteCommand } from './create-note.command';

export class CreateNoteCommandHandler implements ICommandHandler<CreateNoteCommand, Note> {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(command: CreateNoteCommand): Promise<Note> {
    const taggedReferences: TaggedReference[] = [];
    for (const referenceId of command.referenceIds) {
      const row = await this.referenceRepository.findById(referenceId);
      if (!row) throw new NotFoundError('Reference not found');
      const reference = ReferenceMapper.mapReferenceToDomain(row);
      if (reference.getUserId() !== command.userId) {
        throw new ValidationError('Reference does not belong to this user');
      }
      taggedReferences.push(TaggedReference.fromReference(reference));
    }

    const note = NoteFactory.create({
      id: null,
      userId: command.userId,
      content: command.content,
      scriptureReference: ScriptureReference.create({
        bookName: command.bookName,
        bookShortName: command.bookShortName,
        chapter: command.chapter,
        startVerse: command.startVerse,
        endVerse: command.endVerse,
        verses: command.verses,
      }),
      taggedReferences,
    });
    const saved = await this.noteRepository.save(note);
    return NoteMapper.mapNoteToDomain(saved);
  }
}
