import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { UpdateNoteCommand } from './update-note.command';

export class UpdateNoteCommandHandler implements ICommandHandler<UpdateNoteCommand, Note> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(command: UpdateNoteCommand): Promise<Note> {
    const existing = await this.noteRepository.findById(command.id);
    if (!existing) throw new NotFoundError('Note not found');

    const note = NoteMapper.mapNoteToDomain(existing);

    if (command.content !== undefined) {
      note.updateContent(command.content);
    }

    const current = note.getScriptureReference();
    const wantsRetarget =
      command.bookName !== undefined ||
      command.bookShortName !== undefined ||
      command.chapter !== undefined ||
      command.startVerse !== undefined ||
      command.endVerse !== undefined;

    if (wantsRetarget) {
      note.retarget(
        ScriptureReference.create({
          bookName: command.bookName ?? current.bookName,
          bookShortName: command.bookShortName ?? current.bookShortName,
          chapter: command.chapter !== undefined ? command.chapter : current.chapter,
          startVerse: command.startVerse !== undefined ? command.startVerse : current.startVerse,
          endVerse: command.endVerse !== undefined ? command.endVerse : current.endVerse,
        }),
      );
    }

    const saved = await this.noteRepository.save(note);
    return NoteMapper.mapNoteToDomain(saved);
  }
}
