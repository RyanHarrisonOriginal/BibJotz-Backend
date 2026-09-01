import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { DeleteReferenceCommand } from './delete-reference.command';

export class DeleteReferenceCommandHandler implements ICommandHandler<DeleteReferenceCommand, void> {
  constructor(private readonly referenceRepository: IReferenceRepository) {}

  async execute(command: DeleteReferenceCommand): Promise<void> {
    const existing = await this.referenceRepository.findById(command.id);
    if (!existing) throw new NotFoundError('Reference not found');
    await this.referenceRepository.deleteById(command.id);
  }
}
