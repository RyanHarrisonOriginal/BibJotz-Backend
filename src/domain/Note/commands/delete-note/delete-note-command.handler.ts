import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { DeleteNoteCommand } from './delete-note.command';

export class DeleteNoteCommandHandler implements ICommandHandler<DeleteNoteCommand, void> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(command: DeleteNoteCommand): Promise<void> {
    const existing = await this.noteRepository.findById(command.id);
    if (!existing) throw new NotFoundError('Note not found');
    await this.noteRepository.deleteById(command.id);
  }
}
