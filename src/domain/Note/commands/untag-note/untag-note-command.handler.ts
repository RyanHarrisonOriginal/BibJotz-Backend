import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { UntagNoteCommand } from './untag-note.command';

export class UntagNoteCommandHandler implements ICommandHandler<UntagNoteCommand, Note> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(command: UntagNoteCommand): Promise<Note> {
    const existing = await this.noteRepository.findById(command.noteId);
    if (!existing) throw new NotFoundError('Note not found');

    const note = NoteMapper.mapNoteToDomain(existing);
    if (!note.getTaggedReferenceIds().includes(command.referenceId)) {
      throw new NotFoundError('That reference is not tagged on this note');
    }
    note.untagReference(command.referenceId);
    const saved = await this.noteRepository.save(note);
    return NoteMapper.mapNoteToDomain(saved);
  }
}
