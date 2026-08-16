import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';
import { Note } from '@/domain/Note/note';
import { NoteFactory } from '@/domain/Note/note-factory';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { CreateNoteCommand } from './create-note.command';

export class CreateNoteCommandHandler implements ICommandHandler<CreateNoteCommand, Note> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(command: CreateNoteCommand): Promise<Note> {
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
      }),
    });
    const saved = await this.noteRepository.save(note);
    return NoteMapper.mapNoteToDomain(saved);
  }
}
